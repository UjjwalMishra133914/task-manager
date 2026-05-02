import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { NextRequest } from "next/server";

// ✅ UPDATE TASK STATUS
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // ✅ FIX: await params
    const { id } = await context.params;

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user: any = verifyToken(token || "");

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("assignedTo", "name email")
      .populate("project", "name");

    return Response.json(task);

  } catch (error) {
    console.log("UPDATE TASK ERROR ❌", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}