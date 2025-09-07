import mongoose from "mongoose";

export const connectToDatabase = async () => {
    try {
        const connectionInit = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('[[ 🔗 Database connected 🔗 ]]');
    } catch (error) {
        console.log('Database connection error:', error);
    }
}