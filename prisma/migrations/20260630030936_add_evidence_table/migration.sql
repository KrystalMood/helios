-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('image', 'console', 'network');

-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('open', 'resolved', 'ignored');

-- AlterTable
ALTER TABLE "Run" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "type" "EvidenceType" NOT NULL,
    "content" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "resourceUrl" TEXT,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_runId_fkey" FOREIGN KEY ("runId") REFERENCES "Run"("id") ON DELETE CASCADE ON UPDATE CASCADE;
