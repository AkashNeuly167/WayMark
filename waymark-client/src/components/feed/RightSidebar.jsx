function RightSidebar() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-7">
        <div className="rounded-[28px] border border-[#D8DEE6] bg-white p-7 text-center shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
            className="mx-auto h-20 w-20 rounded-full object-cover"
            alt="Leo Vance"
          />

          <h3 className="mt-5 text-2xl font-bold text-[#002045]">Leo Vance</h3>

          <p className="text-sm text-[#002045]/60">
            Elite Mountaineer • 24 Journeys
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="font-bold text-[#002045]">14k</p>
              <p className="text-xs uppercase text-[#002045]/50">Followers</p>
            </div>

            <div>
              <p className="font-bold text-[#002045]">820</p>
              <p className="text-xs uppercase text-[#002045]/50">Following</p>
            </div>

            <div>
              <p className="font-bold text-[#002045]">156</p>
              <p className="text-xs uppercase text-[#002045]/50">Posts</p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-[#F7FAFC] p-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#002045]">Trending Now</h3>
            <button className="text-sm font-semibold text-[#F6AD55]">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "Yosemite Valley",
                sub: "8.4k explorers this week",
                img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=300",
              },
              {
                name: "St. Moritz",
                sub: "5.1k explorers this week",
                img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=300",
              },
              {
                name: "Male Atoll",
                sub: "4.2k explorers this week",
                img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=300",
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-4 border-b border-[#D8DEE6] pb-4"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />

                <div>
                  <h4 className="font-semibold text-[#002045]">{item.name}</h4>
                  <p className="text-sm text-[#002045]/55">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-[#1A365D] p-6 text-white shadow-lg">
          <h3 className="text-2xl font-bold">
            My Bucket
            <br />
            List
          </h3>

          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=200"
                className="h-12 w-12 rounded-xl object-cover"
                alt=""
              />
              <span className="text-sm">Antarctica Expedition</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=200"
                className="h-12 w-12 rounded-xl object-cover"
                alt=""
              />
              <span className="text-sm">Socotra Island</span>
            </div>
          </div>

          <button className="mt-6 w-full rounded-xl border border-white/20 py-3 text-sm font-bold hover:bg-white/10">
            Plan New Goal
          </button>
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
