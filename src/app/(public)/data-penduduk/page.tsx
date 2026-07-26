import { Users, FileSpreadsheet, TrendingUp } from "lucide-react";
import { Metadata } from "next";
import SectionHero from "@/components/ui/section-hero";
import Link from "next/link";
import { getPageSections } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Data Penduduk",
  description: "Data dan statistik kependudukan desa",
};

export const revalidate = 60;

export default async function DataPendudukPage() {
  const datasetData = (await getPageSections("data-penduduk")).map(
    ({ collection, fields, entries }) => ({
      ds: collection,
      fields: fields.filter((field) => field.isPublic),
      entries: entries.filter((entry) => entry.status === "published"),
    })
  );

  return (
    <>
      <SectionHero
        icon={Users}
        eyebrow="Demografi"
        title="Data Penduduk"
        description="Pusat data statistik dan demografi penduduk yang dikelola secara transparan dan berkala."
        breadcrumbs={[{ label: "Beranda", href: "/" }, { label: "Data Penduduk" }]}
      />

      <div className="bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">

          {datasetData.length === 0 ? (
            <div className="text-center py-24 rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto mb-5">
                <FileSpreadsheet className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Data Belum Tersedia</h3>
              <p className="text-slate-400 text-sm">Pemerintah desa sedang memperbarui data kependudukan.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {datasetData.map(({ ds, fields, entries }, i) => (
                <div
                  key={ds.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-8 w-1 rounded-full bg-[#16a34a]" />
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">{ds.name}</h2>
                      {ds.description && (
                        <p className="text-slate-500 text-sm mt-0.5">{ds.description}</p>
                      )}
                    </div>
                    <div className="ml-auto flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <TrendingUp className="h-4 w-4" />
                      {entries.length} data
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                    {entries.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="text-slate-400 text-sm italic">Belum ada baris data.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">
                              <th className="px-5 py-3.5 text-xs font-extrabold text-slate-400 uppercase tracking-widest w-12 text-center">No</th>
                              {fields.map((f) => (
                                <th key={f.id} className="px-5 py-3.5 text-xs font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  {f.name}
                                  {f.unit && <span className="ml-1 text-slate-300 font-medium normal-case">({f.unit})</span>}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {entries.map((entry, idx) => {
                              const data = entry.data as Record<string, any>;
                              const isEven = idx % 2 === 0;
                              return (
                                <tr
                                  key={entry.id}
                                  className={`border-b border-slate-100 last:border-0 hover:bg-green-50/50 transition-colors ${isEven ? "" : "bg-slate-50/40"}`}
                                >
                                  <td className="px-5 py-3.5 text-xs text-slate-400 font-mono text-center">
                                    {idx + 1}
                                  </td>
                                  {fields.map((f) => (
                                    <td key={f.id} className="px-5 py-3.5 text-slate-800 font-medium">
                                      {String(data[f.key] ?? "—")}
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                          {/* Summary row */}
                          <tfoot>
                            <tr className="border-t-2 border-slate-200 bg-slate-50/80">
                              <td colSpan={fields.length + 1} className="px-5 py-3 text-xs text-slate-400 font-medium">
                                Total: {entries.length} baris data · Terakhir diperbarui oleh Admin
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info note */}
          <div className="mt-10 flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <Users className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800/80 leading-relaxed">
              Data kependudukan ini diperbarui secara berkala oleh pemerintah desa. Untuk informasi lebih lanjut, silakan kunjungi Kantor Desa atau hubungi kami melalui halaman{" "}
              <Link href="/pengaduan" className="font-bold text-blue-700 hover:underline">Pengaduan</Link>.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
