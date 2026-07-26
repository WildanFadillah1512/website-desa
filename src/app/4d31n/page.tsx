import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { getCollectionData } from "@/lib/cms";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const pengaturanBeranda = await getCollectionData("pengaturan-beranda");
  const bgImage = pengaturanBeranda.hero_background || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000";

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image - Same as Homepage Hero */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Latar Belakang Desa"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        
        {/* Logo / Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-white text-[#166534] shadow-xl text-2xl font-black mb-4">
              DC
            </div>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2 drop-shadow-md tracking-tight">Portal Admin Desa</h1>
          <p className="text-white/80 font-medium">Masuk untuk mengelola sistem informasi</p>
        </div>

        {/* Form Container */}
        <LoginForm />
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm font-medium">
            &copy; {new Date().getFullYear()} Pemerintah Desa. Sistem Tertutup.
          </p>
        </div>

      </div>
    </div>
  );
}
