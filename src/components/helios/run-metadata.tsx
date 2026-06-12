import type { LatestRun } from "@/lib/helios/types";
import { formatTimestamp } from "@/lib/helios/format";

import { ArtifactViewer } from "@/components/helios/artifact-viewer";

type RunMetadataProps = {
  run: LatestRun;
};

export function RunMetadata({ run }: RunMetadataProps) {
  return (
    <div className="text-sm grid gap-4 md:grid-cols-3">
      <div>
        <p className="text-sm text-muted">Run ID</p>
        <p className="text-foreground break-all">{run.id}</p>
      </div>

      <div>
        <p className="text-sm text-muted">Queued at</p>
        <p className="text-foreground break-all">
          {formatTimestamp(run.createdAt)}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted">Starting URL</p>
        <p className="text-foreground break-all">{run.startingUrl}</p>
      </div>

      {run.finalUrl ? (
        <div>
          <p className="text-sm text-muted">Final URL</p>
          <p className="text-foreground break-all">{run.finalUrl}</p>
        </div>
      ) : null}

      {run.title ? (
        <div>
          <p className="text-sm text-muted">Page title</p>
          <p className="text-foreground break-all">{run.title}</p>
        </div>
      ) : null}

      {run.description ? (
        <div className="md:col-span-3">
          <p className="text-sm text-muted">Meta description</p>
          <p className="text-foreground break-all">{run.description}</p>
        </div>
      ) : null}

      {run.finishedAt ? (
        <div>
          <p className="text-sm text-muted">Finished at</p>
          <p className="text-foreground break-all">
            {formatTimestamp(run.finishedAt)}
          </p>
        </div>
      ) : null}

      {run.durationMs !== undefined ? (
        <div>
          <p className="text-sm text-muted">Duration</p>
          <p className="text-foreground break-all">
            {(run.durationMs / 1000).toFixed(2)} s
          </p>
        </div>
      ) : null}

      <div className="md:col-span-3">
        <p className="text-sm text-muted">Summary</p>
        <p className="text-foreground break-all">{run.summary}</p>
      </div>

      {run.consoleErrors && run.consoleErrors.length > 0 && (
        <div>
          <p className="text-sm text-muted">Console errors</p>
          <p className="text-foreground">{run.consoleErrors.length}</p>
        </div>
      )}

      {run.failedRequests && run.failedRequests.length > 0 && (
        <div>
          <p className="text-sm text-muted">Failed requests</p>
          <p className="text-foreground">{run.failedRequests.length}</p>
        </div>
      )}

      {run.artifacts ? (
        <div className="md:col-span-3">
          <p className="mb-2 text-sm text-muted">Artifacts</p>
          <ArtifactViewer artifacts={run.artifacts} />
        </div>
      ) : null}
    </div>
  );
}
