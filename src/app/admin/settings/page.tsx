export const dynamic = 'force-dynamic';

import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { User, Shield, LogOut, KeyRound } from "lucide-react";
import Link from "next/link";

export default async function SettingsAdminPage() {
  const session = await getSession();
  if (!session) redirect("/");
  
  const user = session.user;

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#334155]">Pengaturan Akun</h1>
        <p className="text-[#64748B] font-medium mt-1">Kelola informasi profil, keamanan, dan sesi aktif Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Kolom Kiri - Profil Aktif */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-b from-[#ECFDF3] to-white pb-4 text-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold text-2xl shadow-md border-4 border-white mb-3 mt-2">
                {(user.name || "Admin").substring(0, 2).toUpperCase()}
              </div>
              <CardTitle className="text-xl font-bold text-[#17211B]">{user.name || "Administrator"}</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-[#166534] mt-1">
                {user.role || "admin"}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 py-4 border-t border-slate-100">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Username</span>
                  <span className="font-semibold text-slate-800">@{user.username || "admin"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="inline-flex items-center gap-1.5 py-0.5 px-2 rounded-md bg-green-50 text-green-700 text-xs font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> Aktif
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-center">
              <Button asChild variant="destructive" className="w-full rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-0 shadow-none font-bold">
                <Link href="/auth/logout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Keluar dari Sistem
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Kolom Kanan - Form Pengaturan */}
        <div className="md:col-span-2 space-y-6">
          
          <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Informasi Dasar</CardTitle>
                  <CardDescription>Ubah nama dan informasi profil publik Anda.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium leading-none text-slate-700">Nama Lengkap</label>
                <Input id="name" defaultValue={user.name || "Administrator"} className="rounded-xl border-slate-200 focus-visible:ring-[#166534]" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="username" className="text-sm font-medium leading-none text-slate-700">Username</label>
                <Input id="username" defaultValue={user.username || "admin"} disabled className="rounded-xl border-slate-200 bg-slate-50 text-slate-500" />
                <p className="text-[11px] text-slate-400">Username digunakan untuk login dan tidak dapat diubah.</p>
              </div>
              <Button className="rounded-xl bg-[#17211B] hover:bg-[#166534] text-white">Simpan Perubahan</Button>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm rounded-2xl bg-white">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Keamanan Kata Sandi</CardTitle>
                  <CardDescription>Perbarui kata sandi untuk menjaga keamanan akun Anda.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="current_password" className="text-sm font-medium leading-none text-slate-700">Kata Sandi Saat Ini</label>
                <Input id="current_password" type="password" className="rounded-xl border-slate-200 focus-visible:ring-[#166534]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="new_password" className="text-sm font-medium leading-none text-slate-700">Kata Sandi Baru</label>
                  <Input id="new_password" type="password" className="rounded-xl border-slate-200 focus-visible:ring-[#166534]" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="confirm_password" className="text-sm font-medium leading-none text-slate-700">Ulangi Kata Sandi Baru</label>
                  <Input id="confirm_password" type="password" className="rounded-xl border-slate-200 focus-visible:ring-[#166534]" />
                </div>
              </div>
              <Button className="rounded-xl bg-[#17211B] hover:bg-[#166534] text-white">Perbarui Kata Sandi</Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
