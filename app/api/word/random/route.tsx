import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {

    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get('id');

    if (idParam) {
      const id = parseInt(idParam, 10);
      if (isNaN(id)) {
        return NextResponse.json({ error: 'Invalid id parameter' }, { status: 400 });
      }
      const data = await prisma.word.findUnique({ where: { id } });
      if (!data) {
        return NextResponse.json({ error: `No word found with id ${id}` }, { status: 404 });
      }
      return NextResponse.json(data);
    }

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

    return NextResponse.json({
      played: false, // only needed for daily word, have it here for consistent usage in front end
      word: word
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
