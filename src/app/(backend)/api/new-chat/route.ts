import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const API_URL = process.env.API_ADDRESS;
    const API_SECRET = process.env.API_SECRET;

    if (!API_URL || !API_SECRET) {
      return NextResponse.json(
        { error: "Server misconfiguration: Missing API credentials." },
        { status: 500 }
      );
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "api-key": API_SECRET, // ✅ Correct header key
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `API request failed: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data?.reply || "Sorry, no response from AI.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { reply: "Sorry, something went wrong on the server!" },
      { status: 500 }
    );
  }
}
