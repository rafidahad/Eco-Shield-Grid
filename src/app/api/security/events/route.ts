import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Fetch recent telemetry
    const telemetry = await prisma.telemetry.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        node: true,
      },
    });

    // 2. Identify breaches based on node thresholds
    const breaches = telemetry.filter((t: any) => {
      const payload = t.payload || {};
      const node = t.node;
      
      if (node.nodeType === "WAREHOUSE") {
        return (payload.internal_temp_c || 0) > node.coolingThreshold;
      } else {
        return (payload.soil_moisture_percent || 0) < node.irrigationThreshold;
      }
    }).map((t: any) => ({
      id: t.id,
      timestamp: t.createdAt,
      type: "THRESHOLD_BREACH",
      severity: "CRITICAL",
      nodeName: t.node.nodeName,
      details: t.node.nodeType === "WAREHOUSE" 
        ? `Internal Temp (${t.payload.internal_temp_c}°C) exceeded threshold (${t.node.coolingThreshold}°C)`
        : `Soil Moisture (${t.payload.soil_moisture_percent}%) fell below threshold (${t.node.irrigationThreshold}%)`
    }));

    // 3. Mock Access Logs (since we don't have an audit table yet)
    const accessLogs = [
      {
        id: "access-01",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        type: "ADMIN_LOGIN",
        severity: "INFO",
        nodeName: "CONTROL_CENTER",
        details: "Super Admin session established via BDT Enclave"
      },
      {
        id: "access-02",
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        type: "CONFIG_UPDATE",
        severity: "WARNING",
        nodeName: "WAREHOUSE_CORE",
        details: "Cooling threshold updated to 25.0°C"
      }
    ];

    // Combine and sort
    const allEvents = [...breaches, ...accessLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json(allEvents, { status: 200 });
  } catch (error) {
    console.error("Error fetching security events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
