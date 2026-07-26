"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteUserAction(formData: FormData) {
  const userId = parseInt(formData.get("userId") as string, 10);
  if (!userId) return;

  // Prevent deleting the last admin or yourself if needed (advanced feature)
  // For now, basic delete:
  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/admin/users");
}

export async function saveUserAction(prevState: any, formData: FormData) {
  const userId = formData.get("userId") as string;
  const username = formData.get("username") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  if (!username || !name || !role) {
    return { error: "Nama, Username, dan Role wajib diisi." };
  }

  try {
    if (userId) {
      // Edit existing user
      const updateData: any = { username, name, role };
      if (password) {
        updateData.passwordHash = await hashPassword(password);
      }
      await db.update(users).set(updateData).where(eq(users.id, parseInt(userId, 10)));
    } else {
      // Create new user
      if (!password) {
        return { error: "Password wajib diisi untuk pengguna baru." };
      }
      const passwordHash = await hashPassword(password);
      await db.insert(users).values({
        username,
        name,
        role,
        passwordHash
      });
    }
  } catch (error: any) {
    console.error("Save User Error:", error);
    if (error.code === '23505') { // Unique violation in Postgres
      return { error: "Username sudah digunakan." };
    }
    return { error: "Terjadi kesalahan saat menyimpan data." };
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
