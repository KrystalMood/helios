import { prisma } from "@/lib/prisma";

import { runRecordToLatestRun } from "@/lib/helios/server/run-record";
import { getErrorMessage } from "@/lib/helios/shared/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const run = await prisma.run.findUnique({
      where: { id },
    });

    if (!run) {
      return Response.json(
        { error: "Not found", message: `Run with ID ${id} was not found` },
        { status: 404 },
      );
    }

    return Response.json(runRecordToLatestRun(run));
  } catch (error) {
    return Response.json(
      {
        error: "Database error",
        message: getErrorMessage(error, "Failed to retrieve run."),
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.run.deleteMany({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    return Response.json(
      {
        error: "Database error",
        message: getErrorMessage(error, "Failed to delete run."),
      },
      { status: 500 },
    );
  }
}
