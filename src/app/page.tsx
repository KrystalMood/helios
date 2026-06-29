"use client";

import { useRunDashboard } from "@/lib/helios/client/use-run-dashboard";

import { AppHeader } from "@/components/helios/layout/app-header";
import { DashboardHero } from "@/components/helios/layout/dashboard-hero";
import { RunForm } from "@/components/helios/run/run-form";
import { LatestRunPanel } from "@/components/helios/run/latest-run-panel";
import { RecentRunsList } from "@/components/helios/history/recent-runs-list";
import { RecentRunsSkeleton } from "@/components/helios/history/recent-runs-skeleton";

export default function Home() {
  const {
    latestRun,
    runError,
    recentRuns,
    isHistoryLoading,
    historyError,
    isRunActive,
    handleSubmit,
    handleReset,
    handleClearRecentRuns,
    handleDeleteRun,
  } = useRunDashboard();

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
        {isHistoryLoading ? (
          <RecentRunsSkeleton />
        ) : historyError ? (
          <p className="mt-6 text-sm text-muted">{historyError}</p>
        ) : (
          <RecentRunsList
            runs={recentRuns}
            onClearRuns={handleClearRecentRuns}
            onDeleteRun={handleDeleteRun}
          />
        )}
      </div>
    </main>
  );
}
