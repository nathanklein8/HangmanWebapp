/*
  Warnings:

  - The primary key for the `Word` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hasDefinition` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `timesAttempted` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `timesShown` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `timesSolved` on the `Word` table. All the data in the column will be lost.
  - You are about to drop the column `totalGuesses` on the `Word` table. All the data in the column will be lost.
  - The `id` column on the `Word` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Word" DROP CONSTRAINT "Word_pkey",
DROP COLUMN "hasDefinition",
DROP COLUMN "timesAttempted",
DROP COLUMN "timesShown",
DROP COLUMN "timesSolved",
DROP COLUMN "totalGuesses",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Word_pkey" PRIMARY KEY ("id");
