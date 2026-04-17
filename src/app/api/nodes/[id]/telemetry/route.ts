import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const nodeId = params.id;
    // Extract query param limit (default 50)
    const url = new URL(request.url);
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 50;

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
      take: isNaN(limit) ? 50 : limit,
    });

    // We can reverse the history so it flows chronologically left-to-right for charts
    return NextResponse.json(history.reverse(), { status: 200 });
  } catch (error) {
    console.error("Error fetching node telemetry history:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
