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

  const photo = await prisma.photo.findUnique({
    where: { id: Number(photoId) },
  });

  if (!photo) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  console.log("Session User ID:", session.user.id);
  console.log("Photo User ID:", photo.userId);

  if (Number(photo.userId) !== Number(session.user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.photo.delete({
    where: { id: Number(photoId) },
  });

  return NextResponse.json({ message: "Photo deleted" }, { status: 200 });
}