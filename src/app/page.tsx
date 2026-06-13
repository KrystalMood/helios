"use client";
import { useState } from "react";
import type { LatestRun } from "@/lib/helios/shared/types";
import { getRunErrorMessage } from "@/lib/helios/shared/errors";
import {
  RUNNING_STATE_DELAY_MS,
  createQueuedRunState,
  markRunRunning,
} from "@/lib/helios/client/run-state";
import { createRun } from "@/lib/helios/client/api";
import {
  createCompletedRunState,
  createFailedRunState,
} from "@/lib/helios/client/run-transformer";
import { isValidHttpUrl } from "@/lib/helios/shared/validators";
import { addRecentRun } from "@/lib/helios/client/recent-runs";

import { AppHeader } from "@/components/helios/app-header";
import { RunForm } from "@/components/helios/run-form";
import { LatestRunPanel } from "@/components/helios/latest-run-panel";
import { RecentRunsList } from "@/components/helios/recent-runs-list";
import { DashboardHero } from "@/components/helios/dashboard-hero";

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

    if (!isValidHttpUrl(url)) {
      setRunError("Please enter a valid HTTP or HTTPS URL.");
      return;
    }

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

      const completedRun = createCompletedRunState(run, result);

      setLatestRun(completedRun);
      setRecentRuns((currentRuns) => addRecentRun(currentRuns, completedRun));
    } catch (error) {
      console.error("Failed to call run API", error);

      const message = getRunErrorMessage(error);
      setRunError(message);

      const failedRun = createFailedRunState(run, message);

      setLatestRun(failedRun);
      setRecentRuns((currentRuns) => addRecentRun(currentRuns, failedRun));
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
