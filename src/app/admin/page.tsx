import { FileText, Users, MessageSquare, ArrowUpRight, Plus, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">Dasbor Utama</h1>
          <p className="text-slate-500 mt-1">Ikhtisar aktivitas dan data website Desa Cikahuripan.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button  size="lg" className="shadow-sm">
            <Link href="/admin/berita/new">
              <Plus className="mr-2 h-4 w-4" />
              Tulis Berita
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-4">
              <h3 className="tracking-tight text-sm font-semibold text-slate-500 uppercase">Total Berita</h3>
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-[#0f172a]">24</div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                +2 bulan ini
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow ring-1 ring-amber-500/20 shadow-amber-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-4">
              <h3 className="tracking-tight text-sm font-semibold text-slate-500 uppercase">Pengaduan Baru</h3>
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-amber-600">5</div>
              <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Perlu ditindaklanjuti
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-4">
              <h3 className="tracking-tight text-sm font-semibold text-slate-500 uppercase">Pengunjung Harian</h3>
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-[#0f172a]">142</div>
              <span className="text-xs font-medium text-slate-500">
                Hari ini
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-4">
              <h3 className="tracking-tight text-sm font-semibold text-slate-500 uppercase">Aparatur Desa</h3>
              <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-[#0f172a]">12</div>
              <span className="text-xs font-medium text-slate-500">
                Akun aktif
              </span>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ── Recent Activity ──────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pengaduan Terbaru</CardTitle>
                <CardDescription className="mt-1">Laporan dari warga yang masuk.</CardDescription>
              </div>
              <Button variant="ghost" size="sm"  className="text-[#166534]">
                <Link href="/admin/pengaduan">Lihat Semua</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-slate-100">
              <div className="flex items-start justify-between p-5 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-semibold text-[#0f172a] mb-1">Lampu Jalan Mati di RW 03</p>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span>Oleh: Budi Santoso</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>2 jam yang lalu</span>
                  </p>
                </div>
                <Badge variant="menunggu">Menunggu</Badge>
              </div>
              <div className="flex items-start justify-between p-5 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-semibold text-[#0f172a] mb-1">Jalan Berlubang Depan Balai Desa</p>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <span>Oleh: Siti Aminah</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>1 hari yang lalu</span>
                  </p>
                </div>
                <Badge variant="selesai">Selesai</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="border-b border-slate-100 pb-4 bg-slate-50/50 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Berita Terakhir</CardTitle>
                <CardDescription className="mt-1">Artikel yang baru saja dipublikasikan.</CardDescription>
              </div>
              <Button variant="ghost" size="sm"  className="text-[#166534]">
                <Link href="/admin/berita">Lihat Semua</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-slate-100">
              <div className="flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors">
                <div className="w-16 h-12 rounded-lg bg-slate-200 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0f172a] mb-1 truncate">Rapat Koordinasi Perangkat Desa Bulan Juli</p>
                  <p className="text-sm text-slate-500">Dipublikasikan: 24 Jul 2026</p>
                </div>
                <Badge variant="published">Published</Badge>
              </div>
              <div className="flex items-start gap-4 p-5 hover:bg-slate-50 transition-colors">
                <div className="w-16 h-12 rounded-lg bg-slate-200 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#0f172a] mb-1 truncate">Penyaluran BLT Dana Desa Tahap III</p>
                  <p className="text-sm text-slate-500">Dipublikasikan: 20 Jul 2026</p>
                </div>
                <Badge variant="published">Published</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
