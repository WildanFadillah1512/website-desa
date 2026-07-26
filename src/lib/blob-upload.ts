import { del, put } from "@vercel/blob";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function safeFileName(filename: string) {
  const fallback = "upload.jpg";
  const clean = (filename || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return clean || fallback;
}

export async function resolveImageField(formData: FormData, key: string) {
  const existingValue = (formData.get(key) as string) ?? "";
  const fileValue = formData.get(`${key}__file`);

  if (!(fileValue instanceof File) || fileValue.size === 0) {
    return existingValue;
  }

  if (!ALLOWED_TYPES.has(fileValue.type)) {
    throw new Error("Format gambar harus JPG, PNG, atau WEBP.");
  }

  if (fileValue.size > MAX_UPLOAD_BYTES) {
    throw new Error("Ukuran gambar maksimal 4MB.");
  }

  const blob = await put(`cms/${Date.now()}-${safeFileName(fileValue.name)}`, fileValue, {
    access: "public",
  });

  try {
    const oldUrl = new URL(existingValue);
    if (oldUrl.hostname.endsWith("vercel-storage.com")) {
      await del(existingValue);
    }
  } catch {
    // Existing local/static/base64 values do not need Blob cleanup.
  }

  return blob.url;
}
