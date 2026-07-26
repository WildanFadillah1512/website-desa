"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, createSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Semua kolom wajib diisi." };
  }

  try {
    const [user] = await db.select().from(users).where(eq(users.username, username));

    if (!user) {
      return { error: "Username atau password salah." };
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      return { error: "Username atau password salah." };
    }

    // Set session cookie
    await createSession({
      id: user.id,
      role: user.role,
      name: user.name,
      username: user.username
    });

  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Terjadi kesalahan saat memproses login." };
  }

  redirect("/admin");
}
