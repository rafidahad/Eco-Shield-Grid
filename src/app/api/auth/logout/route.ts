import { NextRequest, NextResponse } from "next/server";
import { SESSION_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set(SESSION_NAME, "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
