export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse" aria-label="Loading blog posts" aria-busy="true">
      <div className="h-20 border-b border-slate-200 bg-white px-4 sm:px-8">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="h-9 w-28 rounded-lg bg-slate-200" />
          <div className="hidden h-9 w-80 rounded-lg bg-slate-200 sm:block" />
          <div className="h-9 w-24 rounded-full bg-slate-200" />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mx-auto h-12 w-3/4 rounded-lg bg-slate-200" />
          <div className="mx-auto mt-4 h-4 w-2/3 rounded bg-slate-200" />
        </div>

        <div className="mb-10 grid gap-4 rounded-2xl bg-white p-4 sm:grid-cols-[1fr_220px]">
          <div className="h-11 rounded-xl bg-slate-100" />
          <div className="h-11 rounded-xl bg-slate-100" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="aspect-[16/10] rounded-xl bg-slate-200" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="h-3 w-2/5 rounded bg-slate-200" />
            <div className="mt-5 h-8 w-full rounded bg-slate-200" />
            <div className="mt-3 h-8 w-4/5 rounded bg-slate-200" />
            <div className="mt-6 space-y-2">
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="h-3 w-3/4 rounded bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="aspect-[16/10] rounded-xl bg-slate-200" />
              <div className="mt-5 h-5 w-4/5 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-full rounded bg-slate-200" />
              <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
