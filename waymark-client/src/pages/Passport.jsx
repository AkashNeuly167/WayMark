import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Plus,
  Route,
  ShieldCheck,
  Stamp,
} from "lucide-react";

import { getMemories } from "../services/memory.service";
import { useAuth } from "../context/AuthContext";

const normalizePlaceName = (value) => {
  const cleanValue = String(value || "").trim();

  if (!cleanValue) return "";

  return cleanValue
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getUniquePlaces = (memories, key) => {
  const placeMap = new Map();

  memories.forEach((memory) => {
    const normalizedName = normalizePlaceName(memory[key]);

    if (!normalizedName) return;

    placeMap.set(normalizedName.toLowerCase(), normalizedName);
  });

  return Array.from(placeMap.values());
};

function Passport() {
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;

  const [memories, setMemories] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchPassportData = async () => {
      if (!currentUserId) {
        setMemories([]);
        return;
      }

      try {
        const data = await getMemories();

        if (ignore) return;

        const allMemories = data.memories || [];

        const myMemories = allMemories.filter((memory) => {
          const authorId = memory.author?._id || memory.author;
          return authorId?.toString() === currentUserId?.toString();
        });

        setMemories(myMemories);
      } catch (error) {
        console.error("Passport fetch error:", error);

        if (!ignore) {
          setMemories([]);
        }
      }
    };

    fetchPassportData();

    return () => {
      ignore = true;
    };
  }, [currentUserId]);

  const loading = memories === null;
  const safeMemories = useMemo(() => {
    return memories || [];
  }, [memories]);

  const countries = useMemo(() => {
    return getUniquePlaces(safeMemories, "country");
  }, [safeMemories]);

  const cities = useMemo(() => {
    return getUniquePlaces(safeMemories, "city");
  }, [safeMemories]);

  const recentStamps = useMemo(() => {
    return safeMemories
      .filter((memory) => memory.country || memory.city || memory.locationName)
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 4);
  }, [safeMemories]);

  const totalLikes = useMemo(() => {
    return safeMemories.reduce((total, memory) => {
      return total + (memory.likes?.length || 0);
    }, 0);
  }, [safeMemories]);

  const displayName = user?.fullName || user?.username || "WayMark Traveler";
  const username = user?.username ? `@${user.username}` : "@traveler";
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "New traveler";

  const homeCountry = user?.country || countries[0] || "Unknown";

  const initials = displayName
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const passportId = `WM-${(user?.username || "TRAVELER")
    .slice(0, 8)
    .toUpperCase()}-${String(safeMemories.length + cities.length).padStart(
    3,
    "0",
  )}`;

  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="mx-auto flex max-w-[880px] justify-center px-4 pb-28 pt-5 md:px-8 md:pt-7">
        <section className="w-full rounded-[2.5rem] border border-white/10 bg-[#0B0D12] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.45)] md:p-7">
          <div className="mb-5 flex items-center justify-between px-2">
            <p className="text-sm font-black uppercase tracking-[0.32em] text-slate-600 md:text-base">
              Passport
            </p>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#C59B57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
            </div>
          </div>

          {loading ? (
            <PassportLoading />
          ) : (
            <>
              <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#15161B]">
                <div className="border-b border-white/10 p-5 md:p-7">
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-500">
                    WayMark · Travel Document
                  </p>

                  <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#1E2028] text-3xl font-serif text-[#C59B57]">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <h1 className="truncate font-serif text-3xl font-bold text-white md:text-4xl">
                        {displayName}
                      </h1>

                      <p className="mt-2 text-sm font-semibold text-slate-500 md:text-base">
                        {username} · Memory Maker
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-slate-400">
                          <ShieldCheck size={14} />
                          Public Traveler
                        </span>

                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-black text-slate-400">
                          <CalendarDays size={14} />
                          Since {joinedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid border-b border-white/10 md:grid-cols-3">
                  <PassportInfo label="Passport ID" value={passportId} />
                  <PassportInfo label="Home Country" value={homeCountry} />
                  <PassportInfo label="Entries" value={safeMemories.length} />
                </div>

                <div className="bg-[#0B0D12]/65 p-5 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-700 md:p-6">
                  <p>
                    P&lt;WMK
                    TRAVELER&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  </p>
                  <p className="mt-2">
                    {passportId.replace(/-/g, "")}
                    {`<${countries.length}C${cities.length}V${safeMemories.length}M`}
                  </p>
                </div>
              </section>

              <section className="mt-8">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-600">
                      Stamps & Places
                    </p>

                    <h2 className="mt-1 text-xl font-black text-white">
                      Recent WayMarks
                    </h2>
                  </div>

                  <Link
                    to="/journeys"
                    className="inline-flex items-center gap-1 text-sm font-black text-[#C59B57] transition hover:text-[#F6AD55]"
                  >
                    View all
                    <ArrowUpRight size={15} />
                  </Link>
                </div>

                {recentStamps.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {recentStamps.map((memory, index) => (
                      <StampCard
                        key={memory._id}
                        memory={memory}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-[#15161B] p-8 text-center">
                    <Stamp className="mx-auto text-[#C59B57]" size={30} />

                    <p className="mt-3 font-black text-white">
                      No stamps collected yet
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Create memories to stamp your passport.
                    </p>
                  </div>
                )}
              </section>

              <section className="mt-8">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-slate-600">
                  Travel Stats
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <TravelStat value={countries.length} label="Countries" />
                  <TravelStat value={cities.length} label="Cities" />
                  <TravelStat value={safeMemories.length} label="Memories" />
                </div>
              </section>

              <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-emerald-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Active Passport
                </div>

                <p className="hidden font-mono text-xs uppercase tracking-[0.2em] text-slate-600 sm:block">
                  Likes {totalLikes}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Link
                  to="/journeys"
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-transparent font-black text-white transition hover:border-[#C59B57]/40 hover:bg-white/[0.04]"
                >
                  <Route size={18} />
                  View Journey
                </Link>

                <Link
                  to="/memories/create"
                  className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#C59B57]/40 bg-[#C59B57]/10 font-black text-[#F6AD55] transition hover:bg-[#C59B57]/20"
                >
                  <Plus size={18} />
                  Add Stamp
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function PassportInfo({ label, value }) {
  return (
    <div className="border-b border-white/10 p-5 md:border-b-0 md:border-r md:last:border-r-0">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-600">
        {label}
      </p>

      <p className="mt-3 truncate font-mono text-base font-black text-slate-300">
        {value}
      </p>
    </div>
  );
}

function StampCard({ memory, index }) {
  const types = ["entry", "memory", "route", "place"];
  const type = types[index % types.length];

  const typeClassMap = {
    entry: "border-emerald-500/25 text-emerald-400",
    memory: "border-[#C59B57]/30 text-[#C59B57]",
    route: "border-blue-500/25 text-blue-400",
    place: "border-red-500/25 text-red-400",
  };

  const colorClass = typeClassMap[type];

  const createdDate = memory.createdAt
    ? new Date(memory.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <Link
      to={`/memories/${memory._id}`}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#15161B] p-5 transition hover:-translate-y-0.5 hover:border-[#C59B57]/35 hover:bg-[#1B1D24]"
    >
      <div
        className={`absolute -right-5 -top-6 h-16 w-16 rounded-full border-2 ${colorClass}`}
      />

      <p
        className={`text-[11px] font-black uppercase tracking-[0.22em] ${colorClass}`}
      >
        {type}
      </p>

      <h3 className="mt-4 truncate text-xl font-black text-white">
        {memory.country || memory.city || "Unknown Place"}
      </h3>

      <p className="mt-1 truncate text-sm font-semibold text-slate-500">
        {memory.city || memory.locationName || memory.title}
      </p>

      <p className="mt-4 font-mono text-sm text-slate-600">{createdDate}</p>
    </Link>
  );
}

function TravelStat({ value, label }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#15161B] p-5 text-center">
      <p className="font-serif text-4xl font-bold text-white">{value}</p>

      <p className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-xs font-black text-[#C59B57]">collected</p>
    </div>
  );
}

function PassportLoading() {
  return (
    <div className="space-y-5">
      <div className="h-80 animate-pulse rounded-[2rem] border border-white/10 bg-[#15161B]" />

      <div className="grid grid-cols-2 gap-3">
        <div className="h-28 animate-pulse rounded-3xl border border-white/10 bg-[#15161B]" />
        <div className="h-28 animate-pulse rounded-3xl border border-white/10 bg-[#15161B]" />
      </div>

      <div className="h-32 animate-pulse rounded-3xl border border-white/10 bg-[#15161B]" />
    </div>
  );
}

export default Passport;
