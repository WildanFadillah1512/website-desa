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

export async function createSession(user: { id: number; role: string; name: string; username: string }) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

export const getSession = cache(async () => {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
});

export async function destroySession() {
  (await cookies()).delete("session");
}
