import {
  CheckCircle,
  Clock,
  HeartHandshake,
  Search,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { pengaduan } from "@/db/schema";
import { getCollectionDataMap } from "@/lib/cms";
import { ComplaintForm, ComplaintFormHeader } from "./complaint-form";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;
type ComplaintStatus = "menunggu" | "diproses" | "selesai" | "ditolak";

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
              <ComplaintFormHeader />
              <ComplaintForm />
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
