"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef } from "react";

export function FieldForm({ action }: { action: (formData: FormData) => void }) {
  const [label, setLabel] = useState("");
  const [key, setKey] = useState("");
  const [type, setType] = useState("text");
  const [isTypeManuallyEdited, setIsTypeManuallyEdited] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const inferType = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("gambar") || l.includes("foto") || l.includes("logo") || l.includes("thumbnail")) return "image";
    if (l.includes("deskripsi") || l.includes("alamat") || l.includes("keterangan")) return "textarea";
    if (l.includes("konten") || l.includes("isi") || l.includes("artikel")) return "richtext";
    if (l.includes("tanggal") || l.includes("waktu") || l.includes("hari") || l.includes("jadwal")) return "date";
    if (l.includes("jumlah") || l.includes("total") || l.includes("harga") || l.includes("angka")) return "number";
    if (l.includes("link") || l.includes("tautan") || l.includes("url") || l.includes("website")) return "url";
    return "text";
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    
    // Auto generate Key
    const generatedKey = newLabel
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_");
    setKey(generatedKey);

    // Auto infer Type if not manually changed
    if (!isTypeManuallyEdited) {
      setType(inferType(newLabel));
    }
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setIsTypeManuallyEdited(true);
  };

  return (
    <Card className="sticky top-24 border-[#6B8E7B]/10 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-[#FAF9F6] to-white border-b border-[#6B8E7B]/10 py-5">
        <CardTitle className="flex items-center gap-2 text-lg font-black text-[#334155]">
          <Plus className="h-5 w-5 text-[#6B8E7B]" /> Tambah Field Cepat
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form 
          ref={formRef}
          action={async (formData) => {
            await action(formData);
            setLabel("");
            setKey("");
            setType("text");
            setIsTypeManuallyEdited(false);
            formRef.current?.reset();
          }} 
          className="space-y-5"
        >
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#334155]">Nama Field (Label)</label>
            <Input 
              name="name" 
              placeholder="Misal: Judul, Foto, Keterangan..." 
              required 
              value={label}
              onChange={handleLabelChange}
              className="h-11 border-slate-200 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] rounded-xl shadow-sm"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#334155]">Tipe Data</label>
            <select 
              name="type" 
              value={type}
              onChange={handleTypeChange}
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] transition-all" 
              required
            >
              <option value="text">Text Pendek (Input)</option>
              <option value="textarea">Text Panjang (Textarea)</option>
              <option value="richtext">Rich Text (HTML Editor)</option>
              <option value="image">Gambar (URL)</option>
              <option value="date">Tanggal (Datepicker)</option>
              <option value="number">Angka (Numeric)</option>
              <option value="url">Tautan / Link (URL)</option>
            </select>
            <p className="text-[10px] text-[#94A3B8] font-medium">Otomatis menyesuaikan label, tapi bisa Anda ubah.</p>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#334155]">Satuan / Unit (Opsional)</label>
            <Input name="unit" placeholder="Misal: Ha, Jiwa, KK" className="h-11 border-slate-200 focus-visible:ring-[#6B8E7B]/20 focus-visible:border-[#6B8E7B] rounded-xl shadow-sm" />
          </div>

          <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#6B8E7B]/10 mt-2 space-y-3">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isRequired" name="isRequired" className="h-4 w-4 rounded border-slate-300 text-[#6B8E7B] focus:ring-[#6B8E7B] cursor-pointer" />
              <label htmlFor="isRequired" className="text-sm font-bold text-[#334155] cursor-pointer select-none">Wajib Diisi (Required)</label>
            </div>
            {/* isPublic is always true initially for new fields, they can hide it later from the list */}
            <input type="hidden" name="isPublic" value="on" />
          </div>

          {/* Hidden Fields */}
          <input type="hidden" name="key" value={key} />
          
          <Button type="submit" className="w-full mt-4 bg-[#6B8E7B] hover:bg-[#557162] h-11 rounded-xl shadow-sm text-base">
            Simpan Field
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
