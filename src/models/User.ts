import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
});

// ✅ FIX (important for Next.js)
const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default User;