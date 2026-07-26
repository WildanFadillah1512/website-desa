import { db } from "@/db";
import { users } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Users as UsersIcon, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteUserAction } from "./actions";

export default async function UsersPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

  return (
    <div className="space-y-6">
      
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#334155]">Aparatur Desa</h1>
          <p className="text-[#64748B] font-medium mt-1">Kelola akun akses sistem untuk perangkat dan aparatur desa.</p>
        </div>
        <Button className="bg-[#6B8E7B] hover:bg-[#557162] text-white shadow-sm rounded-xl px-5 h-10">
          <Link href="/admin/users/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Akun
          </Link>
        </Button>
      </div>

      <Card className="animate-fade-in-up border border-[#6B8E7B]/10 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-[#6B8E7B]/10 bg-gradient-to-r from-[#FAF9F6] to-white py-5 px-6">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-3 text-lg font-black text-[#334155]">
              <div className="h-10 w-10 rounded-xl bg-white border border-[#6B8E7B]/20 shadow-sm flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-[#6B8E7B]" />
              </div>
              Daftar Akun Terdaftar ({allUsers.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#FAF9F6] border-b border-[#6B8E7B]/10 text-[#64748B] font-bold">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap uppercase tracking-wider text-[10px]">Nama Lengkap</th>
                  <th className="px-6 py-4 whitespace-nowrap uppercase tracking-wider text-[10px]">Username</th>
                  <th className="px-6 py-4 whitespace-nowrap uppercase tracking-wider text-[10px]">Role / Jabatan</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right uppercase tracking-wider text-[10px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6B8E7B]/5">
                {allUsers.map(user => (
                  <tr key={user.id} className="hover:bg-[#FAF9F6]/50 transition-colors group">
                    <td className="px-6 py-4 text-[#334155] font-bold">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-[#475569] font-medium">
                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-mono text-xs border border-slate-200">
                        {user.username}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-[#6B8E7B]/10 text-[#6B8E7B] border-[#6B8E7B]/20 px-3 py-1 rounded-full shadow-sm">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0 bg-white border-[#6B8E7B]/20 text-[#6B8E7B] hover:bg-[#6B8E7B] hover:text-white rounded-lg">
                          <Link href={`/admin/users/${user.id}/edit`} className="flex items-center justify-center w-full h-full">
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <form action={deleteUserAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            type="submit" 
                            className="h-8 w-8 p-0 bg-white text-rose-500 border-rose-200 hover:text-white hover:bg-rose-500 hover:border-rose-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
