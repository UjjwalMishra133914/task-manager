import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user: any = verifyToken(token || "");

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let projects;

    if (user.role === "admin") {
      projects = await Project.find({ createdBy: user.id });
    } else {
      projects = await Project.find({ members: user.id });
    }

    return Response.json(projects || []);
  } catch (err) {
    console.log("GET PROJECT ERROR ❌", err);
    return Response.json([], { status: 200 });
  }
}


// ✅ CREATE PROJECT
export async function POST(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user: any = verifyToken(token || "");

    if (!user || user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const projectName = body.name;
    const incomingMembers = Array.isArray(body.members)
      ? body.members
      : [];

    // ✅ FIX: NO "members" variable duplication
    const finalMembers = Array.from(
      new Set([user.id, ...incomingMembers])
    );

    const project = await Project.create({
      name: projectName,
      createdBy: user.id,
      members: finalMembers,
    });

    return Response.json(project);
  } catch (err) {
    console.log("CREATE PROJECT ERROR ❌", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}