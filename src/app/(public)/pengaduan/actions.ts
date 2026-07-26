"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { pengaduan } from "@/db/schema";

export type PengaduanFormState = {
  error: string | null;
  trackingCode: string | null;
};

function cleanInput(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

async function makeTrackingCode() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = `LAP-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;
    const existing = await db.query.pengaduan.findFirst({
      where: eq(pengaduan.trackingCode, code),
      columns: { id: true },
    });

    if (!existing) return code;
  }

  return `LAP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
}

export async function createPengaduanAction(
  _prevState: PengaduanFormState,
  formData: FormData
): Promise<PengaduanFormState> {
  const namaPelapor = cleanInput(formData.get("namaPelapor"));
  const nik = cleanInput(formData.get("nik"));
  const kontak = cleanInput(formData.get("kontak"));
  const kategori = cleanInput(formData.get("kategori"));
  const isiLaporan = cleanInput(formData.get("isiLaporan"));

  if (!namaPelapor || !kontak || !kategori || !isiLaporan) {
    return { error: "Lengkapi nama, kontak, kategori, dan isi laporan.", trackingCode: null };
  }

  if (isiLaporan.length < 20) {
    return {
      error: "Isi laporan minimal 20 karakter agar mudah ditindaklanjuti.",
      trackingCode: null,
    };
  }

  const trackingCode = await makeTrackingCode();

  try {
    await db.insert(pengaduan).values({
      trackingCode,
      namaPelapor,
      nik: nik || null,
      kontak: kontak || null,
      kategori,
      isiLaporan,
      lampiranUrl: null,
      isPublic: false,
      status: "menunggu",
    });
  } catch (error) {
    console.error("Create pengaduan error:", error);
    return {
      error: "Laporan belum berhasil dikirim. Silakan coba lagi.",
      trackingCode: null,
    };
  }

  revalidatePath("/admin/pengaduan");

  return { error: null, trackingCode };
}
