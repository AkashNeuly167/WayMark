import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ImageOff,
  Map,
  MapPin,
  Route,
  Sparkles,
} from "lucide-react";

import { getMemories } from "../services/memory.service";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";

function Journey() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const currentUserId = user?._id || user?.id;

  const [journeyData, setJourneyData] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchJourneys = async () => {
      try {
        const data = await getMemories();

        if (ignore) return;

        const allMemories = data.memories || [];

        const myMemories = allMemories.filter((memory) => {
          const authorId = memory.author?._id || memory.author;
          return authorId?.toString() === currentUserId?.toString();
        });

        setJourneyData(myMemories);
      } catch (error) {
        if (ignore) return;

        console.error("Journey fetch error:", error);

        showToast({
          type: "error",
          title: "Failed",
          message: "Could not load your journeys.",
        });

        setJourneyData([]);
      }
    };

    fetchJourneys();

    return () => {
      ignore = true;
    };
  }, [currentUserId, showToast]);

  const loading = journeyData === null;

  const memories = useMemo(() => {
    return journeyData || [];
  }, [journeyData]);

  const journeyGroups = useMemo(() => {
    const grouped = memories.reduce((acc, memory) => {
      const country = memory.country || "Unknown Country";

      if (!acc[country]) {
        acc[country] = {
          country,
          memories: [],
          cities: new Set(),
        };
      }

      acc[country].memories.push(memory);

      if (memory.city) {
        acc[country].cities.add(memory.city);
      }

      return acc;
    }, {});

    return Object.values(grouped)
      .map((group) => ({
        ...group,
        cities: Array.from(group.cities),
      }))
      .sort((a, b) => b.memories.length - a.memories.length);
  }, [memories]);

  const totalCities = useMemo(() => {
    return new Set(memories.map((memory) => memory.city).filter(Boolean)).size;
  }, [memories]);

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-8 md:ml-64">
        <section className="mb-8 overflow-hidden rounded-[32px] border border-[#D8DEE6] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#0B132B] via-[#1A365D] to-[#F6AD55] p-8 text-white md:p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
              <Route size={32} />
            </div>

            <h1 className="mt-6 text-4xl font-bold md:text-6xl">
              Your Journeys
            </h1>

            <p className="mt-4 max-w-2xl text-white/75">
              See your memories grouped by countries and cities you have shared.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3 md:p-8">
            <div className="rounded-3xl bg-[#F7FAFC] p-5">
              <Sparkles className="text-[#F6AD55]" size={26} />
              <p className="mt-4 text-3xl font-bold">{memories.length}</p>
              <p className="mt-1 text-sm text-[#002045]/55">Memories</p>
            </div>

            <div className="rounded-3xl bg-[#F7FAFC] p-5">
              <Map className="text-[#F6AD55]" size={26} />
              <p className="mt-4 text-3xl font-bold">{journeyGroups.length}</p>
              <p className="mt-1 text-sm text-[#002045]/55">Countries</p>
            </div>

            <div className="rounded-3xl bg-[#F7FAFC] p-5">
              <MapPin className="text-[#F6AD55]" size={26} />
              <p className="mt-4 text-3xl font-bold">{totalCities}</p>
              <p className="mt-1 text-sm text-[#002045]/55">Cities</p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-3xl border border-[#D8DEE6] bg-white"
              />
            ))}
          </div>
        ) : memories.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D8DEE6] bg-white p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-[#F6AD55]">
              <Route size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-bold">No journeys yet</h2>

            <p className="mx-auto mt-3 max-w-xl text-[#002045]/60">
              Create your first memory and your journeys will start appearing
              here.
            </p>

            <Link
              to="/memories/create"
              className="mt-6 inline-flex rounded-2xl bg-[#F6AD55] px-5 py-3 font-semibold text-white transition hover:bg-orange-400"
            >
              Share your first memory
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {journeyGroups.map((group) => (
              <section
                key={group.country}
                className="rounded-[32px] border border-[#D8DEE6] bg-white p-5 shadow-sm md:p-6"
              >
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[#F6AD55]">
                      <MapPin size={18} />
                      <span className="font-semibold">{group.country}</span>
                    </div>

                    <h2 className="mt-2 text-3xl font-bold">
                      {group.country} Journey
                    </h2>

                    <p className="mt-1 text-sm text-[#002045]/55">
                      {group.memories.length} memories · {group.cities.length}{" "}
                      cities
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.cities.slice(0, 4).map((city) => (
                      <span
                        key={city}
                        className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-[#F6AD55]"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {group.memories.map((memory) => {
                    const image = memory.images?.[0]?.url || memory.images?.[0];

                    return (
                      <Link
                        key={memory._id}
                        to={`/memories/${memory._id}`}
                        className="overflow-hidden rounded-3xl border border-[#E8EDF2] bg-[#F7FAFC] transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        {image ? (
                          <img
                            src={image}
                            alt={memory.title}
                            className="h-48 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-48 w-full items-center justify-center bg-[#E8EDF2] text-[#002045]/40">
                            <ImageOff size={28} />
                          </div>
                        )}

                        <div className="p-5">
                          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#F6AD55]">
                            <MapPin size={14} />
                            {memory.city}, {memory.country}
                          </div>

                          <h3 className="line-clamp-1 text-xl font-bold">
                            {memory.title}
                          </h3>

                          <p className="mt-2 line-clamp-2 text-sm text-[#002045]/65">
                            {memory.description}
                          </p>

                          <div className="mt-4 flex items-center gap-2 text-xs text-[#002045]/45">
                            <CalendarDays size={14} />
                            {memory.createdAt
                              ? new Date(memory.createdAt).toLocaleDateString()
                              : "Recently"}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Journey;
