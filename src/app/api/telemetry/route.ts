import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const deviceId = request.headers.get("x-device-id");
    const apiKey = request.headers.get("x-api-key");

    if (!deviceId || !apiKey) {
      return NextResponse.json(
        { error: "Unauthorized: Missing 'x-device-id' or 'x-api-key' headers." },
        { status: 401 }
      );
    }

    const node = await prisma.node.findUnique({
      where: { deviceId },
    });

    if (!node || !node.isActive || node.apiKey !== apiKey) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid credentials or inactive node." },
        { status: 401 }
      );
    }

    const payload = await request.json();

    const telemetry = await prisma.telemetry.create({
      data: {
        nodeId: node.id,
        payload,
      },
    });

    // NEW: Return the cloud thresholds back to the ESP32
    return NextResponse.json(
      { 
        success: true, 
        id: telemetry.id,
        thresholds: {
          cooling: node.coolingThreshold,
          irrigation: node.irrigationThreshold
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Telemetry ingestion error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
