import Skeleton from "./Skeleton";

function NotificationSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="flex items-start gap-4 rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
        >
          <Skeleton className="h-12 w-12 shrink-0 rounded-2xl bg-white/10" />

          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 w-3/4 bg-white/10" />
            <Skeleton className="mt-3 h-4 w-32 bg-white/10" />
          </div>

          <Skeleton className="h-3 w-3 rounded-full bg-[#F6AD55]/30" />
        </div>
      ))}
    </div>
  );
}

export default NotificationSkeleton;