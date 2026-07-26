"use client";

import { useState } from "react";
import {
  HeartHandshake, CheckCircle, AlertCircle, Search,
  ArrowRight, Send, Shield, Clock, Users, ChevronRight,
} from "lucide-react";
import SectionHero from "@/components/ui/section-hero";

/* ── Step indicator ─────────────────────────────── */
const STEPS = [
  { n: 1, label: "Tulis Laporan",    desc: "Isi detail pengaduan Anda" },
  { n: 2, label: "Verifikasi",       desc: "Admin desa menverifikasi" },
  { n: 3, label: "Tindak Lanjut",    desc: "Laporan diselesaikan" },
];

/* ── Category options ───────────────────────────── */
const CATEGORIES = [
  { value: "infrastruktur", label: "🏗️ Infrastruktur & Lingkungan" },
  { value: "pelayanan",     label: "📋 Pelayanan Administrasi" },
  { value: "sosial",        label: "🤝 Kesejahteraan & Sosial" },
  { value: "keamanan",      label: "🛡️ Keamanan & Ketertiban" },
  { value: "lainnya",       label: "📌 Lainnya" },
];

export default function PengaduanPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [status, setStatus] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate
    setIsLoading(false);
    setSubmitted(true);
  }

  async function handleCheckStatus(e: React.FormEvent) {
    e.preventDefault();
    if (trackingCode.length > 5) {
      setStatus({
        status: "diproses",
        kode: trackingCode,
        tanggapan: "Laporan Anda sedang didisposisikan ke perangkat desa terkait.",
      });
    } else {
      setStatus({ error: "Kode resi tidak ditemukan. Periksa kembali kode Anda." });
    }
  }

  return (
    <>
      <SectionHero
        icon={HeartHandshake}
        eyebrow="Layanan Aspirasi"
        title="Lapor & Pengaduan"
        description="Sampaikan keluhan, aspirasi, dan pengaduan secara langsung kepada pemerintah desa. Anonim tersedia."
        breadcrumbs={[{ label: "Beranda", href: "/" }, { label: "Pengaduan" }]}
      />

      <div className="bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {[
              { icon: Shield,       label: "Anonim Tersedia",     desc: "Identitas bisa disembunyikan" },
              { icon: Clock,        label: "Respons Cepat",       desc: "Ditindaklanjuti dalam 3-7 hari" },
              { icon: CheckCircle,  label: "Transparan",          desc: "Pantau status laporan real-time" },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="h-9 w-9 rounded-xl bg-[#166534]/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-[#166534]" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

            {/* ── Form (3/5) ──────────────────────────── */}
            <div className="lg:col-span-3">
              {!submitted ? (
                <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/60">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Buat Laporan Baru</h2>
                    <p className="text-slate-500 text-sm mt-1">Identitas Anda dapat disembunyikan (Anonim).</p>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Nama */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                        Nama Pelapor
                      </label>
                      <input
                        type="text"
                        placeholder="Nama Lengkap atau tulis 'Anonim'"
                        required
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                      />
                    </div>

                    {/* No HP + Kategori */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                          No. HP (WhatsApp)
                        </label>
                        <input
                          type="tel"
                          placeholder="08xxx"
                          className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                          Kategori
                        </label>
                        <select
                          required
                          className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                        >
                          <option value="">Pilih Kategori...</option>
                          {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Isi Laporan */}
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                        Isi Laporan / Pengaduan
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Ceritakan secara detail — lokasi, waktu, kronologi, dan harapan Anda..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all resize-none"
                      />
                    </div>

                    {/* Alert */}
                    <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-800 text-xs">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                      <p>Setelah mengirim, Anda akan mendapatkan <strong>Kode Resi Pelacakan</strong>. Simpan kode tersebut untuk memantau status laporan.</p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl bg-[#166534] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#14532d] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Kirim Laporan
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* Success state */
                <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-10 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="h-9 w-9 text-[#166534]" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Laporan Terkirim!</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                    Terima kasih telah menyampaikan laporan. Pemerintah desa akan segera menindaklanjuti.
                  </p>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6 text-center">
                    <p className="text-xs text-slate-400 mb-1">Kode Resi Anda</p>
                    <p className="text-2xl font-black text-[#166534] tracking-widest font-mono">
                      LAP-{new Date().getFullYear()}-{Math.random().toString(36).substring(2, 7).toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Simpan kode ini untuk memantau status laporan</p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-bold text-[#166534] hover:text-[#14532d] transition-colors"
                  >
                    Buat Laporan Baru
                  </button>
                </div>
              )}

              {/* ── Track Status ──────────────────────── */}
              <div className="mt-6 bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/60">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Cek Status Laporan</h2>
                  <p className="text-slate-500 text-sm mt-1">Masukkan kode resi untuk melihat tindak lanjut.</p>
                </div>
                <form onSubmit={handleCheckStatus} className="p-6">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value)}
                        placeholder="Contoh: LAP-2026-X8F9Q"
                        required
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/15 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="h-11 px-5 rounded-xl bg-[#166534] text-white font-bold text-sm hover:bg-[#14532d] transition-colors"
                    >
                      Cek
                    </button>
                  </div>

                  {status && (
                    <div className="mt-5 animate-fade-in">
                      {status.error ? (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                          <AlertCircle className="h-5 w-5 shrink-0" />
                          {status.error}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-slate-900">Status Laporan</span>
                            <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-extrabold uppercase tracking-widest">
                              {status.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{status.tanggapan}</p>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* ── Sidebar (2/5) ─────────────────────── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Alur Pengaduan */}
              <div className="bg-[#0B1E12] rounded-2xl p-6 relative overflow-hidden">
                <div aria-hidden className="absolute inset-0 opacity-[0.05]"
                  style={{ backgroundImage: `radial-gradient(circle at 1px 1px, #4ade80 1px, transparent 0)`, backgroundSize: "24px 24px" }} />
                <div className="relative z-10">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#4ade80] mb-3">
                    Alur Pengaduan
                  </p>
                  <h3 className="text-lg font-black text-white mb-6">Bagaimana Prosesnya?</h3>
                  <ol className="space-y-5">
                    {STEPS.map((step, i) => (
                      <li key={step.n} className="flex items-start gap-4">
                        <div className="h-8 w-8 rounded-xl bg-[#166534]/40 border border-[#4ade80]/20 flex items-center justify-center text-[#4ade80] font-black text-xs shrink-0">
                          {step.n}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{step.label}</p>
                          <p className="text-xs text-white/40 mt-0.5">{step.desc}</p>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className="absolute ml-[15px] mt-[2.5rem] h-5 w-px bg-[#4ade80]/10" />
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Jam Pelayanan</p>
                <div className="space-y-2">
                  {[
                    { hari: "Senin – Jumat",  jam: "08:00 – 15:00 WIB",  aktif: true },
                    { hari: "Sabtu",          jam: "08:00 – 12:00 WIB",  aktif: false },
                    { hari: "Minggu",         jam: "Tutup",               aktif: false },
                  ].map(({ hari, jam, aktif }) => (
                    <div key={hari} className={`flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-0 ${aktif ? "text-slate-900" : "text-slate-400"}`}>
                      <span className="font-medium">{hari}</span>
                      <span className={`font-bold ${aktif ? "text-[#166534]" : ""}`}>{jam}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
