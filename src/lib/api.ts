import { BASE_URL } from "@/config/api";

// ======================
// Products
// ======================
export const getProducts = async (sellerId?: string) => {
  // Construct the base URL
  let url = `${BASE_URL}/api/products`;

  // If a sellerId is provided, append it as a query parameter
  if (sellerId) {
    url += `?sellerId=${sellerId}`;
  }

  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch products");
  }

  return response.json();
};

export const createProduct = async (data: any) => {
  const response = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create product");
  }
  return response.json();
}

export const updateProduct = async (id: string, data: any) => {
  const response = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT", // or PATCH depending on your API
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update product");
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

export const deleteProduct = async (id: string) => {
  const response = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
}

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

export const getUserInfo = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
}

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

export const toggleFavorite = async (productId: string) => {
  const res = await fetch(`/api/products/${productId}/favorite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to toggle favorite");
  return res.json();
};

export const getFavorites = async () => {
  const res = await fetch("/api/products/favorite", {
    method: "GET",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch favorites");
  }
  return data;
};

export const payment = async (amount: number, orderId: string, paymentMode: string, currency='INR', customerId = 'user_id_1', customerEmail='user@example.com', customerPhone='9999999999', customerName='user1') => {
  const res = await fetch("/api/payment", {
    method: "POST",
    body: JSON.stringify({
      orderId,
      amount,
      paymentMode,
      currency,
      customerId,
      customerEmail,
      customerPhone,
      customerName
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Payment failed");
  }
  return data;
};

export const createOrder = async (cart: any, shippingAddress: string) => {
  const res = await fetch("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      cart,
      shippingAddress
    })
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.message || "Failed creating order")
  }
  return data
}

export const checkPaymentStatus = async (orderId: string) => {
  const res = await fetch(`/api/payment?order_id=${orderId}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed creating order")
  }
  return data
};
