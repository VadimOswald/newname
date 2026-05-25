-- CreateEnum
CREATE TYPE "QuoteType" AS ENUM ('compliment', 'insult');

-- CreateEnum
CREATE TYPE "VoteValue" AS ENUM ('like', 'dislike');

-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "QuoteType" NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "scorePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "telegramUserId" TEXT NOT NULL,
    "value" "VoteValue" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Quote_hidden_type_idx" ON "Quote"("hidden", "type");

-- CreateIndex
CREATE INDEX "Quote_hidden_totalVotes_idx" ON "Quote"("hidden", "totalVotes");

-- CreateIndex
CREATE INDEX "Vote_telegramUserId_updatedAt_idx" ON "Vote"("telegramUserId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_quoteId_telegramUserId_key" ON "Vote"("quoteId", "telegramUserId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
