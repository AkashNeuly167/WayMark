import Skeleton from "./Skeleton";

function FeedSkeleton() {
  return (
    <div className="space-y-5">
      <MemoryCardSkeleton featured />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <MemoryCardSkeleton key={item} />
        ))}
      </div>
    </div>
  );
}

function MemoryCardSkeleton({ featured = false }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
      <Skeleton
        className={`w-full rounded-none ${
          featured
            ? "h-[240px] md:h-[300px] xl:h-[320px]"
            : "h-[220px] md:h-[260px]"
        }`}
      />

      <div className="px-4 pb-3 pt-3 md:px-5 md:pb-4">
        <div className="mb-3 flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-24" />
          </div>

          <Skeleton className="h-9 w-9 rounded-full" />
        </div>

        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-3 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
          <div className="flex gap-4">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>

          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default FeedSkeleton;