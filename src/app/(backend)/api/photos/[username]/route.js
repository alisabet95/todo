import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";


export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let { username } = await params;

  try {
    // Try finding user by username first
    let user = await prisma.user.findUnique({
      where: { username },
      include: { photos: true },
    });

    // If username is "unknown" or user is not found, fallback to email
    if (!user || username === "unknown") {
      console.log("User not found by username, trying by email...");
      user = await prisma.user.findUnique({
        where: { email: session.user.email }, // Use email instead
        include: { photos: true },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.photos, { status: 200 });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
