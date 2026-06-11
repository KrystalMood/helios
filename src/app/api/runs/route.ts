import { runSinglePageQA } from "@/lib/helios/runner";

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

  try {
    const result = await runSinglePageQA({
      submittedUrl,
      runId,
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: "Browser run failed",
        message:
          error instanceof Error ? error.message : "Unknown Playwright error.",
      },
      { status: 500 },
    );
  }
}
