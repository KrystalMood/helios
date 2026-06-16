-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "startingUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "finalUrl" TEXT,
    "title" TEXT,
    "description" TEXT,
    "trail" JSONB NOT NULL,
    "checks" JSONB NOT NULL,
    "artifacts" JSONB,
    "brokenImages" JSONB,
    "consoleErrors" JSONB,
    "failedRequests" JSONB,
    "loadMetrics" JSONB,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);
