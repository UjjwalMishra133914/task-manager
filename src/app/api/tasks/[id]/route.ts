import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user: any = verifyToken(token || "");

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();

    const task = await Task.findById(params.id);

    if (!task) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    if (
      user.role !== "admin" &&
      task.assignedTo.toString() !== user.id
    ) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    task.status = status;
    await task.save();

    await task.populate("assignedTo", "name email");
    await task.populate("project", "name");

    return Response.json(task);

  } catch (error) {
    console.log("UPDATE ERROR ❌", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}