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
  const now = new Date();

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

    await page.screenshot({
      path: desktopScreenshotPath,
      fullPage: true,
    });

    await mobilePage.screenshot({
      path: mobileScreenshotPath,
      fullPage: true,
    });

    return {
      id: runId,
      startingUrl: submittedUrl,
      finalUrl,
      status: "completed",
      title,
      description: description ?? undefined,
      createdAt: now.toISOString(),
      summary:
        "Helios opened the submitted URL with Playwright and captured basic page metadata.",
      trail: [
        {
          label: "Request received",
          detail: "Helios accepted and validated the submitted URL",
          timestamp: now.toISOString(),
        },
        {
          label: "Browser launched",
          detail: "Playwright launched a Chromium browser instance.",
          timestamp: now.toISOString(),
        },
        {
          label: "Navigated to URL",
          detail: `Desktop and mobile pages navigated to ${submittedUrl}.`,
          timestamp: now.toISOString(),
        },
        {
          label: "Page settle check completed",
          detail:
            desktopSettled && mobileSettled
              ? "Desktop and mobile pages reached network idle."
              : "At least one viewport did not reach network idle before the settle timeout; Helios continued with available evidence.",
          timestamp: now.toISOString(),
        },
        {
          label: "Page metadata captured",
          detail: `Captured title and final URL: ${finalUrl}.`,
          timestamp: now.toISOString(),
        },
        {
          label: "Screenshots captured",
          detail:
            "Desktop and mobile screenshots were saved as local artifacts.",
          timestamp: now.toISOString(),
        },
        {
          label: "Console and network evidence collected",
          detail: `${consoleErrors.length} console error(s), ${failedRequests.length} failed request(s) captured.`,
          timestamp: now.toISOString(),
        },
        {
          label: "Run completed",
          detail: "Browser QA run completed successfully.",
          timestamp: now.toISOString(),
        },
      ],
      artifacts: {
        desktopScreenshot: `/artifacts/runs/${runId}/desktop.png`,
        mobileScreenshot: `/artifacts/runs/${runId}/mobile.png`,
      },
      consoleErrors,
      failedRequests,
    };
  } finally {
    await browser?.close();
  }
}
