import { connectToDatabase } from "@/lib/db";
import { signJwt } from "@/lib/jwt";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        await connectToDatabase();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 401 }
            );
        }

        const isPassOk = await bcrypt.compare(password, user.password);

        if (!isPassOk) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            )
        }

        const token = signJwt({ id: user._id, role: user.role }, '7d');

        const { password: _removed, ...safeUser } = user.toObject();

        let response = NextResponse.json(
            {
                message: 'User logged in successfully',
                user: safeUser,
            },
            { status: 200 }
        );
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.log('Login error:', error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );

    }
}