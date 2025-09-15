// src/app/api/products/favorite/route.ts

import { connectToDatabase } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/helper";
import User from "@/models/User";
import { NextResponse } from "next/server";
import "@/models/Product";

export const GET = async () => {
    try {
        // 1. Connect to the database
        await connectToDatabase();

        // 2. Get the authenticated user's session payload
        const userPayload = await getAuthenticatedUser();

        // 3. If no user is authenticated, return an unauthorized error
        if (!userPayload) {
            return NextResponse.json(
                { message: "Authentication required. Please log in." },
                { status: 401 }
            );
        }

        // 4. Find the user and populate their 'favorites' field
        const user = await User.findById(userPayload.id).populate("favorites");

        // 5. If the user is not found in the database, return an error
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // 6. Return the populated list of favorite products
        return NextResponse.json(
            {
                message: "Favorite products fetched successfully",
                favorites: user.favorites, // Array of product objects
            },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Error fetching favorite products:", error);

        const message =
            error instanceof Error ? error.message : "Internal server error";

        return NextResponse.json(
            { message: "Server error", error: message },
            { status: 500 }
        );
    }
};
