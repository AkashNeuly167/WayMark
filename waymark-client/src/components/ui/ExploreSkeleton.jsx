import Skeleton from "./Skeleton";

function ExploreSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <section className="rounded-3xl border border-[#D8DEE6] bg-white p-6">
        <Skeleton className="h-8 w-36" />

        <div className="mt-5 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-4 rounded-2xl bg-[#F7FAFC] p-4"
            >
              <Skeleton className="h-12 w-12 rounded-2xl" />

              <div className="flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-[#D8DEE6] bg-white p-6">
        <Skeleton className="h-8 w-36" />

        <div className="mt-5 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex gap-4 rounded-2xl bg-[#F7FAFC] p-4"
            >
              <Skeleton className="h-20 w-24 rounded-2xl" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="mt-2 h-3 w-32" />
                <Skeleton className="mt-3 h-3 w-full" />
                <Skeleton className="mt-2 h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ExploreSkeleton;