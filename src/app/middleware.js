import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("Token in middleware:", token);

  const { pathname } = req.nextUrl;

  // If token fetching fails, prevent infinite loops or crashes
  if (pathname.startsWith("/todo") && !token) {
    console.warn("Unauthorized access to /todo, redirecting...");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/todo/:path*", "/album/:path*"], // Ensure correct pattern
};
