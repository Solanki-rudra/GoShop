import mongoose from "mongoose";
import { USER_ROLES } from "../constants/enum";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: USER_ROLES,
            default: 'customer'
        },
        phone: {
            type: String,
        },
        addresses: [
            {
                type: String,
                line1: {
                    type: String,
                    required: true
                },
                city: {
                    type: String,
                    required: true
                },
                zip: {
                    type: String,
                    required: true
                }
            },
        ],
        cart: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    default: 1,
                    min: 1
                }
            },
        ],
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
        ],

    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema);

export default User;