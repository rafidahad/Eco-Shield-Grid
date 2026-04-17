import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ownerName, nodeName, nodeType } = body;

    if (!ownerName || !nodeName || !nodeType) {
      return NextResponse.json(
        { error: "Bad Request: ownerName, nodeName, and nodeType are required." },
        { status: 400 }
      );
    }

    // Generate credentials
    const deviceId = `eco_node_${crypto.randomBytes(8).toString("hex")}`;
    const apiKey = `eco_sk_${crypto.randomBytes(16).toString("hex")}`;

    const node = await prisma.node.create({
      data: {
        deviceId,
        apiKey,
        ownerName,
        nodeName,
        nodeType,
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        message: "Node registered successfully.",
        deviceId: node.deviceId,
        apiKey: node.apiKey,
        nodeId: node.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Node registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
