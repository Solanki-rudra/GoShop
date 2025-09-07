import { connectToDatabase } from "@/lib/db";
import { verifyJwt } from "@/lib/jwt";
import User from "@/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectToDatabase();

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { message: 'Not authenticated', user: null },
                { status: 401 }
            );
        }

        const payload = verifyJwt(token)
        const user = await User.findById(payload.id).select('-password');

        return NextResponse.json(
            { message: 'User fetched successfully', user },
            { status: 200 }
        );

    } catch (error: any) {
        console.log('Me error:', error);
        return NextResponse.json(
            { message: "Server error", error: error.message, user: null },
            { status: 500 }
        );
    }
}