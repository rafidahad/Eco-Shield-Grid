import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with dynamic nodes...");

  // Seed Node 1: Warehouse
  const node1 = await prisma.node.upsert({
    where: { deviceId: "eco_node_warehouse_dev" },
    update: {},
    create: {
      deviceId: "eco_node_warehouse_dev",
      apiKey: "eco_sk_warehouse_dev_123",
      ownerName: "Admin User",
      nodeName: "Warehouse Climate Controller",
      nodeType: "WAREHOUSE",
      coolingThreshold: 25.0,
      isActive: true,
    },
  });

  // Seed Node 2: Field
  const node2 = await prisma.node.upsert({
    where: { deviceId: "eco_node_field_dev" },
    update: {},
    create: {
      deviceId: "eco_node_field_dev",
      apiKey: "eco_sk_field_dev_456",
      ownerName: "Admin User",
      nodeName: "Field & Safety Monitor",
      nodeType: "FIELD",
      irrigationThreshold: 30,
      isActive: true,
    },
  });

  // Remove existing telemetry to prevent dev clutter on re-seed
  await prisma.telemetry.deleteMany();

  // Create demo telemetry records
  const now = new Date();
  const warehouseData = [
    { internal_temp_c: 22.5, internal_hum_pct: 45.0, external_temp_c: 28.1, external_hum_pct: 60.0, fan_active: false },
    { internal_temp_c: 23.1, internal_hum_pct: 46.2, external_temp_c: 29.5, external_hum_pct: 58.0, fan_active: false },
    { internal_temp_c: 24.5, internal_hum_pct: 48.5, external_temp_c: 31.2, external_hum_pct: 55.0, fan_active: true },
    { internal_temp_c: 25.3, internal_hum_pct: 50.1, external_temp_c: 32.5, external_hum_pct: 52.0, fan_active: true },
  ];

  const fieldData = [
    { soil_moisture_percent: 55, air_quality_ppm: 280, pump_active: false },
    { soil_moisture_percent: 50, air_quality_ppm: 310, pump_active: false },
    { soil_moisture_percent: 45, air_quality_ppm: 350, pump_active: true },
    { soil_moisture_percent: 38, air_quality_ppm: 550, pump_active: true },
  ];

  for (let i = 0; i < warehouseData.length; i++) {
    await prisma.telemetry.create({
      data: {
        nodeId: node1.id,
        payload: warehouseData[i],
        createdAt: new Date(now.getTime() - (warehouseData.length - i) * 60000),
      },
    });
  }

  for (let i = 0; i < fieldData.length; i++) {
    await prisma.telemetry.create({
      data: {
        nodeId: node2.id,
        payload: fieldData[i],
        createdAt: new Date(now.getTime() - (fieldData.length - i) * 60000),
      },
    });
  }

  console.log("✅ Seed complete: 2 Nodes, 8 Telemetry records.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
