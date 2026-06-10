export type RunStatus = "Idle" | "Queued" | "Running" | "Completed";

export type TrailStep = {
  label: string;
  detail: string;
  timestamp: string;
};

export type LatestRun = {
  id: string;
  startingUrl: string;
  status: RunStatus;
  trail: TrailStep[];
  summary: string;
  createdAt: string;
  finishedAt?: string;
  durationMs?: number;
};

export type OverviewCardData = {
  title: string;
  emptyText: string;
  activeText: string;
  completedText: string;
};
