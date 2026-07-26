"use client";

import { useState } from "react";
import { Image as ImageIcon, UploadCloud } from "lucide-react";

export function ImageUpload({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [preview, setPreview] = useState(defaultValue || "");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format gambar harus JPG, PNG, atau WEBP.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 4MB.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={defaultValue || ""} />
      
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative h-20 w-32 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-20 w-32 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-slate-400 shrink-0">
            <ImageIcon className="h-6 w-6 mb-1" />
            <span className="text-[10px] font-medium uppercase tracking-wider">No Image</span>
          </div>
        )}
        
        <div className="flex-1">
          <label className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-[#166534]">
            <UploadCloud className="h-4 w-4" />
            <span>Pilih Gambar...</span>
            <input 
              name={`${name}__file`}
              type="file" 
              accept="image/jpeg,image/png,image/webp" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>
          <p className="text-xs text-slate-400 mt-2">Format: JPG, PNG, WEBP. Maks: 4MB. Gambar diunggah saat data disimpan.</p>
          {error && <p className="text-xs font-medium text-red-600 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
