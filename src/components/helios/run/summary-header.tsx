import Link from "next/link";
import type { LatestRun } from "@/lib/helios/shared/types";

import { StatusBadge } from "@/components/helios/run/status-badge";
import { ExportRunButton } from "@/components/helios/run/export-run-button";
import { formatDurationMs, formatTimestamp } from "@/lib/helios/shared/format";
import { HELIOS_ROUTES } from "@/lib/helios/shared/route";

type RunSummaryHeaderProps = {
  run: LatestRun;
};

export function RunSummaryHeader({ run }: RunSummaryHeaderProps) {
  const isFinished = run.status === "Completed" || run.status === "Failed";
  const displayTitle = run.title ?? run.startingUrl;

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={HELIOS_ROUTES.dashboard}
          className="text-sm text-muted hover:text-foreground transition"
        >
          &larr; Back to dashboard
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={run.status} />
          {isFinished && <ExportRunButton run={run} />}
        </div>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground break-all">
          {displayTitle}
        </h1>
        {run.title && (
          <p className="mt-1 text-sm text-muted break-all">{run.startingUrl}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted border-b border-border pb-6">
        <div>
          Started:{" "}
          <span className="text-foreground">
            {formatTimestamp(run.createdAt)}
          </span>
        </div>
        {run.durationMs !== undefined && (
          <div>
            Duration:{" "}
            <span className="text-foreground">
              {formatDurationMs(run.durationMs)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
