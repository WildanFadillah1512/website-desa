"use client";

import { useState } from "react";
import { Input } from "./input";
import { Image as ImageIcon, UploadCloud } from "lucide-react";

export function ImageUpload({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      {/* Hidden input to hold the base64 value for server action submission */}
      <input type="hidden" name={name} value={preview || ""} />
      
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
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </label>
          <p className="text-xs text-slate-400 mt-2">Format: JPG, PNG, WEBP. Maks: 2MB.</p>
        </div>
      </div>
    </div>
  );
}
