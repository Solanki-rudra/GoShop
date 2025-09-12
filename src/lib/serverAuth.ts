import { cookies } from "next/headers";
import { verifyJwt } from "./jwt";

export async function getUserFromServerCookies() {
  const cookieStore:any = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;
  const payload = verifyJwt(token);
  return payload || null;
}
