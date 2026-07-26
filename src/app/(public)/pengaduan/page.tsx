import { randomBytes } from "node:crypto";
import {
  CheckCircle,
  Clock,
  HeartHandshake,
  LockKeyhole,
  MessageSquareText,
  Search,
  Send,
  Shield,
} from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { pengaduan } from "@/db/schema";
import { getCollectionDataMap } from "@/lib/cms";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;
type ComplaintStatus = "menunggu" | "diproses" | "selesai" | "ditolak";

const CATEGORIES = [
  { value: "infrastruktur", label: "Infrastruktur & Lingkungan" },
  { value: "pelayanan", label: "Pelayanan Administrasi" },
  { value: "sosial", label: "Kesejahteraan & Sosial" },
  { value: "keamanan", label: "Keamanan & Ketertiban" },
  { value: "lainnya", label: "Lainnya" },
];

const STATUS_LABELS: Record<ComplaintStatus, string> = {
  menunggu: "Menunggu verifikasi",
  diproses: "Sedang diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

function getParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

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

async function createPengaduanAction(formData: FormData) {
  "use server";

  const namaPelapor = cleanInput(formData.get("namaPelapor"));
  const nik = cleanInput(formData.get("nik"));
  const kontak = cleanInput(formData.get("kontak"));
  const kategori = cleanInput(formData.get("kategori"));
  const isiLaporan = cleanInput(formData.get("isiLaporan"));

  if (!namaPelapor || !kategori || !isiLaporan) {
    redirect("/pengaduan?error=Lengkapi%20nama%2C%20kategori%2C%20dan%20isi%20laporan.");
  }

  if (isiLaporan.length < 20) {
    redirect("/pengaduan?error=Isi%20laporan%20minimal%2020%20karakter%20agar%20mudah%20ditindaklanjuti.");
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
    redirect("/pengaduan?error=Laporan%20belum%20berhasil%20dikirim.%20Silakan%20coba%20lagi.");
  }

  revalidatePath("/admin/pengaduan");
  redirect(`/pengaduan?terkirim=${encodeURIComponent(trackingCode)}`);
}

function statusVariant(status: string): ComplaintStatus {
  if (status === "diproses") return "diproses";
  if (status === "selesai") return "selesai";
  if (status === "ditolak") return "ditolak";
  return "menunggu";
}

function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export default async function PengaduanPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = (await searchParams) ?? {};
  const successCode = getParam(params, "terkirim");
  const errorMessage = getParam(params, "error");
  const kode = getParam(params, "kode")?.trim().toUpperCase();
  const [collectionData, trackedComplaint] = await Promise.all([
    getCollectionDataMap(["pengaturan-beranda", "identitas-desa"]),
    kode
      ? db.query.pengaduan.findFirst({
          where: eq(pengaduan.trackingCode, kode),
          columns: {
            trackingCode: true,
            kategori: true,
            status: true,
            tanggapan: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: desc(pengaduan.createdAt),
        })
      : Promise.resolve(null),
  ]);

  const pengaturanBeranda = collectionData["pengaturan-beranda"] ?? {};
  const identitasData = collectionData["identitas-desa"] ?? {};
  const bgImage = pengaturanBeranda.hero_background || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000";
  const desaName = identitasData.nama_desa || "Desa";

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6]">
      <section className="relative flex min-h-[56vh] flex-col justify-end overflow-hidden pt-24 pb-12">
        <div className="absolute inset-0 z-0">
          <img src={bgImage} alt="Pemandangan Desa" className="h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-[#FAF9F6]" />
        </div>

        <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-[#A8C5B5] backdrop-blur-md ring-1 ring-white/20">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#A8C5B5] drop-shadow">
              Layanan Aspirasi Warga
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-black leading-[1.1] tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            Pengaduan Masyarakat
            <span className="block text-[#A8C5B5]">{desaName}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/80 drop-shadow md:text-lg">
            Sampaikan laporan, aspirasi, atau keluhan dengan kode pelacakan resmi yang bisa dicek kapan saja.
          </p>

          <div className="mt-6 flex items-center gap-2 text-sm text-white/65">
            <Link href="/" className="font-medium transition-colors hover:text-white">Beranda</Link>
            <span>/</span>
            <span className="font-semibold text-white/90">Pengaduan</span>
          </div>
        </div>
      </section>

      <main className="relative z-20 bg-[#FAF9F6]">
        <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-[#FAF9F6] p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6B8E7B]/12 text-[#166534]">
                    <MessageSquareText className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-[#334155]">Buat Laporan Baru</h2>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                      Tuliskan lokasi, kronologi, dan harapan tindak lanjut dengan jelas agar perangkat desa dapat memprosesnya lebih cepat.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {successCode && (
                  <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-5">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                      <div>
                        <p className="font-bold text-green-900">Laporan berhasil dikirim.</p>
                        <p className="mt-1 text-sm text-green-800">
                          Simpan kode pelacakan ini: <span className="font-mono font-black">{successCode}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {errorMessage}
                  </div>
                )}

                <form action={createPengaduanAction} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Nama Pelapor">
                      <input name="namaPelapor" required placeholder="Nama lengkap atau Anonim" className="field-input" />
                    </Field>
                    <Field label="Kontak">
                      <input name="kontak" placeholder="No. HP atau email aktif" className="field-input" />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="NIK (Opsional)">
                      <input name="nik" inputMode="numeric" maxLength={20} placeholder="Boleh dikosongkan" className="field-input" />
                    </Field>
                    <Field label="Kategori">
                      <select name="kategori" required defaultValue="" className="field-input">
                        <option value="" disabled>Pilih kategori laporan</option>
                        {CATEGORIES.map((category) => (
                          <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Isi Laporan">
                    <textarea
                      name="isiLaporan"
                      required
                      minLength={20}
                      rows={6}
                      placeholder="Contoh: Lampu jalan di RT 02/RW 03 mati sejak Jumat malam, membuat jalan gelap dan rawan..."
                      className="field-input min-h-36 resize-y py-3"
                    />
                  </Field>

                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <div className="flex gap-3">
                      <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                      <p>Data kontak hanya dipakai perangkat desa untuk klarifikasi laporan. Kode pelacakan akan muncul setelah laporan tersimpan.</p>
                    </div>
                  </div>

                  <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#14532d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] focus-visible:ring-offset-2 sm:w-auto">
                    <Send className="h-4 w-4" />
                    Kirim Laporan
                  </button>
                </form>
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#166534] text-white">
                    <Search className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight text-[#334155]">Cek Status</h2>
                    <p className="text-sm text-slate-500">Gunakan kode pelacakan laporan.</p>
                  </div>
                </div>

                <form className="mt-5 flex gap-2" action="/pengaduan">
                  <input name="kode" defaultValue={kode ?? ""} placeholder="LAP-2026-ABC123" className="field-input h-11 flex-1 font-mono uppercase" />
                  <button type="submit" className="h-11 rounded-xl bg-[#166534] px-4 text-sm font-bold text-white hover:bg-[#14532d]">Cek</button>
                </form>

                {kode && (
                  <div className="mt-5">
                    {trackedComplaint ? (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-sm font-black text-slate-800">{trackedComplaint.trackingCode}</span>
                          <Badge variant={statusVariant(trackedComplaint.status)}>
                            {STATUS_LABELS[trackedComplaint.status as ComplaintStatus] ?? trackedComplaint.status}
                          </Badge>
                        </div>
                        <dl className="mt-4 space-y-2 text-sm">
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-500">Kategori</dt>
                            <dd className="font-semibold capitalize text-slate-800">{trackedComplaint.kategori}</dd>
                          </div>
                          <div className="flex justify-between gap-4">
                            <dt className="text-slate-500">Dikirim</dt>
                            <dd className="font-semibold text-slate-800">{formatDate(trackedComplaint.createdAt)}</dd>
                          </div>
                        </dl>
                        <div className="mt-4 rounded-lg bg-white p-3 text-sm leading-relaxed text-slate-700">
                          {trackedComplaint.tanggapan || "Belum ada tanggapan admin. Laporan sudah masuk antrean verifikasi."}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                        Kode pelacakan tidak ditemukan. Periksa kembali kode laporan Anda.
                      </div>
                    )}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-[#6B8E7B]/20 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-[#6B8E7B]">Alur Pengaduan</p>
                    <h2 className="mt-2 text-xl font-black tracking-tight text-[#334155]">Dari laporan sampai tindak lanjut</h2>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FAF9F6] text-[#166534] ring-1 ring-[#6B8E7B]/15">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                </div>

                <ol className="mt-6 space-y-0">
                  {[
                    ["Tulis laporan", "Warga mengirim lokasi, kronologi, dan kontak yang bisa dihubungi."],
                    ["Verifikasi admin", "Perangkat desa memeriksa kategori, lokasi, dan prioritas."],
                    ["Tindak lanjut", "Status dan tanggapan diperbarui agar bisa dilacak warga."],
                  ].map(([title, body], index) => (
                    <li key={title} className="relative flex gap-4 pb-5 last:pb-0">
                      {index < 2 && <span className="absolute left-[17px] top-9 h-[calc(100%-2.25rem)] w-px bg-[#6B8E7B]/18" />}
                      <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF3] text-xs font-black text-[#166534] ring-1 ring-[#6B8E7B]/15">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">
                        <span className="block text-sm font-black text-[#334155]">{title}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-slate-600">{body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  { icon: Shield, title: "Privasi terjaga", body: "Data pelapor hanya untuk klarifikasi perangkat desa." },
                  { icon: Clock, title: "Tercatat otomatis", body: "Setiap laporan memiliki kode unik." },
                  { icon: CheckCircle, title: "Bisa dipantau", body: "Status dapat dicek tanpa login." },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="rounded-xl border border-[#6B8E7B]/15 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF9F6] text-[#166534]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-black text-[#334155]">{title}</span>
                        <span className="mt-1 block text-xs leading-relaxed text-slate-500">{body}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[#334155]">{label}</span>
      {children}
    </label>
  );
}
