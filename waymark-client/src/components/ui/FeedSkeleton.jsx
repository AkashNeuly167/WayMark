import Skeleton from "./Skeleton";

function FeedSkeleton() {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
        <Skeleton className="h-[240px] w-full rounded-none bg-white/10 md:h-[300px] xl:h-[320px]" />

        <div className="p-5">
          <div className="mb-5 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full bg-white/10" />

            <div>
              <Skeleton className="h-4 w-32 bg-white/10" />
              <Skeleton className="mt-2 h-3 w-20 bg-white/10" />
            </div>
          </div>

          <Skeleton className="h-6 w-52 bg-white/10" />
          <Skeleton className="mt-4 h-4 w-full bg-white/10" />
          <Skeleton className="mt-2 h-4 w-3/4 bg-white/10" />

          <div className="mt-6 flex justify-between border-t border-white/10 pt-4">
            <div className="flex gap-5">
              <Skeleton className="h-5 w-14 bg-white/10" />
              <Skeleton className="h-5 w-14 bg-white/10" />
            </div>

            <Skeleton className="h-5 w-5 rounded-md bg-white/10" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_20px_70px_rgba(0,0,0,0.18)]"
          >
            <Skeleton className="h-[220px] w-full rounded-none bg-white/10 md:h-[260px]" />

            <div className="p-5">
              <div className="mb-5 flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full bg-white/10" />

                <div>
                  <Skeleton className="h-4 w-32 bg-white/10" />
                  <Skeleton className="mt-2 h-3 w-20 bg-white/10" />
                </div>
              </div>

              <Skeleton className="h-6 w-52 bg-white/10" />
              <Skeleton className="mt-4 h-4 w-full bg-white/10" />
              <Skeleton className="mt-2 h-4 w-3/4 bg-white/10" />

              <div className="mt-6 flex justify-between border-t border-white/10 pt-4">
                <div className="flex gap-5">
                  <Skeleton className="h-5 w-14 bg-white/10" />
                  <Skeleton className="h-5 w-14 bg-white/10" />
                </div>

                <Skeleton className="h-5 w-5 rounded-md bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedSkeleton;