import type { EvidenceType, RunEvidence } from "@/lib/helios/shared/types";

type TransformRawEvidenceInput = {
  runId: string;
  capturedAt: string;
  pageUrl: string;
  brokenImages?: string[];
  consoleErrors?: string[];
  failedRequests?: string[];
};

function tryExtractUrl(text: string): string | undefined {
  const urlMatch = text.match(/https?:\/\/\S+/);
  return urlMatch?.[0];
}

function toRunEvidence(
  runId: string,
  type: EvidenceType,
  items: string[],
  capturedAt: string,
  pageUrl: string,
): RunEvidence[] {
  return items.map((content, index) => ({
    id: `${runId}:${type}:${index}`,
    type,
    content,
    sourceUrl: tryExtractUrl(content) ?? pageUrl,
    capturedAt,
  }));
}

export function transformRawEvidence({
  runId,
  capturedAt,
  pageUrl,
  brokenImages = [],
  consoleErrors = [],
  failedRequests = [],
}: TransformRawEvidenceInput): RunEvidence[] {
  return [
    ...toRunEvidence(runId, "image", brokenImages, capturedAt, pageUrl),
    ...toRunEvidence(runId, "console", consoleErrors, capturedAt, pageUrl),
    ...toRunEvidence(runId, "network", failedRequests, capturedAt, pageUrl),
  ];
}
