import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getOrCreateAnonymousId } from '@/lib/cookies';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { won, mistakes, wordId } = await req.json();

    if (typeof won !== 'boolean'
      || typeof mistakes !== 'number'
      || typeof wordId !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { id: userToken } = await getOrCreateAnonymousId();

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight

    // Check if user already submitted today
    const existing = await prisma.wordAttempt.findFirst({
      where: {
        userToken,
        date: today,
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already submitted today' }, { status: 403 });
    }

    // Insert attempt
    const result = await prisma.wordAttempt.create({
      data: {
        userToken,
        date: today,
        wordId,
        won,
        mistakes,
      },
    });

    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
