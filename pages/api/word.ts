import type { NextApiRequest, NextApiResponse } from 'next'

import fs from 'fs';
import path from 'path';

type ResponseData = {
    word?: string,
    error?: string
}

const filePath = path.join(process.cwd(), 'data', 'filtered_words.txt');
const fileContent = fs.readFileSync(filePath, 'utf-8');
const wordList = fileContent.split('\n')

function getRandomWord() {
    const index = Math.floor(Math.random() * wordList.length);
    return wordList[index]
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
) {
    const index = 
    res.status(200).json({ word: getRandomWord() });
}
