import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI as string;
if (!MONGO_URI) throw new Error("MONGODB_URI is not set");

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  console.log("Attempting to connect to database...");
  
  if (cached.conn) {
    console.log("Already connected, returning cached connection...");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new connection promise...");
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose).catch((error) => {
      console.error("Connection failed", error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  console.log("[[ 🔗 Database connected 🔗 ]]");
  return cached.conn;
};
