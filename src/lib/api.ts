import { BASE_URL } from "@/config/api";

// ======================
// Products
// ======================
export const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/api/products`, { cache: "no-store" });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const getProduct = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/products/${id}`, { cache: "no-store" });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

// ======================
// Auth
// ======================
export const registerUser = async (data: any) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const loginUser = async (data: any) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
}

// ======================
// Cart APIs
// ======================
export const getCart = async () => {
  const response = await fetch(`${BASE_URL}/api/cart`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const addToCart = async (productId: string, quantity = 1) => {
  const response = await fetch(`${BASE_URL}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const updateCartItem = async (productId: string, quantity: number) => {
  const response = await fetch(`${BASE_URL}/api/cart`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const removeFromCart = async (productId: string) => {
  const response = await fetch(`${BASE_URL}/api/cart`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message)
  }
  return response.json();
};

