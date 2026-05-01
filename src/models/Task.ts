import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: String,
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Done"],
      default: "Pending",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task =
  mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);

export default Task;