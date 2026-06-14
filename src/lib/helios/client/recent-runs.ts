import type { LatestRun } from "@/lib/helios/shared/types";
import {
  MAX_RECENT_RUNS,
  RECENT_RUNS_STORAGE_KEY,
} from "@/lib/helios/shared/constants";

function canUseLocalStorage() {
  return typeof window !== "undefined" && window.localStorage !== undefined;
}

export function addRecentRun(
  currentRuns: LatestRun[],
  run: LatestRun,
): LatestRun[] {
  return [
    run,
    ...currentRuns.filter((currentRun) => currentRun.id !== run.id),
  ].slice(0, MAX_RECENT_RUNS);
}

export function loadRecentRuns(): LatestRun[] {
  if (!canUseLocalStorage()) return [];

  const storedRuns = window.localStorage.getItem(RECENT_RUNS_STORAGE_KEY);

  if (!storedRuns) return [];

  try {
    return JSON.parse(storedRuns) as LatestRun[];
  } catch {
    return [];
  }
}

export function saveRecentRuns(runs: LatestRun[]) {
  if (!canUseLocalStorage()) return;

  window.localStorage.setItem(RECENT_RUNS_STORAGE_KEY, JSON.stringify(runs));
}
