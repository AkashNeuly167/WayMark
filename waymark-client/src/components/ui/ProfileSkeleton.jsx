import Skeleton from "./Skeleton";

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Skeleton className="h-28 w-28 rounded-full bg-white/10" />

          <div className="flex-1">
            <Skeleton className="h-9 w-56 bg-white/10" />
            <Skeleton className="mt-3 h-4 w-36 bg-white/10" />
            <Skeleton className="mt-5 h-4 w-full max-w-xl bg-white/10" />

            <div className="mt-6 flex gap-4">
              <Skeleton className="h-16 w-28 rounded-2xl bg-white/10" />
              <Skeleton className="h-16 w-28 rounded-2xl bg-white/10" />
              <Skeleton className="h-16 w-28 rounded-2xl bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <Skeleton className="h-8 w-40 bg-white/10" />

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_18px_55px_rgba(0,0,0,0.18)]"
            >
              <Skeleton className="h-52 w-full rounded-none bg-white/10" />

              <div className="p-5">
                <Skeleton className="h-5 w-48 bg-white/10" />
                <Skeleton className="mt-3 h-4 w-32 bg-white/10" />
                <Skeleton className="mt-4 h-4 w-full bg-white/10" />
                <Skeleton className="mt-2 h-4 w-2/3 bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProfileSkeleton;