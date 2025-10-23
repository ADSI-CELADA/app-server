import mongoose from "mongoose";
import { Environment } from "../config/Config";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(Environment.getInstance().get("URI_MONGO"));
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error);
    process.exit(1);
  }
};
