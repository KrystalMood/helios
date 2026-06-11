import { chromium, type Browser } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

type CreateRunRequest = {
  url?: string;
};

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: CreateRunRequest;

  try {
    body = (await request.json()) as CreateRunRequest;
  } catch {
    return Response.json(
      {
        error: "Invalid JSON",
        message: "Please submit a JSON body with a url field.",
      },
      { status: 400 },
    );
  }

  const submittedUrl = body.url?.trim();

  if (!submittedUrl || !isValidHttpUrl(submittedUrl)) {
    return Response.json(
      {
        error: "Invalid URL",
        message: "Please submit a valid HTTP or HTTPS URL.",
      },
      { status: 400 },
    );
  }

  const now = new Date();
  const runId = `run_${now.getTime()}`;

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
    });

    await mobilePage.goto(submittedUrl, {
      waitUntil: "domcontentloaded",
    });

    await page.waitForLoadState("networkidle");
    await mobilePage.waitForLoadState("networkidle");

    const desktopScreenshotPath = path.join(artifactDir, "desktop.png");
    const mobileScreenshotPath = path.join(artifactDir, "mobile.png");

    const title = await page.title();
    const finalUrl = page.url();

    await page.screenshot({
      path: desktopScreenshotPath,
      fullPage: true,
    });

    await mobilePage.screenshot({
      path: mobileScreenshotPath,
      fullPage: true,
    });

    return Response.json({
      id: runId,
      startingUrl: submittedUrl,
      finalUrl,
      status: "completed",
      title,
      createdAt: now.toISOString(),
      summary:
        "Helios opened the submitted URL with Playwright and captured basic page metadata.",
      trail: [
        {
          label: "Request received",
          detail: "Helios accepted the submitted URL.",
          timestamp: now.toISOString(),
        },
        {
          label: "API route completed",
          detail: "Placeholder QA response returned successfully.",
          timestamp: now.toISOString(),
        },
      ],
      artifacts: {
        desktopScreenshot: `/artifacts/runs/${runId}/desktop.png`,
        mobileScreenshot: `/artifacts/runs/${runId}/mobile.png`,
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: "Browser run failed",
        message:
          error instanceof Error ? error.message : "Unknown Playwright error.",
      },
      { status: 500 },
    );
  } finally {
    await browser?.close();
  }
}
