import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    isConnected = true;
    console.log("MongoDB Connected ✅");

  } catch (error) {
    console.log("DB Error ❌", error);
    throw error;
  }
};