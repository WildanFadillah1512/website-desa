"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle, LockKeyhole, MessageSquareText, Send } from "lucide-react";
import { createPengaduanAction, type PengaduanFormState } from "./actions";

const CATEGORIES = [
  { value: "infrastruktur", label: "Infrastruktur & Lingkungan" },
  { value: "pelayanan", label: "Pelayanan Administrasi" },
  { value: "sosial", label: "Kesejahteraan & Sosial" },
  { value: "keamanan", label: "Keamanan & Ketertiban" },
  { value: "lainnya", label: "Lainnya" },
];

const initialState: PengaduanFormState = {
  error: null,
  trackingCode: null,
};

export function ComplaintForm() {
  const [state, formAction, isPending] = useActionState(createPengaduanAction, initialState);
  const [locked, setLocked] = useState(false);
  const submitLockedRef = useRef(false);

  useEffect(() => {
    if (state.error) {
      submitLockedRef.current = false;
      setLocked(false);
    }
  }, [state.error]);

  if (state.trackingCode) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-green-700 shadow-sm">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl font-black tracking-tight text-green-950">Laporan berhasil dikirim</h3>
              <p className="mt-1 text-sm leading-relaxed text-green-800">
                Simpan kode ini untuk mengecek status laporan Anda.
              </p>
              <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs font-bold text-slate-500">Kode Pelacakan</p>
                <p className="mt-1 break-all font-mono text-2xl font-black tracking-tight text-[#166534]">
                  {state.trackingCode}
                </p>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/pengaduan?kode=${encodeURIComponent(state.trackingCode)}`}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#166534] px-5 text-sm font-bold text-white hover:bg-[#14532d]"
                >
                  Cek Status Sekarang
                </Link>
                <button
                  type="button"
                  onClick={() => window.location.assign("/pengaduan")}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[#6B8E7B]/30 bg-white px-5 text-sm font-bold text-[#166534] hover:bg-[#FAF9F6]"
                >
                  Buat Laporan Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const disabled = isPending || locked;

  return (
    <div className="p-6">
      {state.error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{state.error}</p>
          </div>
        </div>
      )}

      <form
        action={formAction}
        onSubmit={(event) => {
          if (disabled || submitLockedRef.current) {
            event.preventDefault();
            return;
          }
          submitLockedRef.current = true;
          setLocked(true);
        }}
        className="space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama Pelapor">
            <input name="namaPelapor" required placeholder="Nama lengkap atau Anonim" className="field-input" />
          </Field>
          <Field label="Kontak">
            <input name="kontak" required placeholder="No. HP atau email aktif" className="field-input" />
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

        <button
          type="submit"
          disabled={disabled}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#166534] px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#14532d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#166534] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#6B8E7B] disabled:opacity-80 sm:w-auto"
        >
          {disabled ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
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
  );
}

export function ComplaintFormHeader() {
  return (
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
