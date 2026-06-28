import Skeleton from "./Skeleton";

function ExploreSkeleton() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] md:p-6">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-4 h-12 w-full rounded-2xl md:h-14" />

        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-9 w-24 rounded-full" />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ExplorePanelSkeleton type="travelers" />
        <ExplorePanelSkeleton type="memories" />
      </div>
    </div>
  );
}

function ExplorePanelSkeleton({ type }) {
  const isTravelers = type === "travelers";

  return (
    <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-36" />
          <Skeleton className="mt-2 h-3 w-24" />
        </div>

        <Skeleton className="h-8 w-16 rounded-full" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((item) =>
          isTravelers ? (
            <div
              key={item}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <Skeleton className="h-12 w-12 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>

              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          ) : (
            <div
              key={item}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
            >
              <Skeleton className="h-20 w-24 shrink-0 rounded-2xl" />

              <div className="min-w-0 flex-1 py-1">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="mt-2 h-3 w-32" />
                <Skeleton className="mt-3 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}

export default ExploreSkeleton;