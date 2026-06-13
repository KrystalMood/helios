"use client";
import { useState } from "react";

import type { LatestRun } from "@/lib/helios/types";
import { getRunErrorMessage } from "@/lib/helios/errors";

import { AppHeader } from "@/components/helios/app-header";
import { RunForm } from "@/components/helios/run-form";
import { LatestRunPanel } from "@/components/helios/latest-run-panel";
import { RecentRunsList } from "@/components/helios/recent-runs-list";
import { DashboardHero } from "@/components/helios/dashboard-hero";
import {
  RUNNING_STATE_DELAY_MS,
  createQueuedRunState,
  markRunRunning,
} from "@/lib/helios/run-state";
import { createRun } from "@/lib/helios/api";
import {
  createCompletedRunState,
  createFailedRunState,
} from "@/lib/helios/run-transformer";

export default function Home() {
  const [latestRun, setLatestRun] = useState<LatestRun | null>(null);
  const [runError, setRunError] = useState<string | undefined>();
  const [recentRuns, setRecentRuns] = useState<LatestRun[]>([]);

  const isRunActive =
    latestRun?.status === "Queued" || latestRun?.status === "Running";

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();
    setRunError(undefined);

    const formData = new FormData(e.currentTarget);
    const url = formData.get("url")?.toString().trim() ?? "";

    const { run } = createQueuedRunState(url);
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

      setLatestRun((prev) => {
        if (!prev || prev.id !== runId) return prev;
        const completedRun = createCompletedRunState(prev, result);

        setRecentRuns((currentRuns) =>
          [
            completedRun,
            ...currentRuns.filter((run) => run.id !== completedRun.id),
          ].slice(0, 5),
        );

        return completedRun;
      });
    } catch (error) {
      console.error("Failed to call run API", error);

      const message = getRunErrorMessage(error);
      setRunError(message);
      setLatestRun((prev) => {
        if (!prev || prev.id !== runId) return prev;

        const failedRun = createFailedRunState(prev, message);
        setRecentRuns((currentRuns) =>
          [
            failedRun,
            ...currentRuns.filter((run) => run.id !== failedRun.id),
          ].slice(0, 5),
        );

        return failedRun;
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
        <RecentRunsList runs={recentRuns} onSelectRun={setLatestRun} />
      </div>
    </main>
  );
}
