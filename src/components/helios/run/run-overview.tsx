import type { LatestRun } from "@/lib/helios/shared/types";

import { RunAdminDetails } from "@/components/helios/run/run-admin-details";
import { RunMetricsGrid } from "@/components/helios/run/run-metrics-grid";
import { RunSummaryCard } from "@/components/helios/run/run-summary-card";
import { ScreenshotGallery } from "@/components/helios/run/screenshot-gallery";

type RunOverviewProps = {
  run: LatestRun;
};

export function RunOverview({ run }: RunOverviewProps) {
  return (
    <div className="space-y-6">
      <RunSummaryCard summary={run.summary} />
      <RunMetricsGrid run={run} />
      <ScreenshotGallery artifacts={run.artifacts} />
      <RunAdminDetails run={run} />
    </div>
  );
}
