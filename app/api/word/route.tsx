import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [min, max] = await prisma.$transaction([
      prisma.word.findFirst({ orderBy: { id: 'asc' }, select: { id: true } }),
      prisma.word.findFirst({ orderBy: { id: 'desc' }, select: { id: true } }),
    ]);

    if (!min || !max) {
      return NextResponse.json({ error: 'No words found' }, { status: 404 });
    }

    let word = null;
    while (!word) {
      const randomId = Math.floor(Math.random() * (max.id - min.id + 1)) + min.id;
      word = await prisma.word.findUnique({ where: { id: randomId } });
    }

    return NextResponse.json(word);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
