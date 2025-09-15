// src/types/backendTypes.ts
import { Types } from "mongoose";

export interface Product {
  _id: Types.ObjectId;
  name: string;
  price: number;
  images?: string[];
}

export interface CartItem {
  productId: Types.ObjectId | Product; // may be populated or not
  quantity: number;
}

export interface BackendUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  role: string;
  phone?: string;
  addresses: string[];
  cart: CartItem[];
  favorites: Types.ObjectId[];
}
