import { contentCollections, contentEntries, contentFields } from "@/db/schema";
import { ExternalLink, Image as ImageIcon, Hash, Type, Link2, FileText } from "lucide-react";

interface DynamicSectionProps {
  collection: typeof contentCollections.$inferSelect;
  fields: typeof contentFields.$inferSelect[];
  entries: typeof contentEntries.$inferSelect[];
}

export function DynamicSection({ collection, fields, entries }: DynamicSectionProps) {
  const isSingleton = collection.isSingleton || collection.mode === "singleton";

  const renderHeader = () => (
    <div className="mb-4">
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="h-6 w-1.5 rounded-full bg-[#6B8E7B]" />
        <h2 className="text-xl font-bold text-[#334155] tracking-tight">{collection.name}</h2>
      </div>
      {collection.description && (
        <p className="text-[#64748B] text-xs font-medium leading-relaxed pl-4">{collection.description}</p>
      )}
    </div>
  );

  /* ── SINGLETON ─────────────────────────────────────── */
  if (isSingleton) {
    const data = (entries[0]?.data ?? {}) as Record<string, any>;

    /* Rich Text */
    if (collection.presentationType === "rich_text") {
      const richField = fields.find((f) => f.type === "richtext") || fields[0];
      return (
        <section className="mb-6">
          {renderHeader()}
          <div className="soft-card bg-white border border-[#6B8E7B]/20 p-6">
            {richField && data[richField.key] ? (
              <div
                className="prose-desa prose-sm max-w-none prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-[#6B8E7B] prose-ul:pl-4 prose-ol:pl-4"
                dangerouslySetInnerHTML={{ __html: String(data[richField.key]) }}
              />
            ) : (
              <EmptyState label="Konten belum ditambahkan." />
            )}
          </div>
        </section>
      );
    }

    /* Statistics */
    if (collection.presentationType === "statistics") {
      return (
        <section className="mb-6">
          {renderHeader()}
          <div className="grid grid-cols-2 gap-3">
            {fields.map((field) => (
              <div
                key={field.id}
                className="soft-card bg-white border border-[#6B8E7B]/20 p-4 text-center group hover:border-[#6B8E7B]/50 transition-colors"
              >
                <div className="text-3xl font-black text-[#334155] mb-1 tabular-nums group-hover:text-[#6B8E7B] transition-colors">
                  {data[field.key] ?? "—"}
                </div>
                <div className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-widest">
                  {field.name}
                  {field.unit && <span className="ml-1 text-[#6B8E7B]">({field.unit})</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    /* Key-Value (default singleton) - Soft List format */
    return (
      <section className="mb-6">
        {renderHeader()}
        <div className="soft-card bg-white border border-[#6B8E7B]/20 p-2">
          {fields.length === 0 ? (
            <EmptyState label="Belum ada field dikonfigurasi." />
          ) : (
            <dl className="flex flex-col gap-1">
              {fields.map((field) => {
                const value = data[field.key];
                if (!value) return null; // HIDE EMPTY FIELDS

                const isImage = field.type === "image";
                const isUrl = field.type === "url" || String(value).startsWith("http");
                return (
                  <div
                    key={field.id}
                    className="flex flex-col gap-1 p-3 rounded-xl hover:bg-[#FAF9F6] border border-transparent hover:border-[#6B8E7B]/10 transition-colors"
                  >
                    <dt className="flex items-center gap-2 text-[10px] font-extrabold text-[#64748B] uppercase tracking-widest">
                      <span>
                        {field.name}
                        {field.unit && <span className="text-[#6B8E7B]/60 font-semibold ml-1">({field.unit})</span>}
                      </span>
                    </dt>
                    <dd className="text-sm font-semibold text-[#334155] pl-6">
                      {isImage && value ? (
                        <img
                          src={value}
                          alt={field.name}
                          className="mt-2 h-20 w-20 object-cover rounded-lg border border-[#6B8E7B]/20 shadow-sm"
                        />
                      ) : isUrl && value ? (
                        <a href={String(value)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#6B8E7B] hover:text-[#557162] hover:underline mt-0.5">
                          Kunjungi Tautan <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="break-words">{String(value)}</span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          )}
        </div>
      </section>
    );
  }

  /* ── MULTIPLE ENTRIES ──────────────────────────────── */

  /* Table / Dataset */
  if (collection.presentationType === "table" || collection.mode === "dataset") {
    const publicFields = fields.filter((f) => f.isPublic);
    return (
      <section className="mb-6">
        {renderHeader()}
        <div className="soft-card bg-white border border-[#6B8E7B]/20 overflow-hidden">
          {entries.length === 0 ? (
            <EmptyState label="Belum ada data." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[#6B8E7B]/10 bg-[#FAF9F6]">
                    <th className="px-4 py-3 text-[10px] font-extrabold text-[#64748B] uppercase tracking-widest w-12">#</th>
                    {publicFields.map((f) => (
                      <th key={f.id} className="px-4 py-3 text-[10px] font-extrabold text-[#64748B] uppercase tracking-widest whitespace-nowrap">
                        {f.name}{f.unit ? ` (${f.unit})` : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => {
                    const d = entry.data as Record<string, any>;
                    return (
                      <tr key={entry.id} className="border-b border-[#6B8E7B]/5 last:border-0 hover:bg-[#FAF9F6] transition-colors">
                        <td className="px-4 py-3 text-[#64748B] text-xs font-mono">{idx + 1}</td>
                        {publicFields.map((f) => {
                          const val = d[f.key];
                          const isUrl = f.type === "url" || (typeof val === "string" && val.startsWith("http"));
                          return (
                            <td key={f.id} className="px-4 py-3 text-[#334155] font-medium">
                              {isUrl && val ? (
                                <a href={String(val)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#6B8E7B] hover:underline font-semibold">
                                  Kunjungi Tautan <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                String(val ?? "—")
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    );
  }

  /* Cards (Multiple) */
  const publicFields = fields.filter((f) => f.isPublic);
  return (
    <section className="mb-6">
      {renderHeader()}
      {entries.length === 0 ? (
        <div className="soft-card bg-white border border-[#6B8E7B]/20 p-2">
          <EmptyState label="Belum ada data." />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const d = entry.data as Record<string, any>;
            return (
              <div key={entry.id} className="soft-card bg-white border border-[#6B8E7B]/20 p-4 hover:border-[#6B8E7B]/40 transition-colors">
                <dl className="space-y-2">
                  {publicFields.map((f) => {
                    const val = d[f.key];
                    if (!val) return null; // hide empty fields
                    const isUrl = f.type === "url" || (typeof val === "string" && val.startsWith("http"));
                    const isImage = f.type === "image";
                    return (
                      <div key={f.id} className="flex flex-col gap-0.5">
                        <dt className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-widest">
                          {f.name}
                        </dt>
                        <dd className="text-sm font-semibold text-[#334155]">
                          {isImage ? (
                            <img src={String(val)} alt={f.name} className="h-16 w-16 object-cover rounded-lg mt-1 border border-[#6B8E7B]/10" />
                          ) : isUrl ? (
                            <a href={String(val)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#6B8E7B] hover:text-[#557162] hover:underline">
                              Kunjungi Tautan <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : (
                            <span className="break-words">{String(val)}</span>
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="p-8 flex flex-col items-center justify-center text-center">
      <div className="h-12 w-12 rounded-2xl bg-[#FAF9F6] border border-[#6B8E7B]/10 flex items-center justify-center mb-3">
        <FileText className="h-5 w-5 text-[#6B8E7B]/40" />
      </div>
      <span className="text-sm font-semibold text-[#64748B]">{label}</span>
    </div>
  );
}

function FieldTypeIcon({ type, className }: { type: string, className?: string }) {
  const classes = className || "h-3.5 w-3.5 text-[#6B8E7B]";
  switch (type) {
    case "number": return <Hash className={classes} />;
    case "url": return <Link2 className={classes} />;
    case "image": return <ImageIcon className={classes} />;
    case "richtext": return <FileText className={classes} />;
    case "text":
    case "textarea":
    default:
      return <Type className={classes} />;
  }
}
