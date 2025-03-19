import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  console.log("🔥 Middleware is running on:", req.nextUrl.pathname);

  // Check for session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("🛑 Token in middleware:", token || "No token found");

  if (!token) {
    console.warn("🚨 Unauthorized! Redirecting to login...");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/todo/:path*", "/album/:path*"], // Only protect these routes
};
