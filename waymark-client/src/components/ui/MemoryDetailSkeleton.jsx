import Skeleton from "./Skeleton";

function MemoryDetailSkeleton() {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 md:px-8 md:pt-7">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
          <Skeleton className="h-[280px] w-full rounded-none bg-white/10 md:h-[450px]" />

          <div className="p-6 md:p-8">
            <Skeleton className="h-5 w-40 bg-white/10" />
            <Skeleton className="mt-4 h-12 w-3/4 bg-white/10" />
            <Skeleton className="mt-4 h-4 w-44 bg-white/10" />

            <div className="mt-8 space-y-3">
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-2/3 bg-white/10" />
            </div>

            <div className="mt-8 flex gap-4 border-t border-white/10 pt-6">
              <Skeleton className="h-10 w-20 rounded-full bg-white/10" />
              <Skeleton className="h-10 w-20 rounded-full bg-white/10" />
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.2)] md:p-8">
          <Skeleton className="h-8 w-40 bg-white/10" />

          <div className="mt-6 flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-2xl bg-white/10" />
            <Skeleton className="h-12 w-14 rounded-2xl bg-white/10" />
          </div>

          <div className="mt-8 space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <Skeleton className="h-4 w-32 bg-white/10" />
                <Skeleton className="mt-3 h-4 w-3/4 bg-white/10" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MemoryDetailSkeleton;