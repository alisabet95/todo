import { photos } from "./photos";
import { NextResponse } from "next/server";


export async function GET(request) {
  const url = new URL(request.url, "http://localhost:3000"); // Add a base URL
  const pathname = url.pathname;

  if (pathname === "/api/some-photos") {
    return NextResponse.json(photos, { status: 200 });
  }

  return NextResponse.json({ error: "Invalid URL" }, { status: 404 });
}


export async function POST(req) {

  const body = await req.json()
  
  return NextResponse.json(body)
}