import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

import { AppHeader } from "@/components/helios/layout/app-header";
import { RunEvidenceList } from "@/components/helios/evidence/run-evidence-list";
import { RunChecksList } from "@/components/helios/run/run-checks-list";
import { BrowserTrail } from "@/components/helios/run/browser-trail";
import { RunSummaryHeader } from "@/components/helios/run/summary-header";
import { Tabs, type TabItem } from "@/components/helios/ui/tabs";

import { runRecordToLatestRun } from "@/lib/helios/server/run-record";
import { RunOverview } from "@/components/helios/run/run-overview";

const getRunById = cache(async (id: string) => {
  return prisma.run.findUnique({ where: { id } });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const record = await getRunById(id);

  if (!record) {
    return {
      title: "Run not found - Helios",
    };
  }

  const label = record.title ?? record.startingUrl;
  return {
    title: `${label} - Helios`,
  };
}

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const record = await getRunById(id);

  if (!record) {
    notFound();
  }

  const run = runRecordToLatestRun(record);

  const tabsData: TabItem[] = [
    {
      id: "overview",
      label: "Overview",
      content: <RunOverview run={run} />,
    },
    {
      id: "evidence",
      label: "Evidence",
      content: (
        <RunEvidenceList
          runId={run.id}
          capturedAt={run.finishedAt ?? run.createdAt}
          pageUrl={run.finalUrl ?? run.startingUrl}
          brokenImages={run.brokenImages}
          consoleErrors={run.consoleErrors}
          failedRequests={run.failedRequests}
        />
      ),
    },
    {
      id: "checks",
      label: "QA Checks",
      content: <RunChecksList checks={run.checks} />,
    },
    {
      id: "trail",
      label: "Browser Trail",
      content: <BrowserTrail trail={run.trail} />,
    },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppHeader />
      <div className="py-10 px-6 mx-auto max-w-5xl">
        <RunSummaryHeader run={run} />
        <div className="rounded-lg border border-border bg-panel p-5">
          <Tabs tabs={tabsData} />
        </div>
      </div>
    </main>
  );
}
