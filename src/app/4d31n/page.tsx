import Link from "next/link";
import { LoginForm } from "./login-form";
import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { getCollectionDataMap } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const collectionData = await getCollectionDataMap(["pengaturan-beranda", "identitas-desa"]);
  const pengaturanBeranda = collectionData["pengaturan-beranda"] ?? {};
  const identitasData = collectionData["identitas-desa"] ?? {};
  const bgImage = pengaturanBeranda.hero_background || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000";
  const logo = pengaturanBeranda.logo || "";
  const desaName = identitasData.nama_desa || "Desa";
  const kecamatan = identitasData.kecamatan || "";
  const kabupaten = identitasData.kabupaten || "";

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0B1E12] px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Latar Belakang Desa"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,11,0.92)_0%,rgba(5,18,11,0.74)_46%,rgba(5,18,11,0.56)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.40)_0%,rgba(0,0,0,0.18)_48%,rgba(0,0,0,0.52)_100%)] backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-6xl flex-col">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Website
          </Link>
          <span className="hidden rounded-full bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-[#D6E7DC] ring-1 ring-white/15 backdrop-blur-md sm:inline-flex">
            Sistem Tertutup
          </span>
        </div>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_460px] lg:py-14">
          <div className="max-w-2xl animate-fade-in-up">
            <Link href="/" className="mb-8 inline-flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-xl ring-1 ring-white/20">
                {logo ? (
                  <img src={logo} alt={`Logo ${desaName}`} className="h-full w-full object-contain" />
                ) : (
                  <ShieldCheck className="h-9 w-9 text-[#166534]" />
                )}
              </span>
              <span>
                <span className="block text-xl font-black leading-tight text-white">{desaName}</span>
                <span className="block text-xs font-extrabold uppercase tracking-widest text-[#D6E7DC]">
                  {kecamatan || kabupaten ? `${kecamatan}${kecamatan && kabupaten ? ", " : ""}${kabupaten}` : "Portal Desa"}
                </span>
              </span>
            </Link>

            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-2 text-xs font-extrabold uppercase tracking-widest text-[#D6E7DC] ring-1 ring-white/15 backdrop-blur-md">
              <LockKeyhole className="h-3.5 w-3.5" />
              Akses Aparatur Desa
            </p>
            <h1 className="hero-readable-title max-w-2xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Portal Admin Sistem Informasi Desa
            </h1>
            <p className="hero-readable-copy mt-5 max-w-xl text-base font-semibold leading-relaxed md:text-lg">
              Kelola berita, pengaduan warga, data halaman, dan konten website resmi dari satu panel yang aman.
            </p>
          </div>

          <div className="animate-fade-in-up lg:justify-self-end">
            <div className="mb-5 rounded-2xl bg-white/10 px-5 py-4 text-sm font-semibold leading-relaxed text-white/85 ring-1 ring-white/15 backdrop-blur-md">
              Gunakan akun admin yang sudah dibuat. Setelah masuk, Anda akan diarahkan ke panel pengelolaan.
            </div>
            <LoginForm />
          </div>
        </section>

        <div className="relative z-10 pb-2 text-center text-xs font-semibold text-white/55 sm:text-left">
          &copy; {new Date().getFullYear()} Pemerintah {desaName}. Sistem Tertutup.
        </div>
      </div>
    </main>
  );
}
