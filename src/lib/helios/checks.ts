import type { CheckResult } from "@/lib/helios/types";
import type { CreateRunResponse } from "@/lib/helios/api";

export function createChecksFromRunResult(
  result: CreateRunResponse,
): CheckResult[] {
  return [
    {
      title: "Page loaded successfully",
      detail: `Playwright loaded the page and resolved to ${result.finalUrl}.`,
      status: "passed",
      severity: "info",
    },
    {
      title: "Desktop screenshot captured",
      detail:
        "A desktop viewport screenshot was captured from the real browser run.",
      status: "passed",
      severity: "info",
    },
    {
      title: "Mobile screenshot captured",
      detail:
        "A mobile viewport screenshot was captured from the real browser run.",
      status: "passed",
      severity: "info",
    },
    {
      title: "Console errors checked",
      detail:
        result.consoleErrors.length > 0
          ? `${result.consoleErrors.length} console error(s) captured.`
          : "No console errors were captured.",
      status: result.consoleErrors.length > 0 ? "warning" : "passed",
      severity: result.consoleErrors.length > 0 ? "low" : "info",
    },
    {
      title: "Failed network requests checked",
      detail:
        result.failedRequests.length > 0
          ? `${result.failedRequests.length} failed request(s) captured.`
          : "No failed network requests were captured.",
      status: result.failedRequests.length > 0 ? "warning" : "passed",
      severity: result.failedRequests.length > 0 ? "medium" : "info",
    },
  ];
}
