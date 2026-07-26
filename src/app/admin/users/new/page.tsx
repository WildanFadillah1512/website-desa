import UserForm from "../user-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/users" className="inline-flex items-center text-sm font-semibold text-[#64748B] hover:text-[#334155] mb-4 group transition-colors">
          <ArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Akun
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#334155]">Tambah Aparatur Baru</h1>
      </div>
      
      <UserForm />
    </div>
  );
}
