"use client";
import { useState } from "react";

import type { LatestRun } from "@/lib/helios/types";

import { AppHeader } from "@/components/helios/app-header";
import { RunForm } from "@/components/helios/run-form";
import { LatestRunPanel } from "@/components/helios/latest-run-panel";
import { DashboardHero } from "@/components/helios/dashboard-hero";
import {
  RUNNING_STATE_DELAY_MS,
  createQueuedRunState,
  markRunRunning,
} from "@/lib/helios/run-state";
import { createRun } from "@/lib/helios/api";
import { createChecksFromRunResult } from "@/lib/helios/checks";

function getRunErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Helios could not complete the browser QA run.";
}

export default function Home() {
  const [latestRun, setLatestRun] = useState<LatestRun | null>(null);
  const [runError, setRunError] = useState<string | undefined>();
  const isRunActive =
    latestRun?.status === "Queued" || latestRun?.status === "Running";

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    setRunError(undefined);

    const formData = new FormData(e.currentTarget);
    const url = formData.get("url")?.toString().trim() ?? "";

    const { run, startTime } = createQueuedRunState(url);
    const runId = run.id;

    setLatestRun(run);

    setTimeout(() => {
      setLatestRun((prev) => {
        if (!prev || prev.id !== runId) return prev;
        return markRunRunning(prev);
      });
    }, RUNNING_STATE_DELAY_MS);

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
          description: result.description,
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
      const message = getRunErrorMessage(error);
      setRunError(message);
      setLatestRun((prev) => {
        if (!prev || prev.id !== runId) return prev;

        return {
          ...prev,
          status: "Failed",
          summary: "Helios could not complete the browser QA run.",
          finishedAt: new Date().toISOString(),
          checks: [
            {
              title: "Browser run failed",
              detail: message,
              status: "failed",
              severity: "high",
            },
          ],
          trail: [
            ...prev.trail,
            {
              label: "Run failed",
              detail: message,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      });
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
        <RunForm
          onSubmit={handleSubmit}
          isDisabled={isRunActive}
          error={runError}
        />
        <LatestRunPanel latestRun={latestRun} onReset={handleReset} />
      </div>
    </main>
  );
}
