import Skeleton from "./Skeleton";

function MemoryDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-8">
        <section className="overflow-hidden rounded-3xl border border-[#D8DEE6] bg-white shadow-sm">
          <Skeleton className="h-[280px] w-full rounded-none md:h-[450px]" />

          <div className="p-6 md:p-8">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-4 h-12 w-3/4" />
            <Skeleton className="mt-4 h-4 w-44" />

            <div className="mt-8 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="mt-8 flex gap-4 border-t border-[#E5EAF0] pt-6">
              <Skeleton className="h-10 w-20 rounded-full" />
              <Skeleton className="h-10 w-20 rounded-full" />
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[#D8DEE6] bg-white p-6 shadow-sm md:p-8">
          <Skeleton className="h-8 w-40" />

          <div className="mt-6 flex gap-3">
            <Skeleton className="h-12 flex-1 rounded-2xl" />
            <Skeleton className="h-12 w-14 rounded-2xl" />
          </div>

          <div className="mt-8 space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#E8EDF2] bg-[#F7FAFC] p-4"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-3 h-4 w-3/4" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default MemoryDetailSkeleton;