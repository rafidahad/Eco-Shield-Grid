import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// GET /api/nodes/[id]/history — Returns last 50 telemetry records for a node
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const nodeId = params.id;

    // Check if node exists
    const node = await prisma.node.findUnique({
      where: { id: nodeId },
    });

    if (!node) {
      return NextResponse.json(
        { error: `Node '${nodeId}' not found.` },
        { status: 404 }
      );
    }

    const history = await prisma.telemetry.findMany({
      where: { nodeId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.error("Error fetching node history:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
