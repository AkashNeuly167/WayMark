import Skeleton from "./Skeleton";

function NotificationSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex items-start gap-4 rounded-3xl border border-[#D8DEE6] bg-white p-5"
        >
          <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="mt-3 h-4 w-32" />
          </div>

          <Skeleton className="h-3 w-3 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default NotificationSkeleton;