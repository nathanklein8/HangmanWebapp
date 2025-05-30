-- DropForeignKey
ALTER TABLE "DailyWord" DROP CONSTRAINT "DailyWord_wordId_fkey";

-- AddForeignKey
ALTER TABLE "DailyWord" ADD CONSTRAINT "DailyWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
