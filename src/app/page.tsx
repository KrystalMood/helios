"use client";

import { useRunDashboard } from "@/lib/helios/client/use-run-dashboard";

import { AppHeader } from "@/components/helios/app-header";
import { DashboardHero } from "@/components/helios/dashboard-hero";
import { RunForm } from "@/components/helios/run-form";
import { LatestRunPanel } from "@/components/helios/latest-run-panel";
import { RecentRunsList } from "@/components/helios/recent-runs-list";

export default function Home() {
  const {
    latestRun,
    runError,
    recentRuns,
    isRunActive,
    handleSubmit,
    handleReset,
    handleClearRecentRuns,
    setLatestRun,
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
        <RecentRunsList
          runs={recentRuns}
          onSelectRun={setLatestRun}
          onClearRuns={handleClearRecentRuns}
        />
      </div>
    </main>
  );
}
