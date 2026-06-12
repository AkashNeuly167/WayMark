import Skeleton from "./Skeleton";

function FeedSkeleton() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-3 h-4 w-44" />
        </div>

        <Skeleton className="hidden h-12 w-36 rounded-2xl md:block" />
      </div>

      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5].map((item) => (
          <Skeleton key={item} className="h-32 w-24 shrink-0 rounded-2xl" />
        ))}
      </div>

      <Skeleton className="h-[320px] w-full rounded-3xl" />

      <div className="grid grid-cols-1 gap-8">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-3xl border border-[#D8DEE6] bg-white"
          >
            <Skeleton className="h-[280px] w-full rounded-none" />

            <div className="p-5">
              <div className="mb-5 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />

                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </div>
              </div>

              <Skeleton className="h-6 w-52" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />

              <div className="mt-6 flex justify-between border-t border-[#E5EAF0] pt-4">
                <div className="flex gap-5">
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-5 w-14" />
                </div>

                <Skeleton className="h-5 w-5 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedSkeleton;