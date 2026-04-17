import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verify Super Admin Session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Super Admin session required." },
        { status: 401 }
      );
    }

    const { id } = params;

    // 2. Hard Delete Node (Telemetry will be cascaded if configured, or we delete it first)
    // Looking at schema.prisma, Telemetry has `@relation(fields: [nodeId], references: [id], onDelete: Cascade)`
    await prisma.node.delete({
      where: { id },
    });

    console.log(`Node ${id} decommissioned by ${session.user}`);

    return NextResponse.json({ 
        success: true, 
        message: "Node successfully purged from the grid." 
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
       return NextResponse.json({ error: "Node not found." }, { status: 404 });
    }
    console.error("Node decommissioning error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
