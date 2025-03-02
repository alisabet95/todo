import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/client"; // ✅ Correct import

export async function GET(req) {
  console.log("GET request received");

  const session = await getServerSession(authOptions);
  console.log("Session:", session);

  if (!session?.user) {
    console.log("User not authenticated");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
  });
  console.log("User found:", user);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const tasks = await prisma.task.findMany({
    where: { userId: user.id },
  });

  console.log("Tasks retrieved:", tasks);
  return NextResponse.json(tasks, { status: 200 });
}


export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
    console.log("Received body:", body); // Debugging log
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const newtask = await prisma.task.create({
    data: {
      title,
      userId: Number(user.id),
    },
  });

  return NextResponse.json(newtask, { status: 201 });
}
export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "task ID is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const task = await prisma.task.findUnique({ where: { id } });

  if (!task || task.userId !== user.id) {
    return NextResponse.json({ error: "task not found or unauthorized" }, { status: 404 });
  }

  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ message: "task deleted" }, { status: 200 });
}