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
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-8 ">
        <section className="overflow-hidden rounded-[32px] border border-[#D8DEE6] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#0B132B] via-[#1A365D] to-[#F6AD55] p-8 text-white md:p-12">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
                  <Award size={32} />
                </div>

                <h1 className="mt-6 text-4xl font-bold md:text-6xl">
                  Travel Wrapped
                </h1>

                <p className="mt-4 max-w-2xl text-white/75">
                  Your personal travel recap for memories, countries, cities,
                  likes, and favorite moments.
                </p>
              </div>

              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur"
              >
                <option className="text-[#002045]" value={currentYear}>
                  {currentYear}
                </option>
                <option className="text-[#002045]" value={currentYear - 1}>
                  {currentYear - 1}
                </option>
                <option className="text-[#002045]" value={currentYear - 2}>
                  {currentYear - 2}
                </option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-10 text-[#002045]/60">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading travel wrapped...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-4 md:p-8">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-3xl bg-[#F7FAFC] p-5"
                  >
                    <Icon className="text-[#F6AD55]" size={26} />
                    <p className="mt-4 text-3xl font-bold">{stat.value}</p>
                    <p className="mt-1 text-sm text-[#002045]/55">
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
            <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-[#D8DEE6] bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <BarChart3 className="text-[#F6AD55]" size={24} />
                  <h2 className="text-2xl font-bold">Your travel map</h2>
                </div>

                {wrapped?.countries?.length > 0 ? (
                  <div>
                    <p className="mb-4 text-[#002045]/60">
                      Countries you shared memories from in {year}.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {wrapped.countries.map((country) => (
                        <span
                          key={country}
                          className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-[#F6AD55]"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[#002045]/60">
                    No countries yet for this year. Add memories to build your
                    travel wrapped.
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-[#D8DEE6] bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <MessageCircle className="text-[#F6AD55]" size={24} />
                  <h2 className="text-2xl font-bold">Engagement</h2>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-[#F7FAFC] p-4">
                    <p className="text-3xl font-bold">
                      {wrapped?.totalComments || 0}
                    </p>
                    <p className="mt-1 text-sm text-[#002045]/55">
                      Total comments
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F7FAFC] p-4">
                    <p className="text-3xl font-bold">
                      {wrapped?.totalLikes || 0}
                    </p>
                    <p className="mt-1 text-sm text-[#002045]/55">
                      Total likes
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-3xl border border-[#D8DEE6] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Award className="text-[#F6AD55]" size={24} />
                <h2 className="text-2xl font-bold">Top memory</h2>
              </div>

              {topMemory ? (
                <Link
                  to={`/memories/${topMemory._id}`}
                  className="grid overflow-hidden rounded-3xl border border-[#D8DEE6] bg-[#F7FAFC] transition hover:-translate-y-0.5 hover:shadow-md md:grid-cols-[260px_1fr]"
                >
                  {topMemoryImage ? (
                    <img
                      src={topMemoryImage}
                      alt={topMemory.title}
                      className="h-56 w-full object-cover md:h-full"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-[#E8EDF2] text-[#002045]/40">
                      No image
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#F6AD55]">
                      <MapPin size={15} />
                      {topMemory.city}, {topMemory.country}
                    </div>

                    <h3 className="text-2xl font-bold">{topMemory.title}</h3>

                    <p className="mt-3 line-clamp-3 text-[#002045]/65">
                      {topMemory.description}
                    </p>

                    <div className="mt-5 flex gap-3 text-sm text-[#002045]/60">
                      <span className="flex items-center gap-1">
                        <Heart size={16} />
                        {topMemory.likes?.length || 0} likes
                      </span>

                      <span className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        {topMemory.commentsCount || 0} comments
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="rounded-3xl border border-dashed border-[#D8DEE6] bg-[#F7FAFC] p-8 text-center">
                  <h3 className="text-xl font-bold">No top memory yet</h3>
                  <p className="mt-2 text-[#002045]/60">
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

export default TravelWrapped;
