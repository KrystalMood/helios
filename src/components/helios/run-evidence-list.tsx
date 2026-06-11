type RunEvidenceListProps = {
  consoleErrors?: string[];
  failedRequests?: string[];
};

export function RunEvidenceList({
  consoleErrors,
  failedRequests,
}: RunEvidenceListProps) {
  const visibleConsoleErrors = consoleErrors?.slice(0, 5) ?? [];
  const visibleFailedRequests = failedRequests?.slice(0, 5) ?? [];

  const consoleErrorCount = consoleErrors?.length ?? 0;
  const failedRequestCount = failedRequests?.length ?? 0;

  if (visibleConsoleErrors.length === 0 && visibleFailedRequests.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 border-t border-border pt-4">
      <h3 className="text-sm font-medium text-foreground">Evidence</h3>

      {visibleConsoleErrors.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-medium text-muted">
            Console errors - showing {visibleConsoleErrors.length} of{" "}
            {consoleErrorCount}
          </p>
          <ul className="mt-2 space-y-2">
            {visibleConsoleErrors.map((error, index) => (
              <li
                key={`console-${index}`}
                className="break-all rounded-md border border-border bg-card p-3 text-xs text-muted"
              >
                {error}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {visibleFailedRequests.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-medium text-muted">
            Failed network requests - showing {visibleFailedRequests.length} of{" "}
            {failedRequestCount}
          </p>
          <ul className="mt-2 space-y-2">
            {visibleFailedRequests.map((request, index) => (
              <li
                key={`request-${index}`}
                className="break-all rounded-md border border-border bg-card p-3 text-xs text-muted"
              >
                {request}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
