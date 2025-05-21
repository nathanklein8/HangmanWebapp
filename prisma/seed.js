const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const filePath = path.join(process.cwd(), 'data', 'filtered_words.txt');
const fileContent = fs.readFileSync(filePath, 'utf-8');

const wordList = fileContent.split('\n').map(w => w.trim()).filter(Boolean);

async function main() {
  // Break the data into chunks to avoid hitting size limits
  const BATCH_SIZE = 1000;
  for (let i = 0; i < wordList.length; i += BATCH_SIZE) {
    const chunk = wordList.slice(i, i + BATCH_SIZE).map(text => ({ text }));
    await prisma.word.createMany({
      data: chunk,
      skipDuplicates: true, // avoids inserting duplicates
    });
  }
}

main()
    .then(() => console.log("Success!"))
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
