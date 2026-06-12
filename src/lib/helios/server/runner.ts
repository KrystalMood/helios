import { chromium, type Browser, type Page } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const PAGE_GOTO_TIMEOUT_MS = 30_000;
const PAGE_SETTLE_TIMEOUT_MS = 5_000;

type RunSinglePageQAProps = {
  submittedUrl: string;
  runId: string;
};

async function waitForPageToSettle(page: Page) {
  try {
    await page.waitForLoadState("networkidle", {
      timeout: PAGE_SETTLE_TIMEOUT_MS,
    });
    return true;
  } catch {
    return false;
  }
}

export async function runSinglePageQA({
  submittedUrl,
  runId,
}: RunSinglePageQAProps) {
  const startedAt = new Date();

  let browser: Browser | undefined;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({
      viewport: {
        width: 1440,
        height: 900,
      },
    });

    const mobilePage = await browser.newPage({
      viewport: {
        width: 390,
        height: 844,
      },
      isMobile: true,
    });

    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(`[Desktop] ${msg.text()}`);
      }
    });

    page.on("requestfailed", (request) => {
      failedRequests.push(
        `[Desktop] ${request.url()} - ${request.failure()?.errorText ?? "Unknown failure"}`,
      );
    });

    mobilePage.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(`[Mobile] ${msg.text()}`);
      }
    });

    mobilePage.on("requestfailed", (request) => {
      failedRequests.push(
        `[Mobile] ${request.url()} - ${request.failure()?.errorText ?? "Unknown failure"}`,
      );
    });

    const artifactDir = path.join(
      process.cwd(),
      "public",
      "artifacts",
      "runs",
      runId,
    );

    await mkdir(artifactDir, { recursive: true });

    await page.goto(submittedUrl, {
      waitUntil: "domcontentloaded",
      timeout: PAGE_GOTO_TIMEOUT_MS,
    });

    await mobilePage.goto(submittedUrl, {
      waitUntil: "domcontentloaded",
      timeout: PAGE_GOTO_TIMEOUT_MS,
    });

    const desktopSettled = await waitForPageToSettle(page);
    const mobileSettled = await waitForPageToSettle(mobilePage);

    const desktopScreenshotPath = path.join(artifactDir, "desktop.png");
    const mobileScreenshotPath = path.join(artifactDir, "mobile.png");

    const title = await page.title();
    const finalUrl = page.url();

    const description = await page.evaluate(() => {
      const selectors = [
        'meta[name="description"]',
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
      ];

      for (const selector of selectors) {
        const content = document
          .querySelector(selector)
          ?.getAttribute("content")
          ?.trim();

        if (content) return content;
      }
      return undefined;
    });

    const loadMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;

      if (!navigation) return undefined;

      return {
        domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
        loadEventMs: Math.round(navigation.loadEventEnd),
      };
    });

    const brokenImages = await page.evaluate(() => {
      return Array.from(document.images)
        .filter((image) => !image.complete || image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src)
        .filter(Boolean);
    });

    await page.screenshot({
      path: desktopScreenshotPath,
      fullPage: true,
    });

    await mobilePage.screenshot({
      path: mobileScreenshotPath,
      fullPage: true,
    });

    const finishedAt = new Date();
    const durationMs = finishedAt.getTime() - startedAt.getTime();

    return {
      id: runId,
      startingUrl: submittedUrl,
      finalUrl,
      status: "Completed",
      title,
      description: description ?? undefined,
      createdAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      durationMs,
      loadMetrics,
      summary:
        "Helios opened the submitted URL with Playwright and captured basic page metadata.",
      trail: [
        {
          label: "Request received",
          detail: "Helios accepted and validated the submitted URL",
          timestamp: startedAt.toISOString(),
        },
        {
          label: "Browser launched",
          detail: "Playwright launched a Chromium browser instance.",
          timestamp: startedAt.toISOString(),
        },
        {
          label: "Navigated to URL",
          detail: `Desktop and mobile pages navigated to ${submittedUrl}.`,
          timestamp: startedAt.toISOString(),
        },
        {
          label: "Page settle check completed",
          detail:
            desktopSettled && mobileSettled
              ? "Desktop and mobile pages reached network idle."
              : "At least one viewport did not reach network idle before the settle timeout; Helios continued with available evidence.",
          timestamp: startedAt.toISOString(),
        },
        {
          label: "Page metadata captured",
          detail: `Captured title and final URL: ${finalUrl}.`,
          timestamp: startedAt.toISOString(),
        },
        {
          label: "Screenshots captured",
          detail:
            "Desktop and mobile screenshots were saved as local artifacts.",
          timestamp: startedAt.toISOString(),
        },
        {
          label: "Console and network evidence collected",
          detail: `${consoleErrors.length} console error(s), ${failedRequests.length} failed request(s) captured.`,
          timestamp: startedAt.toISOString(),
        },
        {
          label: "Run completed",
          detail: "Browser QA run completed successfully.",
          timestamp: finishedAt.toISOString(),
        },
      ],
      artifacts: {
        desktopScreenshot: `/artifacts/runs/${runId}/desktop.png`,
        mobileScreenshot: `/artifacts/runs/${runId}/mobile.png`,
      },
      brokenImages,
      consoleErrors,
      failedRequests,
    };
  } finally {
    await browser?.close();
  }
}
