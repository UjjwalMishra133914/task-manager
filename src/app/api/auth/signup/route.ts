import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return Response.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return Response.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
    });

    return Response.json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    console.log("Signup Error:", error);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}