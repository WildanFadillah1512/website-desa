"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { pengaduan } from "@/db/schema";
import { getSession } from "@/lib/auth";

type ComplaintStatus = "menunggu" | "diproses" | "selesai" | "ditolak";

const STATUS_LABELS: Record<ComplaintStatus, string> = {
  menunggu: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

export async function updatePengaduanAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/4d31n");

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "menunggu") as ComplaintStatus;
  const tanggapan = String(formData.get("tanggapan") || "").trim();
  const isPublic = formData.get("isPublic") === "on";

  if (!id || !STATUS_LABELS[status]) return;

  await db
    .update(pengaduan)
    .set({
      status,
      tanggapan: tanggapan || null,
      isPublic,
      updatedAt: new Date(),
    })
    .where(eq(pengaduan.id, id));

  revalidatePath("/admin/pengaduan");
  revalidatePath(`/admin/pengaduan/${id}`);
  revalidatePath("/pengaduan");
}
