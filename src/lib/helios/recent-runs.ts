import type { LatestRun } from "@/lib/helios/types";

const MAX_RECENT_RUNS = 5;

export function addRecentRun(
  currentRuns: LatestRun[],
  run: LatestRun,
): LatestRun[] {
  return [
    run,
    ...currentRuns.filter((currentRun) => currentRun.id !== run.id),
  ].slice(0, MAX_RECENT_RUNS);
}
