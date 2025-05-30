import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    // read wordId parameter
    const { id } = await params;
    
    if (id === 'all') {
      const allWords = await prisma.word.findMany();
      return NextResponse.json({
        count: allWords.length,
        words: allWords,
      });
    }

    // validate wordId parameter
    const wordId = parseInt(id);
    if (isNaN(wordId) || !Number.isInteger(wordId) || wordId < 0) {
      return NextResponse.json({
        error: 'Invalid word ID. Must be a positive integer.'
      }, { status: 400 }
      );
    }

    // fetch word with given id
    const word = await prisma.word.findUnique({
      where: { id: wordId },
    });

    // ensure a word was found
    if (!word) {
      return NextResponse.json({
        error: `No word matching ID: ${wordId}`
      }, { status: 404 });
    }

    // return OK response
    return NextResponse.json({
      played: false,
      word: word,
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json({
      error: 'Server error'
    }, { status: 500 });
  }
}
