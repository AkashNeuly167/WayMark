import Skeleton from "./Skeleton";

function MemoryDetailSkeleton() {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="mx-auto max-w-[1400px] px-4 pb-28 pt-5 md:px-8 md:pt-7">
        <section className="relative mb-6 h-[58vh] min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_24px_80px_rgba(0,0,0,0.34)] md:h-[72vh]">
          <Skeleton className="h-full w-full rounded-none" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <Skeleton className="h-5 w-80 max-w-full" />
            <Skeleton className="mt-4 h-12 w-3/4 max-w-3xl md:h-16" />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-8">
            <article className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-8">
              <div className="mb-7 flex items-center gap-4 border-b border-white/10 pb-7">
                <Skeleton className="h-14 w-14 shrink-0 rounded-full" />

                <div className="min-w-0 flex-1">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="mt-2 h-4 w-32" />
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>

              <div className="mt-8 flex gap-4 border-t border-white/10 pt-6">
                <Skeleton className="h-10 w-20 rounded-full" />
                <Skeleton className="h-10 w-20 rounded-full" />
              </div>
            </article>

            <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-7">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="mt-2 h-4 w-40" />

              <div className="mt-7 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-5">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

                  <div className="min-w-0 flex-1">
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <div className="mt-3 flex justify-end">
                      <Skeleton className="h-10 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="mt-3 h-4 w-full" />
                      <Skeleton className="mt-2 h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </section>

          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
              <Skeleton className="h-4 w-40" />

              <div className="mt-5 space-y-3">
                <Skeleton className="h-20 w-full rounded-2xl" />

                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-20 w-full rounded-2xl" />
                  <Skeleton className="h-20 w-full rounded-2xl" />
                </div>

                <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
            </section>

            <section className="overflow-hidden rounded-[2rem] border border-[#F6AD55]/20 bg-[#101D2E] p-1 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
              <Skeleton className="h-64 w-full rounded-[1.75rem]" />
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default MemoryDetailSkeleton;