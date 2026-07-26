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
    <div className="bg-white/95 backdrop-blur-md rounded-[2rem] p-8 shadow-2xl border border-white/20">
      {state?.error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-rose-700">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#334155] ml-1">Username</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-[#94A3B8]" />
            </div>
            <Input 
              name="username" 
              type="text" 
              required
              placeholder="Masukkan username Anda"
              className="pl-11 h-12 bg-white/50 border-slate-200 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] rounded-xl shadow-sm text-base font-medium"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#334155] ml-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#94A3B8]" />
            </div>
            <Input 
              name="password" 
              type="password" 
              required
              placeholder="Masukkan kata sandi"
              className="pl-11 h-12 bg-white/50 border-slate-200 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] rounded-xl shadow-sm text-base font-medium"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full h-12 bg-[#6B8E7B] hover:bg-[#557162] text-white shadow-md rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
        >
          {isPending ? 'Memproses...' : 'Masuk Sekarang'}
          {!isPending && <ArrowRight className="w-5 h-5" />}
        </Button>
      </form>
    </div>
  );
}
