import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { username } = await params;

  if (session.user.username !== username) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { photos: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.photos, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}