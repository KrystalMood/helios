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

  return Response.json({
    id: runId,
    startingUrl: submittedUrl,
    finalUrl: submittedUrl,
    status: "completed",
    title: "API route ready",
    createdAt: now.toISOString(),
    summary:
      "Helios accepted the submitted URL. Browser automation is not connected yet.",
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
  });
}
