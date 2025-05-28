-- CreateTable
CREATE TABLE "DailyWord" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "DailyWord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyAttempt" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "wordId" INTEGER NOT NULL,
    "userToken" TEXT NOT NULL,

    CONSTRAINT "DailyAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyWord_date_key" ON "DailyWord"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyAttempt_date_userToken_key" ON "DailyAttempt"("date", "userToken");

-- AddForeignKey
ALTER TABLE "DailyWord" ADD CONSTRAINT "DailyWord_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyAttempt" ADD CONSTRAINT "DailyAttempt_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
