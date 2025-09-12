import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

export async function middleware(req: NextRequest) {
  console.log('middleware file');
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();
  console.log(token);

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const payload = await verifyJwt(token);
    const res = NextResponse.next();
    res.headers.set("x-user-role", payload.role as string);
    return res;
  } catch (err) {
    console.error("Invalid token:", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/orders", "/orders/:path*", "/cart", "/cart/:path*", "/checkout", "/checkout/:path*"],
};