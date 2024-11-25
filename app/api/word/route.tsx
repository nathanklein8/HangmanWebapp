import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const filePath = path.join(process.cwd(), 'data', 'filtered_words.txt');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const wordList = fileContent.split('\n')

function getRandomWord() {
    const index = Math.floor(Math.random() * wordList.length);
    return wordList[index]
}

export async function GET(req: Request) {
    return NextResponse.json({ word: getRandomWord() })
}