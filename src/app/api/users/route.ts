import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    const user: any = verifyToken(token || "");

    if (!user || user.role !== "admin") {
      return Response.json([], { status: 200 });
    }

    // ✅ show all members (no project restriction)
    const users = await User.find({
      role: "member",
    }).select("_id name email");

    return Response.json(users);

  } catch (error) {
    console.log("USERS API ERROR ❌", error);
    return Response.json([], { status: 200 });
  }
}