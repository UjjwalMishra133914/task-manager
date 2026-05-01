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

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);