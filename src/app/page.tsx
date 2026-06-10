"use client";
import { useState } from "react";
import type { LatestRun } from "@/lib/helios/types";

import { AppHeader } from "@/components/helios/app-header";
import { RunForm } from "@/components/helios/run-form";
import { LatestRunPanel } from "@/components/helios/latest-run-panel";
import { DashboardHero } from "@/components/helios/dashboard-hero";

export default function Home() {
  const [latestRun, setLatestRun] = useState<LatestRun | null>(null);

  const isRunActive =
    latestRun?.status === "Queued" || latestRun?.status === "Running";

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const url = formData.get("url")?.toString().trim() ?? "";

    const now = new Date();
    const runId = `run_${now.getTime()}`;
    const startTime = now.getTime();

    setLatestRun({
      id: runId,
      startingUrl: url,
      status: "Queued",
      trail: [
        {
          label: "QA run queued",
          detail: "Waiting to launch a browser session.",
          timestamp: now.toISOString(),
        },
      ],
      summary: "QA run queued and waiting to start.",
      createdAt: now.toISOString(),
    });

    setTimeout(() => {
      const runningAt = new Date();
      setLatestRun((prev) => {
        if (!prev || prev.id !== runId) return prev;
        return {
          ...prev,
          status: "Running",
          trail: [
            ...prev.trail,
            {
              label: "QA agent is running",
              detail: "Browser session is being launched.",
              timestamp: runningAt.toISOString(),
            },
          ],
          summary: "Helios is running a fake browser QA check.",
        };
      });
    }, 1000);

    setTimeout(() => {
      const completedAt = new Date();
      const durationMs = completedAt.getTime() - startTime;
      setLatestRun((prev) => {
        if (!prev || prev.id !== runId) return prev;
        return {
          ...prev,
          status: "Completed",
          trail: [
            ...prev.trail,
            {
              label: "Navigated to URL",
              detail: "Helios navigated the browser to the submitted URL.",
              timestamp: completedAt.toISOString(),
            },
            {
              label: "Page loaded",
              detail: "The page reached a loaded state.",
              timestamp: completedAt.toISOString(),
            },
            {
              label: "Desktop screenshot captured",
              detail: "Desktop viewport screenshot was captured.",
              timestamp: completedAt.toISOString(),
            },
            {
              label: "Mobile screenshot captured",
              detail: "Mobile viewport screenshot was captured.",
              timestamp: completedAt.toISOString(),
            },
            {
              label: "Console logs collected",
              detail: "Console logs were collected for review.",
              timestamp: completedAt.toISOString(),
            },
            {
              label: "Network failures checked",
              detail: "Failed network requests were checked.",
              timestamp: completedAt.toISOString(),
            },
            {
              label: "QA run completed",
              detail: "Browser session has been finished.",
              timestamp: completedAt.toISOString(),
            },
          ],
          summary:
            "Completed fake QA run with screenshots, logs, and network checks simulated.",
          finishedAt: completedAt.toISOString(),
          durationMs: durationMs,
        };
      });
    }, 3000);
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
