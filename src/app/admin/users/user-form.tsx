"use client";

import { useActionState } from "react";
import { saveUserAction } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Lock, Save, AlertCircle, Briefcase, ShieldCheck } from "lucide-react";
import Link from "next/link";

const initialState = {
  error: null as string | null,
};

export default function UserForm({ initialData }: { initialData?: any }) {
  const [state, formAction, isPending] = useActionState(saveUserAction, initialState);
  const isEditing = !!initialData;

  return (
    <Card className="animate-fade-in-up border border-[#6B8E7B]/10 shadow-sm rounded-2xl overflow-hidden bg-white max-w-3xl">
      <CardHeader className="border-b border-[#6B8E7B]/10 bg-gradient-to-r from-[#FAF9F6] to-white py-5 px-6">
        <CardTitle className="flex items-center gap-3 text-lg font-black text-[#334155]">
          <div className="h-10 w-10 rounded-xl bg-white border border-[#6B8E7B]/20 shadow-sm flex items-center justify-center">
            {isEditing ? <User className="h-5 w-5 text-[#6B8E7B]" /> : <User className="h-5 w-5 text-[#6B8E7B]" />}
          </div>
          {isEditing ? "Edit Akun Aparatur" : "Tambah Akun Aparatur"}
        </CardTitle>
        <CardDescription className="text-[#64748B] font-medium ml-13">
          {isEditing ? "Perbarui informasi akun akses sistem." : "Buat akun baru untuk memberikan akses ke sistem."}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 md:p-8">
        {state?.error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-rose-700">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {isEditing && <input type="hidden" name="userId" value={initialData.id} />}

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#334155]">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <Input 
                  name="name" 
                  defaultValue={initialData?.name} 
                  required 
                  placeholder="Misal: Budi Santoso"
                  className="pl-10 h-11 border-slate-200 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] rounded-xl shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#334155]">Role / Jabatan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <select 
                  name="role"
                  defaultValue={initialData?.role || "admin"}
                  className="pl-10 flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] transition-all appearance-none" 
                  required
                >
                  <option value="admin">Administrator / Kepala Desa</option>
                  <option value="aparatur">Aparatur / Perangkat Desa</option>
                  <option value="operator">Operator Layanan</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 bg-[#FAF9F6] p-6 rounded-2xl border border-[#6B8E7B]/10">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#334155]">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <ShieldCheck className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <Input 
                  name="username" 
                  defaultValue={initialData?.username} 
                  required 
                  placeholder="Untuk login (tanpa spasi)"
                  className="pl-10 h-11 border-slate-200 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] rounded-xl shadow-sm font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#334155]">Password {isEditing && "(Opsional)"}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <Input 
                  name="password" 
                  type="password" 
                  required={!isEditing}
                  placeholder={isEditing ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"}
                  className="pl-10 h-11 border-slate-200 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] rounded-xl shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#6B8E7B]/10">
            <Button type="button" variant="ghost" asChild className="h-11 rounded-xl text-[#64748B] hover:text-[#334155] hover:bg-slate-100">
              <Link href="/admin/users">Batal</Link>
            </Button>
            <Button type="submit" disabled={isPending} className="bg-[#6B8E7B] hover:bg-[#557162] shadow-sm rounded-xl h-11 px-6">
              <Save className="mr-2 h-4 w-4" />
              {isPending ? 'Menyimpan...' : 'Simpan Akun'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
