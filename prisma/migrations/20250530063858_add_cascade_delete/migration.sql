-- DropForeignKey
ALTER TABLE "WordAttempt" DROP CONSTRAINT "WordAttempt_wordId_fkey";

-- AddForeignKey
ALTER TABLE "WordAttempt" ADD CONSTRAINT "WordAttempt_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
