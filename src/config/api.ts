export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "" // ✅ relative path for deployed site
    : "http://localhost:3000"; // for local development
