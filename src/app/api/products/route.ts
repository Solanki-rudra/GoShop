import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { ROLES } from "@/constants/constant";
import { getAuthenticatedUser } from "@/lib/helper";
import User from "@/models/User";

export const GET = async () => {
  try {
    await connectToDatabase();

    const products = await Product.find();
    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "Products not found" },
        { status: 404 }
      );
    }

    // 🔹 Get logged-in user
    const userPayload = await getAuthenticatedUser();
    let favorites: string[] = [];

    if (userPayload) {
      const user = await User.findById(userPayload.id);
      if (user) {
        favorites = user.favorites.map((fav: any) => fav.toString());
      }
    }

    // 🔹 Add isFavorite flag to each product
    const productsWithFavorite = products.map((product: any) => ({
      ...product.toObject(),
      isFavorite: favorites.includes(product._id.toString()),
    }));

    return NextResponse.json(
      {
        message: "Products fetched successfully",
        products: productsWithFavorite,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Getting products error : ", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};


export const POST = async (request: Request) => {
    try {
        await connectToDatabase();

        const userPayload = await getAuthenticatedUser([ROLES.ADMIN, ROLES.SELLER])
        if (!userPayload) {
            return NextResponse.json(
                { message: "Not authorized" },
                { status: 403 }
            )
        }

        const { name, description, price, discount, stock, category, images, video } = await request.json();

        if (!name || !description || !price || !stock || !category) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newProdcut = await Product.create({
            name, description, price, discount, stock, category, images, video, sellerId: userPayload.id
        })

        return NextResponse.json(
            { message: 'Product created successfully', product: newProdcut },
            { status: 201 }
        )

    } catch (error: any) {
        console.log('Creating product error : ', error);
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}