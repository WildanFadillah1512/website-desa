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
    <div className="rounded-2xl bg-[rgba(10,28,18,0.50)] p-6 shadow-2xl shadow-black/30 ring-1 ring-white/18 backdrop-blur-2xl sm:p-8">
      <div className="mb-7">
        <h2 className="text-2xl font-black tracking-tight text-white">Masuk Admin</h2>
        <p className="mt-1 text-sm font-semibold text-[#D6E7DC]">Verifikasi akun untuk melanjutkan.</p>
      </div>

      {state?.error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-rose-50/95 p-4 shadow-sm ring-1 ring-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-rose-800">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="admin-username" className="text-sm font-bold text-white">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#6B8E7B]" />
            </div>
            <Input 
              id="admin-username"
              name="username" 
              type="text" 
              required
              autoComplete="username"
              placeholder="Masukkan username Anda"
              className="h-12 rounded-xl border-white/25 bg-white/92 pl-11 text-base font-semibold text-[#17211B] shadow-sm shadow-black/10 placeholder:text-slate-500 focus-visible:border-white focus-visible:ring-white/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="admin-password" className="text-sm font-bold text-white">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#6B8E7B]" />
            </div>
            <Input 
              id="admin-password"
              name="password" 
              type="password" 
              required
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              className="h-12 rounded-xl border-white/25 bg-white/92 pl-11 text-base font-semibold text-[#17211B] shadow-sm shadow-black/10 placeholder:text-slate-500 focus-visible:border-white focus-visible:ring-white/30"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#166534] text-base font-bold text-white shadow-lg shadow-black/20 ring-1 ring-white/10 transition-all hover:bg-[#14532d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? 'Memproses...' : 'Masuk Sekarang'}
          {!isPending && <ArrowRight className="w-5 h-5" />}
        </Button>
      </form>
    </div>
  );
}
