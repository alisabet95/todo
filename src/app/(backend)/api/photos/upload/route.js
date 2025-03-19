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
  const title = formData.get("title");

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  // **1. File Size Check (Prevents large uploads)**
  const MAX_FILE_SIZE = 7 * 1024 * 1024; // 5MB
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File is too large" }, { status: 400 });
  }

  // **2. File Type Check (Prevents script uploads)**
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  // **3. Upload File**
  try {
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Save to database
    const photo = await prisma.photo.create({
      data: {
        title,
        url: blob.url,
        userId: parseInt(session.user.id),
      },
    });

    return NextResponse.json({ message: "Photo uploaded", photo }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
