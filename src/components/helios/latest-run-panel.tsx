import { StatusBadge } from "@/components/helios/status-badge";
import { OverviewCard } from "@/components/helios/overview-card";
import { overviewCards } from "@/lib/helios/overview-cards";

import type { LatestRun, OverviewCardData } from "@/lib/helios/types";

type LatestRunPanelProps = {
  latestRun: LatestRun | null;
  onReset: () => void;
};

export function LatestRunPanel({ latestRun, onReset }: LatestRunPanelProps) {
  const getCardDescription = (card: OverviewCardData) => {
    if (!latestRun) return card.emptyText;
    if (latestRun.status === "Completed") return card.completedText;
    return card.activeText;
  };

  function formatTimeStamp(timestamp: string) {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(new Date(timestamp));
  }

  return (
    <section className="mt-6 rounded-lg border border-border bg-panel p-5">
      <header className="text-base font-medium flex items-center justify-between">
        <h2>Latest run</h2>
        <div className="flex items-center gap-2">
          <StatusBadge status={latestRun?.status ?? "Idle"} />
          {latestRun ? (
            <button
              onClick={onReset}
              className="rounded-full border border-border px-2 py-1 text-xs text-muted transition hover:text-foreground"
            >
              Reset
            </button>
          ) : null}
        </div>
      </header>
      <div className="mt-4 text-sm text-muted">
        {latestRun ? (
          <div className="text-sm grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted">Run ID</p>
              <p className="text-foreground break-all">{latestRun.id}</p>
            </div>

            <div>
              <p className="text-sm text-muted">Queued at</p>
              <p className="text-foreground break-all">
                {formatTimeStamp(latestRun.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted">Starting URL</p>
              <p className="text-foreground break-all">
                {latestRun.startingUrl}
              </p>
            </div>

            {latestRun.finishedAt ? (
              <div>
                <p className="text-sm text-muted">Finished at</p>
                <p className="text-foreground break-all">
                  {formatTimeStamp(latestRun.finishedAt)}
                </p>
              </div>
            ) : null}

            {latestRun.durationMs !== undefined ? (
              <div>
                <p className="text-sm text-muted">Duration</p>
                <p className="text-foreground break-all">
                  {(latestRun.durationMs / 1000).toFixed(2)} s
                </p>
              </div>
            ) : null}

            <div className="md:col-span-3">
              <p className="text-sm text-muted">Summary</p>
              <p className="text-foreground break-all">{latestRun.summary}</p>
            </div>
          </div>
        ) : (
          "No runs yet"
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <OverviewCard
            key={card.title}
            title={card.title}
            description={getCardDescription(card)}
          />
        ))}
      </div>

      {latestRun ? (
        <div className="mt-5 border-t border-border pt-4">
          <h3 className="text-sm font-medium text-foreground">Browser trail</h3>
          <div className="mt-3 max-h-64 overflow-y-auto rounded-md border border-border bg-card p-3">
            <ol className="space-y-3 text-sm">
              {latestRun.trail.map((step, index) => (
                <li
                  key={`${step.label}-${index}`}
                  className="border-b border-border pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-foreground">{step.label}</p>
                    <time
                      className="text-xs text-muted"
                      dateTime={step.timestamp}
                    >
                      {formatTimeStamp(step.timestamp)}
                    </time>
                  </div>
                  <p className="text-muted">{step.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}
    </section>
  );
}
