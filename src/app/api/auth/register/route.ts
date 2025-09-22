import { connectToDatabase } from "@/lib/db";
import { signJwt } from "@/lib/jwt";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        await connectToDatabase();
        const { email, password, name, role, phone } = await req.json();

        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            role,
            phone,
        });

        const token = signJwt({ id: newUser._id, role: newUser.role }, "7d");

        // exclude password from user object
        const { password: _, ...safeUser } = newUser.toObject();

        const response = NextResponse.json(
            {
                message: "User registered successfully",
                user: { ...safeUser, token },
            },
            { status: 201 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return response;
    } catch (error: unknown) {
        console.error("Registration error:", error);

        if (error instanceof Error) {
            return NextResponse.json(
                { message: "Server error", error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Server error", error: String(error) },
            { status: 500 }
        );
    }
};
