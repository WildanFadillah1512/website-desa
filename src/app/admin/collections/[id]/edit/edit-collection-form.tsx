"use client";

import { Save, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

type EditCollectionFormProps = {
  collection: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    page: string;
    mode: string;
    presentationType: string | null;
  };
  action: (formData: FormData) => Promise<void>;
};

export function EditCollectionForm({ collection, action }: EditCollectionFormProps) {
  const [name, setName] = useState(collection.name);
  const router = useRouter();

  return (
    <Card className="animate-fade-in-up border border-[#6B8E7B]/10 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="border-b border-[#6B8E7B]/10 bg-gradient-to-r from-[#FAF9F6] to-white py-5 px-6">
        <CardTitle className="flex items-center gap-3 text-lg font-black text-[#334155]">
          <div className="h-10 w-10 rounded-xl bg-white border border-[#6B8E7B]/20 shadow-sm flex items-center justify-center">
            <LayoutTemplate className="h-5 w-5 text-[#6B8E7B]" />
          </div>
          Edit Komponen
        </CardTitle>
        <CardDescription className="text-[#64748B] font-medium ml-13">
          Ubah informasi dasar dari komponen ini.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 md:p-8">
        <form action={action} className="space-y-7">
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-bold text-[#334155]">
              Nama Komponen
            </label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Misal: Visi Misi, Daftar Beasiswa" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 border-slate-200 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] rounded-xl shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-bold text-[#334155]">
              Slug (Identifier Khusus)
            </label>
            <Input 
              id="slug" 
              name="slug" 
              className="h-11 font-mono text-sm bg-slate-50 text-[#64748B] cursor-not-allowed border-slate-200 rounded-xl" 
              readOnly
              value={collection.slug}
            />
            <p className="text-xs text-[#94A3B8] font-medium">Slug tidak dapat diubah setelah komponen dibuat.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-bold text-[#334155]">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={collection.description || ""}
              className="flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] transition-all"
              placeholder="Deskripsi singkat kegunaan komponen ini..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6 bg-[#FAF9F6] p-6 rounded-2xl border border-[#6B8E7B]/10">
            <div className="sm:col-span-2 space-y-2">
              <label htmlFor="page" className="text-sm font-bold text-[#334155]">Halaman Publik</label>
              <select 
                id="page" 
                name="page" 
                defaultValue={collection.page}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] transition-all"
              >
                <option value="umum">Umum</option>
                <option value="beranda">Beranda (/)</option>
                <option value="profil">Profil Desa (/profil)</option>
                <option value="layanan">Layanan Desa (/layanan)</option>
                <option value="eduvillage">EduVillage (/eduvillage)</option>
                <option value="data-penduduk">Data Penduduk (/data-penduduk)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="mode" className="text-sm font-bold text-[#334155]">Mode Penyimpanan</label>
              <select 
                id="mode" 
                name="mode" 
                defaultValue={collection.mode}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] transition-all"
              >
                <option value="singleton">Singleton (Satu Entri)</option>
                <option value="list">List (Banyak Entri)</option>
                <option value="dataset">Dataset (Data Terstruktur)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="presentationType" className="text-sm font-bold text-[#334155]">Tipe Presentasi UI</label>
              <select 
                id="presentationType" 
                name="presentationType" 
                defaultValue={collection.presentationType || "list"}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] transition-all"
              >
                <option value="key_value">Key-Value (Informasi Profil)</option>
                <option value="rich_text">Rich Text (Paragraf/Artikel)</option>
                <option value="list">List Sederhana</option>
                <option value="table">Tabel Data</option>
                <option value="cards">Kartu (Grid)</option>
                <option value="chart">Grafik / Chart</option>
                <option value="statistics">Statistik Angka</option>
                <option value="mixed">Campuran</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-[#6B8E7B]/10">
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()} className="rounded-xl h-11 px-6">
              Batal
            </Button>
            <Button type="submit" size="lg" className="bg-[#6B8E7B] hover:bg-[#557162] shadow-sm rounded-xl h-11 px-6">
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          </div>
          
        </form>
      </CardContent>
    </Card>
  );
}
