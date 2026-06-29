import { useEffect, useMemo, useState } from "react";
import { ImageOff, MapPin, Search, UserRound, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { searchMemories, searchUsers } from "../services/search.service";
import { getMemories } from "../services/memory.service";
import ExploreSkeleton from "../components/ui/ExploreSkeleton";

const quickSearches = [
  "Delhi",
  "Manali",
  "Spiti",
  "India",
  "Mountains",
  "Beach",
];

const markerIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      height: 34px;
      width: 34px;
      border-radius: 999px;
      background: #F6AD55;
      border: 4px solid rgba(6,17,31,0.95);
      box-shadow: 0 14px 34px rgba(0,0,0,0.35);
      display: grid;
      place-items: center;
    ">
      <div style="
        height: 9px;
        width: 9px;
        border-radius: 999px;
        background: #06111F;
      "></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -16],
});

function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [users, setUsers] = useState([]);
  const [memories, setMemories] = useState([]);
  const [allMemories, setAllMemories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("memories");

  const searchQuery = query.trim();
  const isSearching = Boolean(searchQuery) && loading;

  const showUsers = activeTab === "all" || activeTab === "travelers";
  const showMemories = activeTab === "all" || activeTab === "memories";

  useEffect(() => {
    let ignore = false;

    const fetchInitialMemories = async () => {
      try {
        const data = await getMemories();

        if (ignore) return;

        setAllMemories(data.memories || []);
      } catch (error) {
        console.error("Explore initial memories error:", error);

        if (!ignore) {
          setAllMemories([]);
        }
      } finally {
        if (!ignore) {
          setInitialLoading(false);
        }
      }
    };

    fetchInitialMemories();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!searchQuery) return;

    let ignore = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const usersRes = await searchUsers(searchQuery);
        const memoriesRes = await searchMemories(searchQuery);

        if (ignore) return;

        setUsers(usersRes.users || []);
        setMemories(memoriesRes.memories || []);
      } catch (error) {
        if (ignore) return;

        console.error("Explore search error:", error);
        setUsers([]);
        setMemories([]);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const visibleMemories = searchQuery ? memories : allMemories;

  const mappedMemories = useMemo(() => {
    return visibleMemories
      .map((memory) => {
        const coords = getMemoryCoordinates(memory);

        if (!coords) return null;

        return {
          ...memory,
          mapLat: coords.lat,
          mapLng: coords.lng,
        };
      })
      .filter(Boolean);
  }, [visibleMemories]);

  const mapCenter = useMemo(() => {
    if (mappedMemories.length > 0) {
      return [mappedMemories[0].mapLat, mappedMemories[0].mapLng];
    }

    return [22.9734, 78.6569];
  }, [mappedMemories]);

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setActiveTab("memories");

    if (value.trim()) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
      setUsers([]);
      setMemories([]);
      setLoading(false);
    }
  };

  const handleQuickSearch = (item) => {
    setSearchParams({ q: item });
    setActiveTab("memories");
  };

  const handleClearSearch = () => {
    setSearchParams({});
    setUsers([]);
    setMemories([]);
    setActiveTab("memories");
    setLoading(false);
  };

  const getAvatarUrl = (person) => {
    if (!person?.avatar) return "";

    return typeof person.avatar === "string"
      ? person.avatar
      : person.avatar.url;
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-5 md:px-8 md:pt-7">
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)] md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F6AD55]">
                Map Explore
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl">
                Discover places
              </h1>

              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-400 md:text-base">
                Explore memories by location. Search cities, countries,
                travelers, or places from the WayMark community.
              </p>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-black text-slate-400">
              {mappedMemories.length} mapped memories
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
              className="dark-input w-full rounded-2xl border border-white/10 bg-[#06111F] py-4 pl-14 pr-14 text-base font-semibold !text-white caret-[#F6AD55] outline-none transition placeholder:font-semibold placeholder:!text-slate-500 focus:border-[#F6AD55]/60 focus:ring-4 focus:ring-[#F6AD55]/10 md:rounded-3xl md:py-5 md:text-lg"
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
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {[
              { id: "memories", label: `Memories (${memories.length})` },
              { id: "travelers", label: `Travelers (${users.length})` },
              { id: "all", label: "All" },
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

        {(isSearching || initialLoading) && <ExploreSkeleton />}

        {!isSearching && !initialLoading && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
              <div className="flex items-center justify-between border-b border-white/10 p-4 md:p-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                    Live Map
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    Memory locations
                  </h2>
                </div>

                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-black text-slate-400">
                  {mappedMemories.length} pins
                </span>
              </div>

              <div className="relative z-0 h-[420px] bg-[#06111F] md:h-[620px]">
                {mappedMemories.length > 0 ? (
                  <MapContainer
                    center={mapCenter}
                    zoom={searchQuery ? 6 : 4}
                    scrollWheelZoom
                    className="z-0 h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FitMapToMarkers memories={mappedMemories} />

                    {mappedMemories.map((memory) => {
                      const image =
                        memory.images?.[0]?.url || memory.images?.[0];

                      return (
                        <Marker
                          key={memory._id}
                          position={[memory.mapLat, memory.mapLng]}
                          icon={markerIcon}
                        >
                          <Tooltip direction="top" offset={[0, -18]}>
                            {memory.locationName ||
                              memory.city ||
                              memory.country ||
                              memory.title}
                          </Tooltip>

                          <Popup>
                            <div className="w-56">
                              {image && (
                                <img
                                  src={image}
                                  alt={memory.title}
                                  className="mb-2 h-28 w-full rounded-lg object-cover"
                                />
                              )}

                              <p className="font-bold text-slate-900">
                                {memory.title}
                              </p>

                              {(memory.city || memory.country) && (
                                <p className="mt-1 text-xs font-semibold text-slate-600">
                                  {[memory.city, memory.country]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              )}

                              <Link
                                to={`/memories/${memory._id}`}
                                className="mt-3 inline-block rounded-lg bg-[#F6AD55] px-3 py-2 text-xs font-black text-[#06111F]"
                              >
                                Open memory
                              </Link>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                ) : (
                  <div className="grid h-full place-items-center p-8 text-center">
                    <div>
                      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F6AD55]/15 text-[#F6AD55]">
                        <MapPin size={28} />
                      </div>

                      <h3 className="mt-4 text-xl font-black text-white">
                        No mapped memories found
                      </h3>

                      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                        Try another search or create memories with coordinates
                        to show them on Explore.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              {showMemories && (
                <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                        Places
                      </p>

                      <h2 className="mt-1 text-2xl font-black text-white">
                        Memories
                      </h2>
                    </div>

                    <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-black text-slate-400">
                      {visibleMemories.length}
                    </span>
                  </div>

                  <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">
                    {visibleMemories.length === 0 ? (
                      <EmptyMini message="No memories found." />
                    ) : (
                      visibleMemories.map((memory) => (
                        <MemoryResultCard key={memory._id} memory={memory} />
                      ))
                    )}
                  </div>
                </section>
              )}

              {query && showUsers && (
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
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}

function MemoryResultCard({ memory }) {
  const image = memory.images?.[0]?.url || memory.images?.[0];
  const hasCoords = Boolean(getMemoryCoordinates(memory));

  return (
    <Link
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
        <h3 className="line-clamp-1 font-black text-white">{memory.title}</h3>

        {(memory.city || memory.country) && (
          <p className="mt-1 flex items-center gap-1 text-sm font-black text-[#F6AD55]">
            <MapPin size={14} />
            <span className="truncate">
              {[memory.city, memory.country].filter(Boolean).join(", ")}
            </span>
          </p>
        )}

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-400">
          {memory.description}
        </p>

        {!hasCoords && (
          <p className="mt-2 text-xs font-black text-slate-600">
            No map pin available
          </p>
        )}
      </div>
    </Link>
  );
}

function FitMapToMarkers({ memories }) {
  const map = useMap();

  useEffect(() => {
    if (!memories.length) return;

    const bounds = L.latLngBounds(
      memories.map((memory) => [memory.mapLat, memory.mapLng]),
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 9,
    });
  }, [map, memories]);

  return null;
}

function getMemoryCoordinates(memory) {
  const lat = Number(memory?.coordinates?.lat);
  const lng = Number(memory?.coordinates?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

function EmptyMini({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
      <p className="text-sm font-semibold text-slate-500">{message}</p>
    </div>
  );
}

export default Explore;