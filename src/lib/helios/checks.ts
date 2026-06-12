import type { CheckResult } from "@/lib/helios/types";
import type { CreateRunResponse } from "@/lib/helios/api";
import { formatDurationMs } from "@/lib/helios/format";

export function createChecksFromRunResult(
  result: CreateRunResponse,
): CheckResult[] {
  const hasDescription =
    result.description !== undefined && result.description.trim().length > 0;
  const hasBrokenImages = result.brokenImages.length > 0;
  return [
    {
      title: "Page loaded successfully",
      detail: `Playwright loaded the page and resolved to ${result.finalUrl}.`,
      status: "passed",
      severity: "info",
    },
    {
      title: "Page load metrics captured",
      detail: result.loadMetrics
        ? `DOM loaded in ${formatDurationMs(result.loadMetrics.domContentLoadedMs)}.`
        : "Page load metrics were not available.",
      status: result.loadMetrics ? "passed" : "warning",
      severity: result.loadMetrics ? "info" : "low",
    },
    {
      title: "Page title checked",
      detail:
        result.title.trim().length > 0
          ? `Page title captured: ${result.title}.`
          : "No page title was captured.",
      status: result.title.trim().length > 0 ? "passed" : "warning",
      severity: result.title.trim().length > 0 ? "info" : "low",
    },
    {
      title: "Meta description checked",
      detail: hasDescription
        ? "Meta description was captured."
        : "No meta description was captured.",
      status: hasDescription ? "passed" : "warning",
      severity: hasDescription ? "info" : "low",
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
      title: "Broken images checked",
      detail: hasBrokenImages
        ? `${result.brokenImages.length} broken image(s) found.`
        : "No broken images were found.",
      status: hasBrokenImages ? "warning" : "passed",
      severity: hasBrokenImages ? "medium" : "info",
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
