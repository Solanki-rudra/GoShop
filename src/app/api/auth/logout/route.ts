import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    try {
        const response = NextResponse.json(
            { message: 'User logged out successfully' },
            { status: 200 }
        )
        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            maxAge: 0,
            path: '/'
        });

        return response;
    } catch (error: any) {
        console.log('Logout error:', error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}