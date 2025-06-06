import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getOrCreateAnonymousId, setDailyGuesses } from '@/lib/cookies';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const {
      won,
      mistakes,
      wordId,
      guesses,
      hintLetters,
    } = await req.json();

    if (typeof won !== 'boolean'
      || typeof mistakes !== 'number'
      || typeof wordId !== 'number') {
      return NextResponse.json({ error: 'Invalid payload:' }, { status: 400 });
    }

    const { id: userToken } = await getOrCreateAnonymousId();
    if (guesses) {
      await setDailyGuesses(guesses, hintLetters)
    }

    // Insert attempt
    const result = await prisma.wordAttempt.create({
      data: {
        userToken,
        date: new Date(), // timestamp
        wordId,
        won,
        mistakes,
      },
    });

    return NextResponse.json({
      success: true,
      result: result
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
