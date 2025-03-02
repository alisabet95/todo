import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/client";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // In a real app, you’d return a token or set up session management here
    return NextResponse.json({ message: "Logged in successfully", id: user.id }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}