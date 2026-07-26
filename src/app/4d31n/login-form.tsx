"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lock, User, AlertCircle } from "lucide-react";

const initialState = {
  error: null as string | null,
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="rounded-2xl border border-white/25 bg-white p-6 shadow-2xl sm:p-8">
      <div className="mb-7">
        <h2 className="text-2xl font-black tracking-tight text-[#334155]">Masuk Admin</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Verifikasi akun untuk melanjutkan.</p>
      </div>

      {state?.error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-rose-700">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="admin-username" className="text-sm font-bold text-[#334155]">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#94A3B8]" />
            </div>
            <Input 
              id="admin-username"
              name="username" 
              type="text" 
              required
              autoComplete="username"
              placeholder="Masukkan username Anda"
              className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 text-base font-semibold text-[#334155] shadow-sm focus-visible:border-[#6B8E7B] focus-visible:ring-[#6B8E7B]/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="admin-password" className="text-sm font-bold text-[#334155]">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#94A3B8]" />
            </div>
            <Input 
              id="admin-password"
              name="password" 
              type="password" 
              required
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 text-base font-semibold text-[#334155] shadow-sm focus-visible:border-[#6B8E7B] focus-visible:ring-[#6B8E7B]/20"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#166534] text-base font-bold text-white shadow-md transition-all hover:bg-[#14532d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? 'Memproses...' : 'Masuk Sekarang'}
          {!isPending && <ArrowRight className="w-5 h-5" />}
        </Button>
      </form>
    </div>
  );
}
