import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { cache } from "react";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

import { encrypt, decrypt } from "./jwt";

export { encrypt, decrypt };

const SESSION_COOKIE_NAMES = ["desa_admin_session", "session"] as const;
const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;

export async function createSession(user: { id: number; role: string; name: string; username: string }) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });
  const cookieStore = await cookies();

  cookieStore.set("desa_admin_session", session, {
    expires,
    maxAge: SESSION_MAX_AGE_SECONDS,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  cookieStore.set("session", "", {
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export const getSession = cache(async () => {
  const cookieStore = await cookies();
  const cookieName = SESSION_COOKIE_NAMES.find((name) => cookieStore.get(name)?.value);
  const session = cookieName ? cookieStore.get(cookieName)?.value : undefined;

  if (!session) {
    console.warn("[auth] Admin session cookie missing");
    return null;
  }

  try {
    return await decrypt(session);
  } catch (error) {
    console.warn("[auth] Admin session decrypt failed", {
      cookieName,
      hasAuthSecret: Boolean(process.env.AUTH_SECRET),
      error: error instanceof Error ? error.message : "unknown",
    });
    return null;
  }
});

export async function destroySession() {
  const cookieStore = await cookies();
  for (const name of SESSION_COOKIE_NAMES) {
    cookieStore.set(name, "", {
      expires: new Date(0),
      maxAge: 0,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
}
