export default function PlayerLoading() {
  return (
    <div className="min-h-screen bg-[#0a0a12] text-white animate-pulse">
      <div className="h-48 sm:h-56 bg-[#131320]" />
      <div className="max-w-5xl mx-auto px-6 -mt-20 pb-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 shrink-0 bg-zinc-800"
            style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }} />
          <div className="flex-1 pt-2 space-y-2">
            <div className="h-8 w-48 bg-zinc-800 rounded" />
            <div className="h-4 w-32 bg-zinc-800/60 rounded" />
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <div className="h-4 w-24 bg-zinc-800/60 rounded" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => <div key={i} className="w-24 h-12 bg-zinc-800 rounded" />)}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-[1px] bg-zinc-800 mb-8" />
      </div>
      <main className="max-w-5xl mx-auto px-6 pb-16 space-y-10">
        <div className="flex gap-2">
          {[80, 120, 160].map((w) => <div key={w} className="h-9 bg-zinc-800 rounded" style={{ width: w }} />)}
        </div>
        <div>
          <div className="h-5 w-32 bg-zinc-800 rounded mb-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="ow-card p-4 space-y-2">
                <div className="h-3 w-16 bg-zinc-700/60 rounded" />
                <div className="h-7 w-20 bg-zinc-700 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="h-5 w-40 bg-zinc-800 rounded mb-4" />
          <div className="ow-card p-4 space-y-3">
            <div className="flex gap-4 pb-3 border-b border-zinc-800/60">
              {[120, 80, 60, 90, 60, 70, 70].map((w, i) => (
                <div key={i} className="h-3 bg-zinc-700/40 rounded" style={{ width: w }} />
              ))}
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-1.5 border-b border-zinc-800/20 last:border-0"
                style={{ opacity: 1 - i * 0.08 }}>
                <div className="flex items-center gap-2.5 shrink-0" style={{ width: 120 }}>
                  <div className="w-[34px] h-[34px] rounded bg-zinc-800 shrink-0" />
                  <div className="h-4 w-16 bg-zinc-700/60 rounded" />
                </div>
                {[80, 60, 90, 60, 70, 70].map((w, j) => (
                  <div key={j} className="h-3 bg-zinc-700/40 rounded" style={{ width: w }} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
