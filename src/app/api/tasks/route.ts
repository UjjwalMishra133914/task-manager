import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// 🔍 GET TASKS
export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user: any = verifyToken(token || "");

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 👑 Admin → all tasks
    if (user.role === "admin") {
      const tasks = await Task.find().sort({ createdAt: -1 });
      return Response.json(tasks);
    }

    // 👤 Member → only assigned tasks
    const tasks = await Task.find({
      assignedTo: new mongoose.Types.ObjectId(user.id),
    }).sort({ createdAt: -1 });

    return Response.json(tasks);

  } catch (error) {
    console.log("GET TASK ERROR ❌", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}


// ➕ CREATE TASK
export async function POST(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user: any = verifyToken(token || "");

    if (!user || user.role !== "admin") {
      return Response.json(
        { error: "Only admin can create task" },
        { status: 403 }
      );
    }

    const { title } = await req.json();

    if (!title) {
      return Response.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const task = await Task.create({
      title,
      status: "Pending",
      assignedTo: new mongoose.Types.ObjectId(user.id),
    });

    return Response.json(task);

  } catch (error) {
    console.log("CREATE TASK ERROR ❌", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}