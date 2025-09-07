import { ORDER_STATUSES } from "@/constants/enum";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                purchasePrice: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],
        shippingAddress: {
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
        paymentId: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ORDER_STATUSES,
            default: 'pending'
        },
        totalAmount: {
            type: Number,
            required: true,
        }
    },
    { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema);

export default Order;