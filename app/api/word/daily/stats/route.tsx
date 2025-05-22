// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Get today's daily word
//     const dailyWord = await prisma.dailyWord.findUnique({
//       where: { date: today },
//     });

//     if (!dailyWord) {
//       return NextResponse.json({ error: 'No daily word found' }, { status: 404 });
//     }

//     // Get all attempts for this word
//     const attempts = await prisma.wordAttempt.findMany({
//       where: {
//         wordId: dailyWord.wordId,
//         date: today,
//       },
//     });

//     const totalAttempts = attempts.length;
//     const totalWins = attempts.filter(a => a.won).length;

//     // Create histogram of mistakes for winning attempts
//     const histogram: Record<number, number> = {};

//     for (const attempt of attempts) {
//       if (attempt.won) {
//         histogram[attempt.mistakes] = (histogram[attempt.mistakes] || 0) + 1;
//       }
//     }

//     return NextResponse.json({
//       totalAttempts,
//       totalWins,
//       winPercentage: totalAttempts > 0 ? Math.round((totalWins / totalAttempts) * 100) : 0,
//       histogram,
//     });
//   } catch (e) {
//     console.error(e);
//     return NextResponse.json({ error: 'Failed to compute stats' }, { status: 500 });
//   }
// }
