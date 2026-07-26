import { desc } from "drizzle-orm";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Inbox,
  MessageSquareText,
  RefreshCw,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { pengaduan } from "@/db/schema";
import { StatusFilter } from "./status-filter";

export const dynamic = "force-dynamic";

type SearchParams = Record<string, string | string[] | undefined>;
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

function getParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function normalizeStatus(value: string | undefined): ComplaintStatus | "semua" {
  if (value === "menunggu" || value === "diproses" || value === "selesai" || value === "ditolak") {
    return value;
  }
  return "semua";
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

export default async function PengaduanAdminPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = (await searchParams) ?? {};
  const activeStatus = normalizeStatus(getParam(params, "status"));
  const allRowsForStats = await db.query.pengaduan.findMany({
    orderBy: desc(pengaduan.createdAt),
    limit: 500,
  });
  const rows = (activeStatus === "semua"
    ? allRowsForStats
    : allRowsForStats.filter((item) => item.status === activeStatus)
  ).slice(0, 80);

  const counts = {
    semua: allRowsForStats.length,
    menunggu: allRowsForStats.filter((item) => item.status === "menunggu").length,
    diproses: allRowsForStats.filter((item) => item.status === "diproses").length,
    selesai: allRowsForStats.filter((item) => item.status === "selesai").length,
    ditolak: allRowsForStats.filter((item) => item.status === "ditolak").length,
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-[#ECFDF3] px-3 py-1 text-xs font-bold text-[#166534]">
            <MessageSquareText className="h-3.5 w-3.5" />
            Kanal warga
          </div>
          <h1 className="text-2xl font-black tracking-tight text-[#334155] sm:text-3xl">Pengaduan Masyarakat</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Kelola laporan warga, ubah status, dan kirim tanggapan yang dapat dilacak melalui kode laporan.
          </p>
        </div>
        <Button asChild variant="outline" className="h-10 rounded-xl bg-white">
          <Link href="/pengaduan" target="_blank">
            <ExternalLink className="h-4 w-4" />
            Lihat Halaman Warga
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Laporan" value={counts.semua} icon={Inbox} active={activeStatus === "semua"} href="/admin/pengaduan" />
        {STATUSES.map(({ value, label, icon }) => (
          <StatCard
            key={value}
            label={label}
            value={counts[value]}
            icon={icon}
            active={activeStatus === value}
            href={`/admin/pengaduan?status=${value}`}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-black tracking-tight text-[#334155]">Daftar Laporan</h2>
            <p className="text-sm text-slate-500">
              Menampilkan {rows.length} laporan {activeStatus === "semua" ? "terbaru" : `berstatus ${STATUS_LABELS[activeStatus]}`}.
            </p>
          </div>
          <StatusFilter value={activeStatus} />
        </div>

        <div className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Inbox className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-900">Belum ada laporan</h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">Laporan warga akan muncul di sini setelah dikirim dari halaman pengaduan.</p>
            </div>
          ) : (
            rows.map((item) => (
              <Link
                key={item.id}
                href={`/admin/pengaduan/${item.id}`}
                className="group block p-5 transition-colors hover:bg-[#FAF9F6]"
              >
                <article className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant(item.status)}>{STATUS_LABELS[item.status as ComplaintStatus] ?? item.status}</Badge>
                    <span className="font-mono text-xs font-black text-slate-500">{item.trackingCode}</span>
                    <span className="text-xs font-medium text-slate-400">{formatDate(item.createdAt)}</span>
                  </div>

                  <h3 className="mt-3 text-lg font-black tracking-tight text-[#334155]">
                    {item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1)}
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{item.isiLaporan}</p>

                  <dl className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-3">
                    <InfoItem label="Pelapor" value={item.namaPelapor} />
                    <InfoItem label="Kontak" value={item.kontak || "-"} />
                    <InfoItem label="NIK" value={item.nik || "-"} />
                  </dl>
                  </div>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-[#166534] lg:justify-self-end">
                    Detail & tindakan
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  active,
  href,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  active: boolean;
  href: string;
}) {
  return (
    <Link href={href} className="group block">
      <div className={`rounded-2xl border bg-white p-5 shadow-sm transition-colors ${active ? "border-[#6B8E7B] ring-2 ring-[#6B8E7B]/10" : "border-slate-200 hover:border-[#6B8E7B]/40"}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-slate-500">{label}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF3] text-[#166534]">
            <Icon className="h-5 w-5" />
          </span>
        </div>
        <p className="mt-4 text-3xl font-black tracking-tight text-[#334155]">{value}</p>
      </div>
    </Link>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold text-slate-400">{label}</dt>
      <dd className="mt-0.5 truncate font-semibold text-slate-800">{value}</dd>
    </div>
  );
}
