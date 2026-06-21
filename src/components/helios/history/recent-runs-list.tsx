import { useState } from "react";
import Link from "next/link";
import type { LatestRun } from "@/lib/helios/shared/types";
import { HELIOS_ROUTES } from "@/lib/helios/shared/routes";
import { Trash2 } from "lucide-react";

import { formatDurationMs, formatTimestamp } from "@/lib/helios/shared/format";
import { StatusBadge } from "@/components/helios/run/status-badge";

type RecentRunsListProps = {
  runs: LatestRun[];
  onClearRuns: () => Promise<void>;
  onDeleteRun: (id: string) => Promise<void>;
};

function getDomain(urlStr: string) {
  try {
    return new URL(urlStr).hostname;
  } catch {
    return urlStr;
  }
}

export function RecentRunsList({
  runs,
  onClearRuns,
  onDeleteRun,
}: RecentRunsListProps) {
  const [confirming, setConfirming] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingInProgress, setDeletingInProgress] = useState<string | null>(
    null,
  );

  if (runs.length <= 0) return null;

  return (
    <section className="mt-6 rounded-lg border border-border bg-panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-medium text-foreground">Recent runs</h2>
        {confirming ? (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted">Clear all runs?</span>
            <button
              type="button"
              onClick={async () => {
                try {
                  await onClearRuns();
                  setConfirming(false);
                } catch {}
              }}
              className="rounded-full border border-border px-2 py-1 text-xs text-muted transition hover:text-foreground"
            >
              Yes, clear
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-full border border-border px-2 py-1 text-xs text-muted transition hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-full border border-border px-2 py-1 text-xs text-muted transition hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      <ul className="flex flex-col border-t border-border mt-4">
        {runs.map((run) => (
          <li
            key={run.id}
            className="group relative border-b border-border transition-colors hover:bg-muted/30"
          >
            <Link
              href={HELIOS_ROUTES.runDetail(run.id)}
              className={`flex min-w-0 flex-col gap-3 p-3 transition-[padding] sm:flex-row sm:items-center ${
                deletingId === run.id
                  ? "pr-32 sm:pr-32"
                  : "pr-12 sm:pr-3 sm:group-hover:pr-12 sm:group-focus-within:pr-12"
              }`}
            >
              <div className="shrink-0">
                <StatusBadge status={run.status} />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="truncate text-sm font-medium text-foreground">
                  {run.title || getDomain(run.startingUrl)}
                </p>
                <p className="truncate text-xs text-muted">
                  {run.title ? getDomain(run.startingUrl) : run.startingUrl}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 text-right sm:flex-col sm:items-end sm:gap-0.5">
                <span className="text-xs text-foreground">
                  {formatTimestamp(run.createdAt)}
                </span>
                {run.durationMs !== undefined && (
                  <span className="text-xs text-muted">
                    {formatDurationMs(run.durationMs)}
                  </span>
                )}
              </div>
            </Link>

            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {deletingId === run.id ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={async () => {
                      setDeletingInProgress(run.id);
                      try {
                        await onDeleteRun(run.id);
                        setDeletingId(null);
                      } finally {
                        setDeletingInProgress(null);
                      }
                    }}
                    disabled={deletingInProgress === run.id}
                    className="rounded-md bg-danger/10 px-2 py-1 text-xs font-medium text-danger transition hover:bg-danger hover:text-background disabled:opacity-50"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingId(null);
                    }}
                    className="rounded-md px-2 py-1 text-xs text-muted transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                    disabled={deletingInProgress === run.id}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setDeletingId(run.id);
                  }}
                  className="rounded-md p-1.5 text-muted opacity-100 transition hover:bg-danger/10 hover:text-danger sm:opacity-0 focus:opacity-100 sm:group-hover:opacity-100"
                  aria-label="Delete run"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
