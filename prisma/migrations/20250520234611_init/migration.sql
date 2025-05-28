-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "hasDefinition" BOOLEAN NOT NULL DEFAULT true,
    "timesShown" INTEGER NOT NULL DEFAULT 0,
    "timesAttempted" INTEGER NOT NULL,
    "timesSolved" INTEGER NOT NULL DEFAULT 0,
    "totalGuesses" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Word_text_key" ON "Word"("text");
