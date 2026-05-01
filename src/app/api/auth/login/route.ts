import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // 🔍 check user
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 🔑 check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // 🎟️ create token (IMPORTANT)
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      "SECRET", // later env me shift karenge
      { expiresIn: "1d" }
    );

    // 📤 send response
    return Response.json({
      token,
      role: user.role,
      name: user.name, // optional (for avatar later)
    });

  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}