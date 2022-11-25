/*
  Warnings:

  - A unique constraint covering the columns `[parcipantId,gameId]` on the table `Guess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Guess_parcipantId_gameId_key" ON "Guess"("parcipantId", "gameId");
