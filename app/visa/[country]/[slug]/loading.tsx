export default function VisaDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse" aria-label="Loading work visa details" aria-busy="true">
      <div className="h-20 bg-white px-4 sm:px-8">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="h-9 w-28 rounded-lg bg-slate-200" />
          <div className="hidden h-9 w-72 rounded-lg bg-slate-200 sm:block" />
          <div className="h-9 w-24 rounded-full bg-slate-200" />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="h-4 w-44 rounded bg-slate-200" />

        <div className="mt-5 overflow-hidden rounded-2xl bg-slate-900">
          <div className="p-5 sm:p-8">
            <div className="h-4 w-36 rounded bg-slate-700" />
            <div className="mt-5 h-10 w-3/4 rounded-lg bg-slate-700" />
            <div className="mt-3 h-5 w-1/2 rounded bg-slate-700" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
            <div className="flex gap-3 overflow-hidden border-b border-slate-100 pb-4">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-9 w-28 shrink-0 rounded-lg bg-slate-100" />
              ))}
            </div>
            <div className="mt-7 h-7 w-52 rounded bg-slate-200" />
            <div className="mt-5 space-y-3">
              {[0, 1, 2, 3, 4].map((item) => (
                <div key={item} className="h-4 rounded bg-slate-100" style={{ width: `${92 - item * 7}%` }} />
              ))}
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="h-20 rounded-xl bg-slate-100" />
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="h-6 w-32 rounded bg-slate-200" />
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="mt-5 flex justify-between gap-4">
                  <div className="h-3 w-24 rounded bg-slate-100" />
                  <div className="h-3 w-28 rounded bg-slate-200" />
                </div>
              ))}
              <div className="mt-6 h-11 rounded-xl bg-slate-200" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="h-6 w-40 rounded bg-slate-200" />
              <div className="mt-5 flex items-center gap-3">
                <div className="size-14 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
