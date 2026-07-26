export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-xl bg-slate-200" />
          <div className="h-4 w-80 rounded-lg bg-slate-100" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-slate-200" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex justify-between">
              <div className="h-4 w-24 rounded-lg bg-slate-200" />
              <div className="h-10 w-10 rounded-full bg-slate-100" />
            </div>
            <div className="h-8 w-16 rounded-lg bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Table/Content Skeleton */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="h-5 w-40 rounded-lg bg-slate-200" />
        </div>
        <div className="divide-y divide-slate-100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-10 w-10 rounded-full bg-slate-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded-lg bg-slate-200" />
                <div className="h-3 w-1/2 rounded-lg bg-slate-100" />
              </div>
              <div className="h-6 w-20 rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
