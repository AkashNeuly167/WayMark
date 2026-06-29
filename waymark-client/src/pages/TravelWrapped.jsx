import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Camera,
  Compass,
  Globe2,
  Heart,
  Loader2,
  MapIcon,
  MapPin,
  MessageCircle,
  PlusCircle,
  Route,
  Sparkles,
  Trophy,
} from "lucide-react";

import { getTravelWrapped } from "../services/travelWrapped.service";
import { useToast } from "../context/useToast";
import { useAuth } from "../context/AuthContext";

function TravelWrapped() {
  const { showToast } = useToast();
  const { user } = useAuth();

  const currentYear = new Date().getFullYear();

  const [year, setYear] = useState(currentYear);
  const [wrappedData, setWrappedData] = useState(null);

  const wrapped = wrappedData?.wrapped;
  const loading = !wrappedData || wrappedData.year !== year;

  useEffect(() => {
    let ignore = false;

    const fetchWrapped = async () => {
      try {
        const data = await getTravelWrapped(year);

        if (ignore) return;

        setWrappedData({
          year,
          wrapped: data.wrapped,
        });
      } catch (error) {
        if (ignore) return;

        console.error("Travel wrapped fetch error:", error);

        showToast({
          type: "error",
          title: "Failed",
          message: "Could not load your travel wrapped.",
        });

        setWrappedData({
          year,
          wrapped: null,
        });
      }
    };

    fetchWrapped();

    return () => {
      ignore = true;
    };
  }, [year, showToast]);

  const countries = useMemo(() => {
    const rawCountries = wrapped?.countries || [];
    const countryMap = new Map();

    rawCountries.forEach((country) => {
      const cleanCountry = String(country || "").trim();

      if (!cleanCountry) return;

      const key = cleanCountry.toLowerCase();

      if (!countryMap.has(key)) {
        countryMap.set(key, cleanCountry);
      }
    });

    return Array.from(countryMap.values());
  }, [wrapped]);

  const countryCount = countries.length;

  const topMemory = wrapped?.topMemory;
  const topMemoryImage = topMemory?.images?.[0]?.url || topMemory?.images?.[0];

  const displayName = user?.fullName || user?.username || "Traveler";
  const username = user?.username ? `@${user.username}` : "@waymarker";

  const memoriesCount = wrapped?.memoriesCreated || 0;
  const citiesCount = wrapped?.citiesVisited || 0;
  const likesCount = wrapped?.totalLikes || 0;
  const commentsCount = wrapped?.totalComments || 0;
  const engagementCount = likesCount + commentsCount;

  const travelerType = getTravelerType({
    memoriesCount,
    countryCount,
    citiesCount,
    likesCount,
  });

  const stats = [
    {
      label: "Memories",
      value: memoriesCount,
      helper: "saved this year",
      icon: Camera,
    },
    {
      label: "Countries",
      value: countryCount,
      helper: "stamped",
      icon: Globe2,
    },
    {
      label: "Cities",
      value: citiesCount,
      helper: "explored",
      icon: MapPin,
    },
    {
      label: "Love",
      value: engagementCount,
      helper: "likes & comments",
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="mx-auto max-w-[1180px] px-4 pb-28 pt-5 md:px-8 md:pt-7">
        <section className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#101D2E] shadow-[0_24px_90px_rgba(0,0,0,0.32)]">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-[#F6AD55]/20 blur-[100px]" />
          <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-blue-500/10 blur-[110px]" />

          <div className="relative grid gap-8 p-5 md:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
            <div className="flex min-h-[560px] flex-col justify-between rounded-[2rem] border border-white/10 bg-[#06111F] p-5 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-0.5 w-14 bg-gradient-to-r from-[#F6AD55] to-transparent md:w-20" />

                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#F6AD55]">
                    {year} Recap
                  </span>
                </div>

                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="dark-input rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black !text-white outline-none transition focus:border-[#F6AD55]/60"
                >
                  <option className="text-[#06111F]" value={currentYear}>
                    {currentYear}
                  </option>
                  <option className="text-[#06111F]" value={currentYear - 1}>
                    {currentYear - 1}
                  </option>
                  <option className="text-[#06111F]" value={currentYear - 2}>
                    {currentYear - 2}
                  </option>
                </select>
              </div>

              <div className="py-14 md:py-20">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F6AD55]/25 bg-[#F6AD55]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                  <Sparkles size={15} />
                  Travel Wrapped
                </div>

                <h1 className="font-serif text-5xl font-black leading-[0.92] tracking-tight text-white md:text-7xl">
                  Your
                  <br />
                  <span className="italic text-[#F6AD55]">Travel</span>
                  <br />
                  Wrapped
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 md:text-lg">
                  {getWrappedHeadline({
                    year,
                    memoriesCount,
                    countryCount,
                    citiesCount,
                  })}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-full border border-[#F6AD55]/30 bg-[#101D2E] text-lg font-black text-[#F6AD55]">
                  {displayName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-black text-white">
                    {displayName}
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-500">
                    {username} · {travelerType}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="relative min-h-[280px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#06111F] md:min-h-[360px] lg:min-h-full">
                {topMemoryImage ? (
                  <img
                    src={topMemoryImage}
                    alt={topMemory?.title || "Top travel memory"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full min-h-[280px] place-items-center bg-[#06111F] text-slate-600">
                    <Camera size={42} />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#06111F] via-[#06111F]/35 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#F6AD55]">
                    Top Memory
                  </p>

                  <h2 className="mt-2 line-clamp-2 font-serif text-3xl font-bold text-white md:text-4xl">
                    {topMemory?.title || "No top memory yet"}
                  </h2>

                  {topMemory ? (
                    <div className="mt-4 flex flex-wrap gap-2 text-sm font-black">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-white backdrop-blur">
                        <Heart
                          className="fill-red-400 text-red-400"
                          size={15}
                        />
                        {topMemory.likes?.length || 0}
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 text-white backdrop-blur">
                        <MessageCircle size={15} />
                        {topMemory.commentsCount || 0}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      Create memories and collect likes to unlock this section.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <LoadingBlock />
        ) : (
          <>
            <section className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {stats.map((stat) => (
                <WrappedStat key={stat.label} stat={stat} />
              ))}
            </section>

            <section className="mt-7 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-7">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F6AD55]">
                      Traveler Type
                    </p>

                    <h2 className="mt-2 font-serif text-4xl font-black text-white">
                      {travelerType}
                    </h2>
                  </div>

                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F6AD55]/10 text-[#F6AD55]">
                    <Trophy size={28} />
                  </div>
                </div>

                <p className="text-sm leading-7 text-slate-400">
                  {getTravelerTypeDescription({
                    memoriesCount,
                    countryCount,
                    citiesCount,
                    likesCount,
                  })}
                </p>

                <div className="mt-7 space-y-4">
                  <TraitBar
                    icon={<Camera size={16} />}
                    label="Storyteller"
                    value={getTraitScore({
                      type: "story",
                      memoriesCount,
                      citiesCount,
                      engagementCount,
                    })}
                  />

                  <TraitBar
                    icon={<Compass size={16} />}
                    label="Explorer"
                    value={getTraitScore({
                      type: "explore",
                      memoriesCount,
                      citiesCount,
                      engagementCount,
                    })}
                  />

                  <TraitBar
                    icon={<Heart size={16} />}
                    label="Connector"
                    value={getTraitScore({
                      type: "connect",
                      memoriesCount,
                      citiesCount,
                      engagementCount,
                    })}
                  />
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-7">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F6AD55]">
                      Passport Stamps
                    </p>

                    <h2 className="mt-2 font-serif text-4xl font-black text-white">
                      Places from {year}
                    </h2>
                  </div>

                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F6AD55]/10 text-[#F6AD55]">
                    <Globe2 size={28} />
                  </div>
                </div>

                {countries.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {countries.map((country) => (
                      <span
                        key={country}
                        className="rounded-xl border-2 border-dashed border-[#F6AD55]/30 bg-[#F6AD55]/10 px-4 py-2 text-sm font-black text-[#F6AD55]"
                      >
                        {country}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] p-7 text-center">
                    <MapIcon className="mx-auto text-[#F6AD55]" size={34} />

                    <h3 className="mt-4 text-xl font-black text-white">
                      No stamps yet
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Create memories from places you visit to fill this
                      section.
                    </p>
                  </div>
                )}

                <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F6AD55]/10 text-[#F6AD55]">
                      <Route size={22} />
                    </div>

                    <div>
                      <p className="font-black text-white">
                        {citiesCount} city stops became memories
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Every city adds another mark to your yearly travel
                        story.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-7 rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-7">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F6AD55]">
                    Main Moment
                  </p>

                  <h2 className="mt-2 font-serif text-4xl font-black text-white">
                    Top memory of {year}
                  </h2>
                </div>

                {topMemory && (
                  <Link
                    to={`/memories/${topMemory._id}`}
                    className="text-sm font-black text-[#F6AD55] transition hover:text-orange-300"
                  >
                    Open memory
                  </Link>
                )}
              </div>

              {topMemory ? (
                <Link
                  to={`/memories/${topMemory._id}`}
                  className="group grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] transition hover:-translate-y-0.5 hover:border-[#F6AD55]/35 md:grid-cols-[320px_1fr] lg:grid-cols-[420px_1fr]"
                >
                  <div className="h-72 overflow-hidden bg-[#06111F] md:h-full">
                    {topMemoryImage ? (
                      <img
                        src={topMemoryImage}
                        alt={topMemory.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-slate-600">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-6 md:p-8">
                    {(topMemory.city || topMemory.country) && (
                      <div className="mb-4 flex items-center gap-2 text-sm font-black text-[#F6AD55]">
                        <MapPin size={16} />
                        {[topMemory.city, topMemory.country]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}

                    <h3 className="font-serif text-3xl font-bold leading-tight text-white md:text-4xl">
                      {topMemory.title}
                    </h3>

                    <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-400 md:text-base">
                      {topMemory.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm font-black">
                      <span className="inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-red-300">
                        <Heart size={16} />
                        {topMemory.likes?.length || 0} likes
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full border border-[#F6AD55]/20 bg-[#F6AD55]/10 px-4 py-2 text-[#F6AD55]">
                        <MessageCircle size={16} />
                        {topMemory.commentsCount || 0} comments
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/[0.04] p-10 text-center">
                  <Award className="mx-auto text-[#F6AD55]" size={34} />

                  <h3 className="mt-4 text-2xl font-black text-white">
                    No top memory yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                    Share memories and collect likes to unlock your top memory
                    for this year.
                  </p>
                </div>
              )}
            </section>

            <section className="mt-7 grid gap-4 md:grid-cols-2">
              <Link
                to="/journeys"
                className="flex min-h-36 items-center justify-between rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 transition hover:border-[#F6AD55]/30 hover:bg-[#14243A]"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                    Continue
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-white">
                    View Your Journey
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    See your route timeline and places.
                  </p>
                </div>

                <MapIcon className="text-[#F6AD55]" size={32} />
              </Link>

              <Link
                to="/memories/create"
                className="flex min-h-36 items-center justify-between rounded-[2rem] border border-[#F6AD55]/25 bg-[#F6AD55]/10 p-6 transition hover:bg-[#F6AD55]/15"
              >
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                    Next Story
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-white">
                    Create Memory
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Add another moment to WayMark.
                  </p>
                </div>

                <PlusCircle className="text-[#F6AD55]" size={32} />
              </Link>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function WrappedStat({ stat }) {
  const Icon = stat.icon;

  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-[#101D2E] p-4 shadow-[0_12px_35px_rgba(0,0,0,0.16)] transition hover:border-[#F6AD55]/30 hover:bg-[#14243A] md:p-5">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-[#F6AD55]/10 text-[#F6AD55]">
        <Icon size={19} />
      </div>

      <p className="font-serif text-3xl font-black leading-none text-white md:text-4xl">
        {stat.value}
      </p>

      <p className="mt-2 text-sm font-black text-slate-200">{stat.label}</p>

      <p className="mt-1 text-[11px] font-semibold text-slate-600 md:text-xs">
        {stat.helper}
      </p>
    </div>
  );
}

function TraitBar({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-left">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F6AD55]/10 text-[#F6AD55]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex justify-between">
          <span className="text-sm font-black text-white">{label}</span>
          <span className="text-sm font-black text-[#F6AD55]">{value}%</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F6AD55] to-orange-300"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="mt-7 flex items-center justify-center rounded-[2rem] border border-white/10 bg-[#101D2E] p-10 text-slate-400">
      <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#F6AD55]" />
      Loading travel wrapped...
    </div>
  );
}

function getWrappedHeadline({
  year,
  memoriesCount,
  countryCount,
  citiesCount,
}) {
  if (memoriesCount === 0) {
    return `Your ${year} travel story has not started yet. Create memories and your wrapped will come alive.`;
  }

  return `A year of ${memoriesCount} memories, ${citiesCount} cities, and ${countryCount} countries that became part of your travel story.`;
}

function getTravelerType({
  memoriesCount,
  countryCount,
  citiesCount,
  likesCount,
}) {
  if (memoriesCount === 0) {
    return "New Explorer";
  }

  if (countryCount >= 3) {
    return "Globe Hopper";
  }

  if (likesCount >= 20) {
    return "Story Magnet";
  }

  if (citiesCount >= 3) {
    return "City Collector";
  }

  return "Memory Maker";
}

function getTravelerTypeDescription({
  memoriesCount,
  countryCount,
  citiesCount,
  likesCount,
}) {
  if (memoriesCount === 0) {
    return "Your wrapped will evolve as you create memories, collect likes, and stamp new places.";
  }

  if (countryCount >= 3) {
    return "You crossed borders, collected stories, and turned your year into a true travel map.";
  }

  if (likesCount >= 20) {
    return "Your stories connected with people. This was a year where your memories stood out.";
  }

  if (citiesCount >= 3) {
    return "You moved through cities and turned each stop into a documented memory.";
  }

  return "You started building a travel archive, one memory at a time.";
}

function getTraitScore({ type, memoriesCount, citiesCount, engagementCount }) {
  if (memoriesCount === 0) {
    if (type === "story") return 35;
    if (type === "explore") return 30;
    return 25;
  }

  if (type === "story") {
    return Math.min(95, 45 + memoriesCount * 8);
  }

  if (type === "explore") {
    return Math.min(95, 45 + citiesCount * 10);
  }

  return Math.min(95, 35 + Math.floor(engagementCount / 2));
}

export default TravelWrapped;
