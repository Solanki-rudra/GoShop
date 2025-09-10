// middleware.ts
import { verifyJwt } from "@/lib/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
console.log('middleware file')
  const token = req.cookies.get("token")?.value; // 👈 change cookie name if different
  const url = req.nextUrl.clone();
console.log(token)
  // If no token → redirect to login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    // Decode JWT (payload contains role)
    const payload = verifyJwt(token);
    // Example payload: { userId: "123", role: "customer" | "seller" | "admin" }

    // Store role in request headers (so frontend can read it)
    const res = NextResponse.next();
    res.headers.set("x-user-role", payload.role);
    return res;
  } catch (err) {
    console.error("Invalid token:", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

// Run middleware only for homepage `/`
export const config = {
  matcher: ["/"],
};
