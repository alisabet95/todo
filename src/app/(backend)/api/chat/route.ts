import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `You are a friendly and helpful AI assistant. Answer politely: ${message}`,
        }),
      }
    );

    const data = await response.json();

    // Extract response text or fallback message
    const reply = data[0]?.generated_text || "Sorry, I couldn't respond.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { reply: "Sorry, something went wrong!" },
      { status: 500 }
    );
  }
}
