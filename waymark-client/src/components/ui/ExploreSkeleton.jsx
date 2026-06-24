import Skeleton from "./Skeleton";

function ExploreSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
        <Skeleton className="h-8 w-36 bg-white/10" />

        <div className="mt-5 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <Skeleton className="h-12 w-12 rounded-2xl bg-white/10" />

              <div className="flex-1">
                <Skeleton className="h-4 w-40 bg-white/10" />
                <Skeleton className="mt-2 h-3 w-24 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
        <Skeleton className="h-8 w-36 bg-white/10" />

        <div className="mt-5 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <Skeleton className="h-20 w-24 rounded-2xl bg-white/10" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-44 bg-white/10" />
                <Skeleton className="mt-2 h-3 w-32 bg-white/10" />
                <Skeleton className="mt-3 h-3 w-full bg-white/10" />
                <Skeleton className="mt-2 h-3 w-2/3 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ExploreSkeleton;