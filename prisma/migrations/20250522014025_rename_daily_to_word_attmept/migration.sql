/*
  Warnings:

  - You are about to drop the `DailyAttempt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DailyAttempt" DROP CONSTRAINT "DailyAttempt_wordId_fkey";

-- DropTable
DROP TABLE "DailyAttempt";

-- CreateTable
CREATE TABLE "WordAttempt" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "wordId" INTEGER NOT NULL,
    "userToken" TEXT NOT NULL,
    "won" BOOLEAN NOT NULL,
    "mistakes" INTEGER NOT NULL,

    CONSTRAINT "WordAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WordAttempt_date_userToken_key" ON "WordAttempt"("date", "userToken");

-- AddForeignKey
ALTER TABLE "WordAttempt" ADD CONSTRAINT "WordAttempt_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
