import Skeleton from "./Skeleton";

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-28 pt-5 md:px-8 md:pt-7">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
        <Skeleton className="h-40 w-full rounded-none md:h-56" />

        <div className="px-5 pb-6 md:px-8 md:pb-8">
          <div className="-mt-12 flex flex-col gap-5 md:-mt-14 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-end">
              <Skeleton className="h-28 w-28 rounded-full ring-4 ring-[#101D2E] md:h-32 md:w-32" />

              <div className="pb-1">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="mt-3 h-4 w-36" />
              </div>
            </div>

            <Skeleton className="h-11 w-32 rounded-2xl" />
          </div>

          <div className="mt-6 max-w-2xl space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 md:max-w-md">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
        </div>
      </section>

      <section className="mt-7">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="mt-2 h-4 w-28" />
          </div>

          <Skeleton className="h-10 w-28 rounded-full" />
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1 md:w-80">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
            >
              <Skeleton className="h-56 w-full rounded-none md:h-60" />

              <div className="p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-3 h-4 w-32" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />

                <div className="mt-5 flex justify-between border-t border-white/10 pt-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-5 w-12 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>

                  <Skeleton className="h-7 w-7 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProfileSkeleton;