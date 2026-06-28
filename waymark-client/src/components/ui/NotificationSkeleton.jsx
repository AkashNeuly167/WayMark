import Skeleton from "./Skeleton";

function NotificationSkeleton() {
  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.18)] md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-3 h-4 w-64 max-w-full" />
          </div>

          <Skeleton className="h-11 w-28 rounded-2xl" />
        </div>
      </section>

      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex items-start gap-4 rounded-[2rem] border border-white/10 bg-[#101D2E] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.16)] md:p-5"
          >
            <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />

            <div className="min-w-0 flex-1 pt-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-3 h-3 w-28" />
            </div>

            <div className="flex flex-col items-end gap-3">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationSkeleton;