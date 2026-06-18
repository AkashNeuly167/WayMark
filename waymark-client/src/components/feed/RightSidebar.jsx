import { Link } from "react-router-dom";
import { ChevronRight, Compass, Star, UserPlus } from "lucide-react";

function RightSidebar({ memories = [] }) {
  const trendingPlaces = getTrendingPlaces(memories);

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 space-y-7">
        <section className="overflow-hidden rounded-[2rem] border border-[#D8DEE6] bg-white shadow-sm">
          <div className="relative h-32 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop"
              alt="Explorer banner"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#002045]/70 to-transparent" />
          </div>

          <div className="px-6 pb-6">
            <div className="-mt-8 grid h-16 w-16 place-items-center rounded-3xl border-4 border-white bg-[#1A365D] text-xl font-black text-white shadow-lg">
              W
            </div>

            <h3 className="mt-4 text-2xl font-black text-[#002045]">
              Your Explorer Hub
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#002045]/60">
              Track memories, discover places, and keep your travel goals moving.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <MiniStat label="Posts" value={memories.length} />
              <MiniStat
                label="Likes"
                value={memories.reduce(
                  (sum, memory) => sum + (memory.likes?.length || 0),
                  0
                )}
              />
              <MiniStat
                label="Cities"
                value={
                  new Set(memories.map((memory) => memory.city).filter(Boolean))
                    .size
                }
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#D8DEE6] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#F6AD55]">
                Discover
              </p>
              <h3 className="text-xl font-black text-[#002045]">
                Trending Places
              </h3>
            </div>

            <Link
              to="/explore"
              className="text-sm font-black text-[#F6AD55] hover:text-orange-400"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {trendingPlaces.map((item) => (
              <Link
                key={item.name}
                to={`/explore?q=${encodeURIComponent(item.name)}`}
                className="group relative block h-24 overflow-hidden rounded-2xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-center px-4">
                  <span className="font-black text-white">{item.name}</span>
                  <span className="mt-1 text-xs font-semibold text-white/70">
                    {item.count} memories in feed
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#D8DEE6] bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <UserPlus size={20} className="text-[#F6AD55]" />
            <h3 className="text-xl font-black text-[#002045]">
              Suggested Travelers
            </h3>
          </div>

          <div className="space-y-5">
            {[
              ["Chloe Bergson", "Alpine Specialist", "C"],
              ["Liam West", "Visual Storyteller", "L"],
              ["Mira Stone", "Hidden Trails", "M"],
            ].map(([name, role, initial]) => (
              <div key={name} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-50 font-black text-[#F6AD55]">
                    {initial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#002045]">
                      {name}
                    </p>
                    <p className="truncate text-xs text-[#002045]/50">{role}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="rounded-full border border-[#1A365D]/15 px-3 py-1 text-xs font-black text-[#1A365D] transition hover:bg-[#1A365D] hover:text-white"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-[#1A365D] p-6 text-white shadow-[0_20px_60px_rgba(0,32,69,0.18)]">
          <div className="mb-5 flex items-center gap-2">
            <Star size={20} className="fill-[#F6AD55] text-[#F6AD55]" />
            <h3 className="text-xl font-black">My Bucket List</h3>
          </div>

          <div className="space-y-4">
            {[
              ["Antarctica Expedition", "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=300&auto=format&fit=crop"],
              ["Socotra Island", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=300&auto=format&fit=crop"],
            ].map(([title, image]) => (
              <Link
                key={title}
                to="/bucket-list"
                className="group flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={image}
                    alt={title}
                    className="h-12 w-12 rounded-2xl object-cover"
                  />
                  <span className="text-sm font-semibold text-white/90">
                    {title}
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="text-white/30 transition group-hover:text-[#F6AD55]"
                />
              </Link>
            ))}
          </div>

          <Link
            to="/bucket-list"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 py-3 text-sm font-black transition hover:bg-white/10"
          >
            <Compass size={16} />
            Plan New Goal
          </Link>
        </section>
      </div>
    </aside>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-[#F7FAFC] p-3">
      <p className="text-lg font-black text-[#002045]">{value}</p>
      <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#002045]/40">
        {label}
      </p>
    </div>
  );
}

function getTrendingPlaces(memories) {
  const images = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop",
  ];

  const cityMap = memories.reduce((acc, memory) => {
    const name = memory.city || memory.country;
    if (!name) return acc;

    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const realPlaces = Object.entries(cityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count], index) => ({
      name,
      count,
      image: images[index],
    }));

  if (realPlaces.length > 0) return realPlaces;

  return [
    { name: "Iceland", count: "4.2k", image: images[0] },
    { name: "Dolomites", count: "3.8k", image: images[1] },
    { name: "Spiti Valley", count: "2.4k", image: images[2] },
  ];
}

export default RightSidebar;