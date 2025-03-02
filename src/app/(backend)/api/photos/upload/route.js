import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/client";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const username = formData.get("username");
  const title = formData.get("title");

  if (!file || !username) {
    return NextResponse.json({ error: "Missing file or username" }, { status: 400 });
  }

  if (session.user.username !== username) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log("Blob URL:", blob.url);

    const photo = await prisma.photo.create({
      data: {
        title,
        url: blob.url,
        userId: user.id,
      },
    });

    console.log("Photo saved to database:", photo);

    return NextResponse.json({ message: "Photo uploaded", photo }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file or saving to database:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}