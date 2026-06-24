import { useEffect, useState } from "react";
import { ImageOff, MapPin, Search, UserRound, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { searchMemories, searchUsers } from "../services/search.service";
import ExploreSkeleton from "../components/ui/ExploreSkeleton";

const quickSearches = [
  "Delhi",
  "Manali",
  "Spiti",
  "India",
  "Mountains",
  "Beach",
];

function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [users, setUsers] = useState([]);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const showUsers = activeTab === "all" || activeTab === "travelers";
  const showMemories = activeTab === "all" || activeTab === "memories";

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setActiveTab("all");

    if (value.trim()) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
      setUsers([]);
      setMemories([]);
    }
  };

  const handleQuickSearch = (item) => {
    setSearchParams({ q: item });
    setActiveTab("all");
  };

  const handleClearSearch = () => {
    setSearchParams({});
    setUsers([]);
    setMemories([]);
    setActiveTab("all");
    setLoading(false);
  };

  const getAvatarUrl = (person) => {
    if (!person?.avatar) return "";
    return typeof person.avatar === "string"
      ? person.avatar
      : person.avatar.url;
  };

  useEffect(() => {
    const searchQuery = query.trim();

    if (!searchQuery) return;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const usersRes = await searchUsers(searchQuery);
        const memoriesRes = await searchMemories(searchQuery);

        setUsers(usersRes.users || []);
        setMemories(memoriesRes.memories || []);
      } catch (error) {
        console.error("Explore search error:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 md:px-8 md:pt-7">
        <section className="mb-7 overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)] md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F6AD55]">
                Discover WayMark
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl">
                Explore
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-400 md:text-base">
                Search travelers, cities, countries, and memories from the
                WayMark community.
              </p>
            </div>
          </div>

          <div className="relative mt-6">
            <Search
              size={21}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
            />

           <input
  value={query}
  onChange={handleSearchChange}
  placeholder="Search Delhi, Manali, Akash..."
  className="w-full rounded-2xl border border-white/10 bg-[#06111F] py-4 pl-14 pr-14 text-base font-semibold !text-white caret-[#F6AD55] outline-none transition placeholder:font-semibold placeholder:!text-slate-500 focus:border-[#F6AD55]/60 focus:ring-4 focus:ring-[#F6AD55]/10 md:rounded-3xl md:py-5 md:text-lg"
/>

            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition hover:bg-white/10 hover:text-white"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {quickSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickSearch(item)}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-black text-slate-300 transition hover:border-[#F6AD55]/50 hover:bg-[#F6AD55]/10 hover:text-[#F6AD55]"
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {query && (
          <div className="mb-7 flex gap-2 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All" },
              { id: "memories", label: `Memories (${memories.length})` },
              { id: "travelers", label: `Travelers (${users.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-black transition ${
                  activeTab === tab.id
                    ? "bg-[#F6AD55] text-[#06111F] shadow-[0_12px_30px_rgba(246,173,85,0.22)]"
                    : "border border-white/10 bg-[#101D2E] text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {loading && <ExploreSkeleton />}

        {!loading && query && (
          <div
            className={`grid grid-cols-1 gap-6 ${
              showUsers && showMemories ? "lg:grid-cols-2" : "lg:grid-cols-1"
            }`}
          >
            {showUsers && (
              <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                      People
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-white">
                      Travelers
                    </h2>
                  </div>

                  <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-black text-slate-400">
                    {users.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {users.length === 0 ? (
                    <EmptyMini message="No travelers found." />
                  ) : (
                    users.map((foundUser) => {
                      const avatarUrl = getAvatarUrl(foundUser);

                      return (
                        <Link
                          key={foundUser._id}
                          to={`/profile/${foundUser._id}`}
                          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-[#F6AD55]/30 hover:bg-white/[0.07]"
                        >
                          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#F6AD55] to-orange-600 text-lg font-black text-white ring-1 ring-white/10">
                            {avatarUrl ? (
                              <img
                                src={avatarUrl}
                                alt={foundUser.username}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              foundUser.username?.charAt(0).toUpperCase() || (
                                <UserRound size={20} />
                              )
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-black text-white">
                              {foundUser.fullName || foundUser.username}
                            </h3>

                            <p className="text-sm font-semibold text-slate-500">
                              @{foundUser.username}
                            </p>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </section>
            )}

            {showMemories && (
              <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                      Stories
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-white">
                      Memories
                    </h2>
                  </div>

                  <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-black text-slate-400">
                    {memories.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {memories.length === 0 ? (
                    <EmptyMini message="No memories found." />
                  ) : (
                    memories.map((memory) => {
                      const image =
                        memory.images?.[0]?.url || memory.images?.[0];

                      return (
                        <Link
                          key={memory._id}
                          to={`/memories/${memory._id}`}
                          className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:-translate-y-0.5 hover:border-[#F6AD55]/30 hover:bg-white/[0.07]"
                        >
                          <div className="h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#06111F] ring-1 ring-white/10">
                            {image ? (
                              <img
                                src={image}
                                alt={memory.title}
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-slate-600">
                                <ImageOff size={22} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 py-1">
                            <h3 className="line-clamp-1 font-black text-white">
                              {memory.title}
                            </h3>

                            {(memory.city || memory.country) && (
                              <p className="mt-1 flex items-center gap-1 text-sm font-black text-[#F6AD55]">
                                <MapPin size={14} />
                                <span className="truncate">
                                  {[memory.city, memory.country]
                                    .filter(Boolean)
                                    .join(", ")}
                                </span>
                              </p>
                            )}

                            <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-400">
                              {memory.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {!query && (
          <section className="rounded-[2rem] border border-dashed border-white/10 bg-[#101D2E] p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.18)] md:p-10">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F6AD55]/15 text-[#F6AD55]">
              <Search size={26} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-white">
              Start exploring WayMark
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Search for a city, country, traveler, or memory. Try quick
              searches like Spiti, Mountains, or Manali.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

function EmptyMini({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
      <p className="text-sm font-semibold text-slate-500">{message}</p>
    </div>
  );
}

export default Explore;