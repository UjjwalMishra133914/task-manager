import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user: any = verifyToken(token || "");

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let tasks;

    if (user.role === "admin") {
      tasks = await Task.find();
    } else {
      tasks = await Task.find({
        assignedTo: new mongoose.Types.ObjectId(user.id),
      });
    }

    const total = tasks.length;
    const completed = tasks.filter(
      (t: any) => t.status === "Done"
    ).length;
    const pending = tasks.filter(
      (t: any) => t.status !== "Done"
    ).length;

    return Response.json({ total, completed, pending });

  } catch (error) {
    console.log("DASHBOARD ERROR ❌", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}