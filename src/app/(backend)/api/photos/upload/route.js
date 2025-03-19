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
  let username = formData.get("username");
  const title = formData.get("title");

  if (!file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  // If username is "unknown", use email instead
  let user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || username === "unknown") {
    console.log("User not found by username, trying by email...");
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
  }

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });



    const photo = await prisma.photo.create({
      data: {
        title,
        url: blob.url,
        userId: user.id,
      },
    });

   

    return NextResponse.json({ message: "Photo uploaded", photo }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file or saving to database:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
