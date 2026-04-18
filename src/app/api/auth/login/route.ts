import { NextRequest, NextResponse } from "next/server";
import { encrypt, SESSION_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "password123";

    if (
      username?.trim()?.toLowerCase() === adminUser.toLowerCase() && 
      password?.trim() === adminPass
    ) {
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const session = await encrypt({ user: adminUser, expires });

      const response = NextResponse.json({ success: true });
      
      response.cookies.set(SESSION_NAME, session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
    } catch (err) {
    console.error("Login API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
