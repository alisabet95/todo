// src/app/api/register/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Define Zod schema for request body
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request) {
  try {
    // Parse and validate request body with Zod
    const body = await request.json();
    const parsedData = registerSchema.safeParse(body);

    if (!parsedData.success) {
      // Extract the first error message for simplicity
      const errorMessage = parsedData.error.errors[0].message;
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { username, email, password } = parsedData.data;

    // Check for existing username
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json({ error: "Username already taken" }, { status: 400 });
    }

    // Check for existing email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "User created", id: user.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}