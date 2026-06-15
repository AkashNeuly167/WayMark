import Skeleton from "./Skeleton";

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-8">
      <section className="rounded-[32px] border border-[#D8DEE6] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Skeleton className="h-28 w-28 rounded-full" />

          <div className="flex-1">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="mt-3 h-4 w-36" />
            <Skeleton className="mt-5 h-4 w-full max-w-xl" />

            <div className="mt-6 flex gap-4">
              <Skeleton className="h-16 w-28 rounded-2xl" />
              <Skeleton className="h-16 w-28 rounded-2xl" />
              <Skeleton className="h-16 w-28 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <Skeleton className="h-8 w-40" />

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-3xl border border-[#D8DEE6] bg-white"
            >
              <Skeleton className="h-52 w-full rounded-none" />

              <div className="p-5">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="mt-3 h-4 w-32" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProfileSkeleton;