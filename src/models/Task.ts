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

    // ✅ ADD THIS (VERY IMPORTANT)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task ||
  mongoose.model("Task", TaskSchema);