import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getDailyGuesses, getOrCreateAnonymousId } from '@/lib/cookies';
import { endOfDay, startOfDay } from 'date-fns';

const prisma = new PrismaClient();

export async function GET() {
  const today = startOfDay(new Date());
  const { id: userToken } = await getOrCreateAnonymousId();

  try {
    // get daily word
    let daily = await prisma.dailyWord.findUnique({
      where: { date: today },
      include: { word: true },
    });

    // daily word hasn't been made yet, pick one
    if (!daily) {
      const [min, max] = await prisma.$transaction([
        prisma.word.findFirst({ orderBy: { id: 'asc' }, select: { id: true } }),
        prisma.word.findFirst({ orderBy: { id: 'desc' }, select: { id: true } }),
      ]);
      if (!min || !max) return NextResponse.json({ error: 'No words found' }, { status: 404 });
      let word = null;
      while (!word) {
        const randomId = Math.floor(Math.random() * (max.id - min.id + 1)) + min.id;
        word = await prisma.word.findUnique({
          where: {
            id: randomId
          }
        });
      }
      // create new entry for the daily word
      daily = await prisma.dailyWord.create({
        data: {
          date: today,
          wordId: word.id,
        },
        include: { word: true },
      });
    }

    const alreadyPlayed = await prisma.wordAttempt.findFirst({
      where: {
        date: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
        userToken,
        wordId: daily.word.id, // ensure it's the daily word
      },
    });
    
    const saved_game_state = await getDailyGuesses()
    return NextResponse.json({
      played: !!alreadyPlayed, // !! means to bool ?
      word: daily.word,
      guesses: saved_game_state.guesses,
      hintLetters: saved_game_state.hintLetters,
    });


  } catch (e) {
    console.error(e);
    return NextResponse.json({
      error: 'Server error'
    }, {
      status: 500
    });
  }
}
