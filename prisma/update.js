const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const filePath = path.join(process.cwd(), 'data', 'filtered_words.txt');
const fileContent = fs.readFileSync(filePath, 'utf-8');

const wordList = fileContent.split('\n').map(w => w.trim()).filter(Boolean);
const BATCH_SIZE = 1000;

async function main() {
  // Step 1: Insert new words
  for (let i = 0; i < wordList.length; i += BATCH_SIZE) {
    const chunk = wordList.slice(i, i + BATCH_SIZE).map(text => ({ text }));
    await prisma.word.createMany({
      data: chunk,
      skipDuplicates: true,
    });
  }

  // Step 2: Fetch all existing words in the database
  const existingWords = await prisma.word.findMany({
    select: { text: true }
  });
  const existingWordTexts = new Set(existingWords.map(w => w.text));

  // Step 3: Determine which words to delete
  const keepWords = new Set(wordList);
  const wordsToDelete = Array.from(existingWordTexts).filter(text => !keepWords.has(text));

  // Step 4: Delete words in chunks
  for (let i = 0; i < wordsToDelete.length; i += BATCH_SIZE) {
    const chunk = wordsToDelete.slice(i, i + BATCH_SIZE);
    await prisma.word.deleteMany({
      where: {
        text: { in: chunk },
      },
    });
  }

}

main()
    .then(() => console.log("Success!"))
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
