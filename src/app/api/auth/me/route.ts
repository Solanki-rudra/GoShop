import { connectToDatabase } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/helper";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectToDatabase();

        const userPayload = await getAuthenticatedUser();
        if (!userPayload) {
            return NextResponse.json(
                { message: "Not authenticated", user: null },
                { status: 401 }
            );
        }

        const user = await User.findById(userPayload.id).select("-password");

        return NextResponse.json(
            { message: "User fetched successfully", user },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Me error:", error);

        if (error instanceof Error) {
            return NextResponse.json(
                { message: "Server error", error: error.message, user: null },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Server error", error: String(error), user: null },
            { status: 500 }
        );
    }
};
