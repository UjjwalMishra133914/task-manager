import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import User from "@/models/User";
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

    let tasks = [];

    if (user.role === "admin") {
      tasks = await Task.find()
        .populate("assignedTo", "name email")
        .populate("project", "name")
        .sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({
        assignedTo: user.id,
      })
        .populate("assignedTo", "name email")
        .populate("project", "name")
        .sort({ createdAt: -1 });
    }

    return Response.json(tasks || []);
  } catch (error) {
    console.log("GET TASK ERROR ❌", error);
    return Response.json([], { status: 200 });
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

    const { title, assignedTo, projectId } = await req.json();

    if (!title || !assignedTo || !projectId) {
      return Response.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return Response.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // ✅ SMART FIX: auto-add user if not in project
    const isMember = project.members.some(
      (m: any) => m.toString() === assignedTo
    );

    if (!isMember) {
      project.members.push(
        new mongoose.Types.ObjectId(assignedTo)
      );
      await project.save();
    }

    // ✅ Create task
    const task = await Task.create({
      title,
      status: "Pending",
      assignedTo: new mongoose.Types.ObjectId(assignedTo),
      project: new mongoose.Types.ObjectId(projectId),
    });

    // ✅ Populate for frontend
    await task.populate("assignedTo", "name email");
    await task.populate("project", "name");

    return Response.json(task);

  } catch (error) {
    console.log("CREATE TASK ERROR ❌", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}