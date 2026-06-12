import type { LoadMetrics, TrailStep } from "@/lib/helios/types";

export type CreateRunResponse = {
  id: string;
  startingUrl: string;
  finalUrl: string;
  status: "completed";
  title: string;
  description?: string;
  createdAt: string;
  finishedAt: string;
  durationMs: number;
  summary: string;
  trail: TrailStep[];
  artifacts: {
    desktopScreenshot: string;
    mobileScreenshot: string;
  };
  brokenImages: string[];
  consoleErrors: string[];
  failedRequests: string[];
  loadMetrics?: LoadMetrics;
};

export type ApiErrorResponse = {
  error: string;
  message: string;
};

export async function createRun(url: string): Promise<CreateRunResponse> {
  const response = await fetch("/api/runs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  const result = (await response.json()) as
    | CreateRunResponse
    | ApiErrorResponse;

  if (!response.ok) {
    throw result;
  }

  return result as CreateRunResponse;
}
