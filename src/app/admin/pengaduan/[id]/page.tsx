import { eq } from "drizzle-orm";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Contact,
  Hash,
  RefreshCw,
  Save,
  ShieldAlert,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import { pengaduan } from "@/db/schema";
import { updatePengaduanAction } from "../actions";

export const dynamic = "force-dynamic";

type ComplaintStatus = "menunggu" | "diproses" | "selesai" | "ditolak";

const STATUSES: { value: ComplaintStatus; label: string; icon: LucideIcon }[] = [
  { value: "menunggu", label: "Menunggu", icon: Clock3 },
  { value: "diproses", label: "Diproses", icon: RefreshCw },
  { value: "selesai", label: "Selesai", icon: CheckCircle2 },
  { value: "ditolak", label: "Ditolak", icon: ShieldAlert },
];

const STATUS_LABELS: Record<ComplaintStatus, string> = {
  menunggu: "Menunggu",
  diproses: "Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
};

function statusVariant(status: string): ComplaintStatus {
  if (status === "diproses") return "diproses";
  if (status === "selesai") return "selesai";
  if (status === "ditolak") return "ditolak";
  return "menunggu";
}

function formatDate(date: Date | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export default async function PengaduanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const complaintId = Number(id);

  if (!complaintId) notFound();

  const item = await db.query.pengaduan.findFirst({
    where: eq(pengaduan.id, complaintId),
  });

  if (!item) notFound();

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button asChild variant="ghost" className="mb-3 h-9 rounded-xl px-0 text-[#166534] hover:bg-transparent hover:text-[#14532d]">
            <Link href="/admin/pengaduan">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke daftar
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant(item.status)}>{STATUS_LABELS[item.status as ComplaintStatus] ?? item.status}</Badge>
            <span className="font-mono text-xs font-black text-slate-500">{item.trackingCode}</span>
          </div>
          <h1 className="mt-3 text-2xl font-black tracking-tight text-[#334155] sm:text-3xl">
            Detail Pengaduan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Periksa isi laporan, data pelapor, lalu pilih tindak lanjut yang sesuai.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="space-y-6">
          <Card className="overflow-hidden rounded-2xl">
            <div className="border-b border-slate-100 bg-[#FAF9F6] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">Kategori</p>
                  <h2 className="mt-1 text-2xl font-black capitalize tracking-tight text-[#334155]">{item.kategori}</h2>
                </div>
                <div className="rounded-xl bg-white px-4 py-3 text-right shadow-sm">
                  <p className="text-xs font-bold text-slate-400">Dikirim</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="rounded-2xl bg-white p-0">
                <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">{item.isiLaporan}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard icon={User} label="Pelapor" value={item.namaPelapor} />
            <InfoCard icon={Contact} label="Kontak" value={item.kontak || "-"} />
            <InfoCard icon={Hash} label="NIK" value={item.nik || "-"} />
          </div>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-[#166534]" />
                <div>
                  <h3 className="font-black text-[#334155]">Riwayat pembaruan</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Terakhir diperbarui pada {formatDate(item.updatedAt)}.
                  </p>
                  <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                    {item.tanggapan || "Belum ada tanggapan admin untuk laporan ini."}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <aside>
          <Card className="sticky top-24 rounded-2xl">
            <div className="border-b border-slate-100 bg-slate-50/70 p-5">
              <h2 className="text-lg font-black tracking-tight text-[#334155]">Aksi Admin</h2>
              <p className="mt-1 text-sm text-slate-500">Status dan tanggapan akan terlihat saat warga mengecek kode laporan.</p>
            </div>
            <CardContent className="p-5">
              <form action={updatePengaduanAction} className="space-y-5">
                <input type="hidden" name="id" value={item.id} />

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#334155]">Status</label>
                  <select
                    name="status"
                    defaultValue={item.status}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#6B8E7B] focus:ring-2 focus:ring-[#6B8E7B]/20"
                  >
                    {STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#334155]">Tanggapan Admin</label>
                  <textarea
                    name="tanggapan"
                    defaultValue={item.tanggapan || ""}
                    rows={7}
                    placeholder="Tulis tindak lanjut, disposisi, atau catatan untuk warga..."
                    className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-relaxed text-slate-800 outline-none focus:border-[#6B8E7B] focus:ring-2 focus:ring-[#6B8E7B]/20"
                  />
                </div>

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">
                  <input name="isPublic" type="checkbox" defaultChecked={item.isPublic} className="h-4 w-4 accent-[#166534]" />
                  Tampilkan anonim di publik
                </label>

                <Button type="submit" className="h-11 w-full rounded-xl bg-[#6B8E7B] hover:bg-[#557162]">
                  <Save className="h-4 w-4" />
                  Simpan Tindakan
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF3] text-[#166534]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-xs font-bold text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-[#334155]">{value}</p>
    </div>
  );
}
