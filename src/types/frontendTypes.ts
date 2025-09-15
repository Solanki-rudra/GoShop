// src/types/frontendTypes.ts
export interface Product {
  _id: string;           // always string in JSON
  name: string;
  price: number;
  images?: string[];
}

export interface CartItem {
  productId: Product;    // always populated by API
  quantity: number;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  addresses: string[];
  cart: CartItem[];
  favorites: string[];   // ObjectIds serialized to strings
}
