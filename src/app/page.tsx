"use client";
import { useState } from "react";

import type { LatestRun } from "@/lib/helios/types";

import { AppHeader } from "@/components/helios/app-header";
import { RunForm } from "@/components/helios/run-form";
import { LatestRunPanel } from "@/components/helios/latest-run-panel";
import { DashboardHero } from "@/components/helios/dashboard-hero";
import {
  FAKE_RUN_RUNNING_DELAY_MS,
  createQueuedFakeRun,
  markFakeRunRunning,
} from "@/lib/helios/fake-run";
import { createRun } from "@/lib/helios/api";
import { createChecksFromRunResult } from "@/lib/helios/checks";

export default function Home() {
  const [latestRun, setLatestRun] = useState<LatestRun | null>(null);

  const isRunActive =
    latestRun?.status === "Queued" || latestRun?.status === "Running";

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const url = formData.get("url")?.toString().trim() ?? "";

    const { run, startTime } = createQueuedFakeRun(url);
    const runId = run.id;

    setLatestRun(run);

    setTimeout(() => {
      setLatestRun((prev) => {
        if (!prev || prev.id !== runId) return prev;
        return markFakeRunRunning(prev);
      });
    }, FAKE_RUN_RUNNING_DELAY_MS);

    try {
      const result = await createRun(url);
      console.log(result);

      const finishedAt = new Date();
      const durationMs = finishedAt.getTime() - startTime;

      const checks = createChecksFromRunResult(result);

      setLatestRun((prev) => {
        if (!prev || prev.id !== runId) return prev;
        return {
          ...prev,
          finalUrl: result.finalUrl,
          title: result.title,
          summary: result.summary,
          checks,
          artifacts: result.artifacts,
          consoleErrors: result.consoleErrors,
          failedRequests: result.failedRequests,
          status: "Completed",
          finishedAt: finishedAt.toISOString(),
          durationMs,
          trail: [
            ...result.trail,
            {
              label: "Dashboard updated",
              detail: "Helios displayed the completed browser QA result.",
              timestamp: finishedAt.toISOString(),
            },
          ],
        };
      });
    } catch (error) {
      console.error("Failed to call run API", error);
    }
  };

  const handleReset = () => {
    setLatestRun(null);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppHeader />

      <div className="py-10 px-6 mx-auto max-w-5xl">
        <DashboardHero />
        <RunForm onSubmit={handleSubmit} isDisabled={isRunActive} />
        <LatestRunPanel latestRun={latestRun} onReset={handleReset} />
      </div>
    </main>
  );
}
