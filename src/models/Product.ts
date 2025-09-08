import { PRODUCT_CATEGORIES } from "@/constants/enum";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        discount: {
            type: Number,
            default: 0,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 1
        },
        category: {
            type: String,
            required: true,
            enum: PRODUCT_CATEGORIES
        },
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        images: [
            {
                type: String,
                required: true
            }
        ],
        video: {
            type: String,
        }
    },
    { timestamps: true }
)

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;