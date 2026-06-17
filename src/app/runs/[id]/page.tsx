import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/helios/layout/app-header";
import { StatusBadge } from "@/components/helios/run/status-badge";
import { RunMetadata } from "@/components/helios/run/run-metadata";
import { RunEvidenceList } from "@/components/helios/evidence/run-evidence-list";
import { RunChecksList } from "@/components/helios/run/run-checks-list";
import { BrowserTrail } from "@/components/helios/run/browser-trail";

import { prisma } from "@/lib/prisma";
import { runRecordToLatestRun } from "@/lib/helios/server/run-record";

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const record = await prisma.run.findUnique({
    where: { id },
  });

  if (!record) {
    notFound();
  }

  const run = runRecordToLatestRun(record);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="py-10 px-6 mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm text-muted hover:text-foreground transition"
          >
            Back to dashboard
          </Link>
          <StatusBadge status={run.status} />
        </div>

        <section className="rounded-lg border border-border bg-panel p-5 space-y-4">
          <RunMetadata run={run} />
          <RunEvidenceList
            brokenImages={run.brokenImages}
            consoleErrors={run.consoleErrors}
            failedRequests={run.failedRequests}
          />

          <RunChecksList checks={run.checks} />
          <BrowserTrail trail={run.trail} />
        </section>
      </div>
    </main>
  );
}
