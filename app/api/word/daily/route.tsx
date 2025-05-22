import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getOrCreateAnonymousId } from '@/lib/cookies';
import { startOfDay } from 'date-fns';

const prisma = new PrismaClient();

export async function GET() {
  const today = startOfDay(new Date());
  const { id: userToken } = await getOrCreateAnonymousId();

  try {
    // Check if user has already played today
    const alreadyPlayed = await prisma.wordAttempt.findFirst({
      where: {
        date: today,
        userToken,
      },
    });

    // if (alreadyPlayed) {
    //   return NextResponse.json({ played: true, word: null });
    // }

    // Get or create today's daily word
    let daily = await prisma.dailyWord.findUnique({
      where: { date: today },
      include: { word: true },
    });

    if (!daily) {
      // Pick a new random word \
      const [min, max] = await prisma.$transaction([
        prisma.word.findFirst({ orderBy: { id: 'asc' }, select: { id: true } }),
        prisma.word.findFirst({ orderBy: { id: 'desc' }, select: { id: true } }),
      ]);

      // should never happen
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

    return NextResponse.json({
      played: alreadyPlayed,
      word: daily.word
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
