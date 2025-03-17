import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { photoId } = await params;
  
  try {
    // Find photo by ID
    const photo = await prisma.photo.findUnique({
      where: { id: Number(photoId) },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    console.log("Session User ID:", session.user.id);
    console.log("Photo User ID:", photo.userId);

    // Get user by email in case of Google login
    let user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) },
    });

    if (!user) {
      console.log("User not found by ID, trying by email...");
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
    }

    if (!user || Number(photo.userId) !== Number(user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.photo.delete({
      where: { id: Number(photoId) },
    });

    return NextResponse.json({ message: "Photo deleted" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
