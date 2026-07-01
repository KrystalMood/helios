import {
  EVIDENCE_STATUSES,
  type EvidenceStatus,
} from "@/lib/helios/shared/types";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; evidenceId: string }> },
) {
  const { id, evidenceId } = await params;

  let body: { status?: unknown };

  try {
    body = await request.json();
  } catch (error) {
    console.error("Error parsing request body:", error);
    return NextResponse.json(
      { error: "Failed to parse request body" },
      { status: 400 },
    );
  }

  const { status } = body;

  if (
    typeof status !== "string" ||
    !EVIDENCE_STATUSES.includes(status as EvidenceStatus)
  ) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const updatedResult = await prisma.evidence.updateMany({
      where: {
        id: evidenceId,
        runId: id,
      },
      data: {
        status: status as EvidenceStatus,
      },
    });

    if (updatedResult.count === 0) {
      return NextResponse.json(
        { error: "Evidence not found or unauthorized" },
        { status: 404 },
      );
    }

    const updateEvidence = await prisma.evidence.findUnique({
      where: { id: evidenceId },
    });

    return NextResponse.json(updateEvidence);
  } catch (error) {
    console.error("Error updating evidence status:", error);
    return NextResponse.json(
      { error: "Failed to update evidence status" },
      { status: 500 },
    );
  }
}
