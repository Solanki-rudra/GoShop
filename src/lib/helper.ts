import { cookies } from "next/headers";
import { verifyJwt } from "./jwt";

/**
 * @name getAuthenticatedUser
 * @description to authenticate user by token and authorize by provided roles
 * @returns Scenarios -> TRUE: token's payload || FALSE: null
 */
export const getAuthenticatedUser = async (roles: string[] = []) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  const payload = verifyJwt(token);
  if (roles.length && !roles.includes(payload.role)) return null;

  return payload;
};
