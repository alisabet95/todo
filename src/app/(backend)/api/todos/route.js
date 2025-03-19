import { authOptions } from "@/app/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma/client"; // ✅ Correct import

export async function GET(req) {
  

  const session = await getServerSession(authOptions);


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
    console.log("Received body:", body);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(session.user.id) } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newtask = await prisma.task.create({
      data: {
        title,
        userId: user.id, // Already a number from Prisma
      },
    });

    return NextResponse.json(newtask, { status: 201 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
export async function DELETE(request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  try {
    // Convert session.user.id to number if it's a string
    const userId = Number(session.user.id);
    const taskId = Number(id);

    if (isNaN(taskId)) {
      return NextResponse.json({ error: "Invalid task ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ 
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const task = await prisma.task.findUnique({ 
      where: { id: taskId }
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const deletedTask = await prisma.task.delete({ 
      where: { id: taskId }
    });

    return NextResponse.json({ 
      message: "Task deleted successfully",
      task: deletedTask 
    }, { status: 200 });

  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ 
      error: "Server error",
      details: error.message 
    }, { status: 500 });
  }
}