import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    
    // Ensure we only update the allowed threshold fields
    const updateData: { coolingThreshold?: number; irrigationThreshold?: number } = {};
    
    if (body.coolingThreshold !== undefined) {
      updateData.coolingThreshold = parseFloat(body.coolingThreshold);
    }
    
    if (body.irrigationThreshold !== undefined) {
      updateData.irrigationThreshold = parseInt(body.irrigationThreshold, 10);
    }

    const updatedNode = await prisma.node.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({ success: true, data: updatedNode });
  } catch (error) {
    console.error("Failed to update thresholds:", error);
    return NextResponse.json({ error: "Failed to update thresholds" }, { status: 500 });
  }
}
