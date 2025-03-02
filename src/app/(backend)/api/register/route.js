
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/client";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();
    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "User created", id: user.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
