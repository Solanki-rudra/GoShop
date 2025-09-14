// src/lib/clientAuth.ts
// NOTE: intentionally NOT "use client" — safe to import from server or client modules.

type MaybeUser = any | null;

export const setUserToLocalStorage = (user: any, token?: string) => {
  if (typeof window === "undefined") return; // do nothing on server
  try {
    localStorage.setItem("user", JSON.stringify(user));
    if (token) localStorage.setItem("token", token);
    // notify same-tab listeners
    try {
      window.dispatchEvent(new CustomEvent("authChanged", { detail: { user } }));
    } catch {}
  } catch (err) {
    console.warn("setUserToLocalStorage failed", err);
  }
};

export const removeUserFromLocalStorage = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    try {
      window.dispatchEvent(new CustomEvent("authChanged", { detail: { user: null } }));
    } catch {}
  } catch (err) {
    console.warn("removeUserFromLocalStorage failed", err);
  }
};

export const getUserFromLocalStorage = (): MaybeUser => {
  if (typeof window === "undefined") return null; // safe on server
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    return JSON.parse(storedUser);
  } catch (err) {
    console.warn("getUserFromLocalStorage parse failed", err);
    return null;
  }
};

/**
 * Helper to subscribe to auth changes (storage + same-tab custom event).
 * Returns an unsubscribe function.
 */
export const onAuthChange = (cb: (user: MaybeUser) => void) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb(getUserFromLocalStorage());
  const authChangedHandler = () => handler();
  window.addEventListener("storage", handler);
  window.addEventListener("authChanged", authChangedHandler);
  // call immediately with current user
  handler();
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("authChanged", authChangedHandler);
  };
};
