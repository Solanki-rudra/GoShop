import { BASE_URL } from "@/config/api";

export const getProducts = async () => {
  const response = await fetch(`${BASE_URL}/api/products`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

export const getProduct = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/products/${id}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch product");
  return response.json();
};

export const registerUser = async (data: any) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export const loginUser = async (data: any) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}