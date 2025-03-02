
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/client";

export async function GET(request, { params }) {
  const { username } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, email: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}