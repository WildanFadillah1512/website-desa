import UserForm from "../../user-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) redirect("/admin/users");

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) redirect("/admin/users");

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/users" className="inline-flex items-center text-sm font-semibold text-[#64748B] hover:text-[#334155] mb-4 group transition-colors">
          <ArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Akun
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#334155]">Edit Akun: {user.name}</h1>
      </div>
      
      <UserForm initialData={user} />
    </div>
  );
}
