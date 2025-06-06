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

    try {
      const { guesses: guesses, hintLetters: hintLetters }
        = !!alreadyPlayed
          ? await getDailyGuesses()
          : { guesses: null, hintLetters: null }

      return NextResponse.json({
        played: !!alreadyPlayed, // !! means to bool ?
        word: daily.word,
        guesses: guesses,
        hintLetters: hintLetters,
      });
    } catch (e) { // catch error reading in saved state cookie
      return NextResponse.json({
        played: !!alreadyPlayed, // !! means to bool ?
        word: daily.word,
        guesses: null,
        hintLetters: null,
      });
    }


  } catch (e) {
    console.error(e);
    return NextResponse.json({
      error: 'Server error'
    }, {
      status: 500
    });
  }
}
