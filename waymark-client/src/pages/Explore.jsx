import { useEffect, useState } from "react";
import { ImageOff, MapPin, Search, UserRound, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import TopNavbar from "../components/navigation/TopNavbar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
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
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <TopNavbar />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-8">
        <h1 className="text-4xl font-bold">Explore</h1>

        <p className="mt-2 text-[#002045]/60">
          Search travelers, cities, countries, and memories.
        </p>

        <div className="relative mt-8">
          <Search
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#002045]/40"
          />

          <input
            value={query}
            onChange={handleSearchChange}
            placeholder="Search Delhi, Manali, Akash..."
            className="w-full rounded-3xl border border-[#D8DEE6] bg-white py-5 pl-14 pr-14 text-lg outline-none transition focus:border-[#F6AD55]"
          />

          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#002045]/40 transition hover:bg-[#F1F5F9] hover:text-[#002045]"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {quickSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleQuickSearch(item)}
              className="shrink-0 rounded-full border border-[#D8DEE6] bg-white px-4 py-2 text-sm font-medium text-[#002045]/70 transition hover:border-[#F6AD55] hover:text-[#F6AD55]"
            >
              {item}
            </button>
          ))}
        </div>

        {query && (
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2">
            {[
              { id: "all", label: "All" },
              { id: "memories", label: `Memories (${memories.length})` },
              { id: "travelers", label: `Travelers (${users.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-full px-5 py-2.5 font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-[#F6AD55] text-white shadow-md"
                    : "bg-white text-[#002045]/65 hover:text-[#002045]"
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
            className={`mt-10 grid grid-cols-1 gap-8 ${
              showUsers && showMemories ? "lg:grid-cols-2" : "lg:grid-cols-1"
            }`}
          >
            {showUsers && (
              <section className="rounded-3xl border border-[#D8DEE6] bg-white p-6">
                <h2 className="text-2xl font-bold">Travelers</h2>

                <div className="mt-5 space-y-4">
                  {users.length === 0 ? (
                    <p className="text-[#002045]/55">No travelers found.</p>
                  ) : (
                    users.map((user) => (
                      <Link
                        key={user._id}
                        to={`/profile/${user._id}`}
                        className="flex items-center gap-4 rounded-2xl bg-[#F7FAFC] p-4 transition hover:-translate-y-0.5 hover:bg-[#EEF4FA] hover:shadow-sm"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A365D] text-lg font-bold text-white">
                          {user.username?.charAt(0).toUpperCase() || (
                            <UserRound size={20} />
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold text-[#002045]">
                            {user.fullName || user.username}
                          </h3>

                          <p className="text-sm text-[#002045]/50">
                            @{user.username}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </section>
            )}

            {showMemories && (
              <section className="rounded-3xl border border-[#D8DEE6] bg-white p-6">
                <h2 className="text-2xl font-bold">Memories</h2>

                <div className="mt-5 space-y-4">
                  {memories.length === 0 ? (
                    <p className="text-[#002045]/55">No memories found.</p>
                  ) : (
                    memories.map((memory) => {
                      const image =
                        memory.images?.[0]?.url || memory.images?.[0];

                      return (
                        <Link
                          key={memory._id}
                          to={`/memories/${memory._id}`}
                          className="flex gap-4 rounded-2xl bg-[#F7FAFC] p-4 transition hover:-translate-y-0.5 hover:bg-[#EEF4FA] hover:shadow-sm"
                        >
                          {image ? (
                            <img
                              src={image}
                              alt={memory.title}
                              className="h-20 w-24 rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="flex h-20 w-24 items-center justify-center rounded-2xl bg-[#E8EDF2] text-[#002045]/40">
                              <ImageOff size={22} />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-1 font-semibold text-[#002045]">
                              {memory.title}
                            </h3>

                            <p className="mt-1 flex items-center gap-1 text-sm text-[#F6AD55]">
                              <MapPin size={14} />
                              {memory.city}, {memory.country}
                            </p>

                            <p className="mt-2 line-clamp-2 text-sm text-[#002045]/60">
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
          <div className="mt-10 rounded-3xl border border-dashed border-[#D8DEE6] bg-white p-10 text-center">
            <h2 className="text-2xl font-bold">Start exploring WayMark</h2>
            <p className="mt-3 text-[#002045]/60">
              Search for a city, country, traveler, or memory.
            </p>
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default Explore;
