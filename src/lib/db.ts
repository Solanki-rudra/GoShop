import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI as string;
if (!MONGO_URI) throw new Error("MONGODB_URI is not set");

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  console.log("[[ 🔗 Database connected 🔗 ]]");
  return cached.conn;
};
