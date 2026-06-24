import { useEffect, useState } from "react";
import {
  Award,
  BarChart3,
  Camera,
  Compass,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getTravelWrapped } from "../services/travelWrapped.service";
import { useToast } from "../context/useToast";

function TravelWrapped() {
  const { showToast } = useToast();

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

  const topMemory = wrapped?.topMemory;
  const topMemoryImage = topMemory?.images?.[0]?.url || topMemory?.images?.[0];

  const stats = [
    {
      label: "Memories",
      value: wrapped?.memoriesCreated || 0,
      icon: Camera,
    },
    {
      label: "Countries",
      value: wrapped?.countriesVisited || 0,
      icon: MapPin,
    },
    {
      label: "Cities",
      value: wrapped?.citiesVisited || 0,
      icon: Compass,
    },
    {
      label: "Total Likes",
      value: wrapped?.totalLikes || 0,
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 md:px-8 md:pt-7">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_20px_70px_rgba(0,0,0,0.24)]">
          <div className="relative overflow-hidden bg-gradient-to-r from-[#06111F] via-[#1A365D] to-[#F6AD55] p-6 text-white md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_28%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#101D2E]/20" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/15 bg-white/10 backdrop-blur">
                  <Award size={32} />
                </div>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-[#F6AD55]">
                  Year in travel
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tight md:text-6xl">
                  Travel Wrapped
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                  Your personal travel recap for memories, countries, cities,
                  likes, and favorite moments.
                </p>
              </div>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="dark-input w-fit rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm font-black !text-white outline-none backdrop-blur transition focus:border-[#F6AD55]/60 focus:ring-4 focus:ring-[#F6AD55]/10"
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
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-10 text-slate-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#F6AD55]" />
              Loading travel wrapped...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-4 md:p-7">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#F6AD55]/30 hover:bg-white/[0.07]"
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F6AD55]/15 text-[#F6AD55]">
                      <Icon size={24} />
                    </div>

                    <p className="mt-4 text-3xl font-black text-white">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {!loading && (
          <>
            <section className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F6AD55]/15 text-[#F6AD55]">
                    <BarChart3 size={23} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                      Recap
                    </p>
                    <h2 className="text-2xl font-black text-white">
                      Your travel map
                    </h2>
                  </div>
                </div>

                {wrapped?.countries?.length > 0 ? (
                  <div>
                    <p className="mb-4 text-sm leading-6 text-slate-400">
                      Countries you shared memories from in {year}.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {wrapped.countries.map((country) => (
                        <span
                          key={country}
                          className="rounded-full border border-[#F6AD55]/20 bg-[#F6AD55]/10 px-4 py-2 text-sm font-black text-[#F6AD55]"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-6 text-slate-400">
                    No countries yet for this year. Add memories to build your
                    travel wrapped.
                  </p>
                )}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
                <div className="mb-5 flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F6AD55]/15 text-[#F6AD55]">
                    <MessageCircle size={23} />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                      Community
                    </p>
                    <h2 className="text-2xl font-black text-white">
                      Engagement
                    </h2>
                  </div>
                </div>

                <div className="space-y-4">
                  <WrappedMetric
                    label="Total comments"
                    value={wrapped?.totalComments || 0}
                  />

                  <WrappedMetric
                    label="Total likes"
                    value={wrapped?.totalLikes || 0}
                    accent
                  />
                </div>
              </div>
            </section>

            <section className="mt-7 rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F6AD55]/15 text-[#F6AD55]">
                  <Award size={23} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                    Highlight
                  </p>
                  <h2 className="text-2xl font-black text-white">
                    Top memory
                  </h2>
                </div>
              </div>

              {topMemory ? (
                <Link
                  to={`/memories/${topMemory._id}`}
                  className="group grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] transition hover:-translate-y-0.5 hover:border-[#F6AD55]/30 hover:bg-white/[0.07] md:grid-cols-[260px_1fr]"
                >
                  {topMemoryImage ? (
                    <div className="h-56 overflow-hidden bg-[#06111F] md:h-full">
                      <img
                        src={topMemoryImage}
                        alt={topMemory.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-[#06111F] text-slate-600 md:h-full">
                      No image
                    </div>
                  )}

                  <div className="p-5">
                    {(topMemory.city || topMemory.country) && (
                      <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#F6AD55]">
                        <MapPin size={15} />
                        {[topMemory.city, topMemory.country]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}

                    <h3 className="text-2xl font-black text-white">
                      {topMemory.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                      {topMemory.description}
                    </p>

                    <div className="mt-5 flex gap-3 text-sm font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Heart size={16} className="text-red-400" />
                        {topMemory.likes?.length || 0} likes
                      </span>

                      <span className="flex items-center gap-1">
                        <MessageCircle size={16} className="text-[#F6AD55]" />
                        {topMemory.commentsCount || 0} comments
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.04] p-8 text-center">
                  <h3 className="text-xl font-black text-white">
                    No top memory yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Share memories and collect likes to unlock your top memory.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function WrappedMetric({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p
        className={`text-3xl font-black ${
          accent ? "text-[#F6AD55]" : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
}

export default TravelWrapped;