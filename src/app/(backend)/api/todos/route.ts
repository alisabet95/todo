import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";

// GET API - Fetch all todos
export async function GET() {
  try {
    const todos = await prisma.task.findMany();
    return NextResponse.json(todos, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// POST API - Add a new todo
export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Log the input to verify it's correct
    console.log("Received title:", title);

    const newTodo = await prisma.task.create({
      data: { title, completed: false },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error); // Log the error details
    return NextResponse.json(
      { error: "Failed to create todo", details: error.message },
      { status: 500 }
    );
  }
}
