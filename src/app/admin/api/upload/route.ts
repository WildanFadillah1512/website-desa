import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawCookie = request.headers.get("cookie") ?? "";
  const sessionCookie =
    request.cookies.get("session")?.value ??
    rawCookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("session="))
      ?.slice("session=".length);

  const session = sessionCookie ? await decrypt(sessionCookie).catch(() => null) : null;
  const isProxyAuthenticated = request.headers.get("x-admin-auth") === "1";

  if (!session && !isProxyAuthenticated) {
    return NextResponse.json(
      {
        error: sessionCookie
          ? "Session admin tidak valid. Silakan logout lalu login ulang."
          : "Session admin tidak terkirim. Silakan logout lalu login ulang.",
      },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const filename = safeFileName(searchParams.get("filename") ?? "");
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (!ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json(
      { error: "Format gambar harus JPG, PNG, atau WEBP." },
      { status: 400 }
    );
  }

  if (contentLength > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Ukuran gambar maksimal 4MB." },
      { status: 400 }
    );
  }

  const file = await request.blob();
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Ukuran gambar maksimal 4MB." },
      { status: 400 }
    );
  }

  const blob = await put(`cms/${Date.now()}-${filename}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url });
}
