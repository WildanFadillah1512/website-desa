"use client";

import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";

type StatusValue = "semua" | "menunggu" | "diproses" | "selesai" | "ditolak";

const OPTIONS: { value: StatusValue; label: string }[] = [
  { value: "semua", label: "Semua status" },
  { value: "menunggu", label: "Menunggu" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
];

export function StatusFilter({ value }: { value: StatusValue }) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <Filter className="h-4 w-4 text-[#6B8E7B]" />
      <span className="sr-only">Filter status laporan</span>
      <select
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value as StatusValue;
          router.push(nextValue === "semua" ? "/admin/pengaduan" : `/admin/pengaduan?status=${nextValue}`);
        }}
        className="h-8 min-w-40 bg-transparent text-sm font-bold text-[#334155] outline-none"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
