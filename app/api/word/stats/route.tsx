import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json({ error: 'Missing word ID' }, { status: 400 });
    }

    const wordId = parseInt(idParam);
    if (isNaN(wordId)) {
      return NextResponse.json({ error: 'Invalid word ID' }, { status: 400 });
    }

    const attempts = await prisma.wordAttempt.findMany({
      where: { wordId },
    });

    const totalAttempts = attempts.length;
    const totalWins = attempts.filter((a) => a.won).length;

    const histogram: Record<number, number> = {};
    for (const attempt of attempts) {
      if (attempt.won) {
        histogram[attempt.mistakes] = (histogram[attempt.mistakes] || 0) + 1;
      }
    }

    const chartData = Array.from({ length: 6 }, (_, i) => ({
      amount: i.toString(),
      count: histogram[i] ?? 0,
    }));

    return NextResponse.json({
      totalAttempts,
      totalWins,
      winPercentage: totalAttempts > 0 ? Math.round((totalWins / totalAttempts) * 100) : 0,
      histogram: chartData,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
