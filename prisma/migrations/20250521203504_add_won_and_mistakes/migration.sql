/*
  Warnings:

  - Added the required column `mistakes` to the `DailyAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `won` to the `DailyAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyAttempt" ADD COLUMN     "mistakes" INTEGER NOT NULL,
ADD COLUMN     "won" BOOLEAN NOT NULL;
