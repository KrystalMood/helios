import type { LatestRun } from "@/lib/helios/shared/types";
import {
  MAX_RECENT_RUNS,
} from "@/lib/helios/shared/constants";

export function addRecentRun(
  currentRuns: LatestRun[],
  run: LatestRun,
): LatestRun[] {
  return [
    run,
    ...currentRuns.filter((currentRun) => currentRun.id !== run.id),
  ].slice(0, MAX_RECENT_RUNS);
}