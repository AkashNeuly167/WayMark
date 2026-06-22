import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Heart,
  ImageOff,
  Loader2,
  Map,
  MapPin,
  MessageCircle,
  Pencil,
  Route,
  Sparkles,
  Trash2,
} from "lucide-react";

import { deleteMemory, getMemories } from "../services/memory.service";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";

function Journey() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const currentUserId = user?._id || user?.id;

  const [journeyData, setJourneyData] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchJourneys = async () => {
      if (!currentUserId) {
        setJourneyData([]);
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

  const totalLikes = useMemo(() => {
    return memories.reduce((total, memory) => {
      return total + (memory.likes?.length || 0);
    }, 0);
  }, [memories]);

  const getMemoryImage = (memory) => {
    const firstImage = memory.images?.[0];

    if (!firstImage) return "";
    return firstImage.url || firstImage;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleDeleteMemory = async (event, memoryId) => {
    event.stopPropagation();

    const confirmDelete = window.confirm(
      "Delete this memory? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(memoryId);

      await deleteMemory(memoryId);

      setJourneyData((prev) =>
        (prev || []).filter((memory) => memory._id !== memoryId),
      );

      showToast({
        type: "success",
        title: "Memory deleted",
        message: "Your journey memory has been removed.",
      });
    } catch (error) {
      console.error("Delete journey memory error:", error);

      showToast({
        type: "error",
        title: "Delete failed",
        message: "Could not delete this memory.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8 md:pt-10">
        <section className="mb-8 overflow-hidden rounded-[32px] border border-[#D8DEE6] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#0B132B] via-[#1A365D] to-[#F6AD55] p-8 text-white md:p-10">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/15 backdrop-blur">
              <Route size={32} />
            </div>

            <h1 className="mt-6 text-4xl font-black md:text-6xl">
              Your Journeys
            </h1>

            <p className="mt-4 max-w-2xl text-white/75">
              See your memories grouped by countries and cities you have shared.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-5 md:grid-cols-4 md:p-8">
            <div className="rounded-3xl bg-[#F7FAFC] p-5">
              <Sparkles className="text-[#F6AD55]" size={26} />
              <p className="mt-4 text-3xl font-black">{memories.length}</p>
              <p className="mt-1 text-sm text-[#002045]/55">Memories</p>
            </div>

            <div className="rounded-3xl bg-[#F7FAFC] p-5">
              <Map className="text-[#F6AD55]" size={26} />
              <p className="mt-4 text-3xl font-black">
                {journeyGroups.length}
              </p>
              <p className="mt-1 text-sm text-[#002045]/55">Countries</p>
            </div>

            <div className="rounded-3xl bg-[#F7FAFC] p-5">
              <MapPin className="text-[#F6AD55]" size={26} />
              <p className="mt-4 text-3xl font-black">{totalCities}</p>
              <p className="mt-1 text-sm text-[#002045]/55">Cities</p>
            </div>

            <div className="rounded-3xl bg-[#F7FAFC] p-5">
              <Heart className="text-[#F6AD55]" size={26} />
              <p className="mt-4 text-3xl font-black">{totalLikes}</p>
              <p className="mt-1 text-sm text-[#002045]/55">Likes</p>
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
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-orange-50 text-[#F6AD55]">
              <Route size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-black">No journeys yet</h2>

            <p className="mx-auto mt-3 max-w-xl text-[#002045]/60">
              Create your first memory and your journeys will start appearing
              here.
            </p>

            <Link
              to="/memories/create"
              className="mt-6 inline-flex rounded-2xl bg-[#F6AD55] px-5 py-3 font-black text-white transition hover:bg-orange-400"
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
                      <span className="font-black">{group.country}</span>
                    </div>

                    <h2 className="mt-2 text-3xl font-black">
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
                        className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-[#F6AD55]"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {group.memories.map((memory) => {
                    const image = getMemoryImage(memory);

                    return (
                      <article
                        key={memory._id}
                        onClick={() => navigate(`/memories/${memory._id}`)}
                        className="group cursor-pointer overflow-hidden rounded-3xl border border-[#E8EDF2] bg-[#F7FAFC] transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="relative">
                          {image ? (
                            <img
                              src={image}
                              alt={memory.title}
                              className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="grid h-48 w-full place-items-center bg-[#E8EDF2] text-[#002045]/40">
                              <ImageOff size={28} />
                            </div>
                          )}

                          <div className="absolute right-3 top-3 flex gap-2">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/memories/${memory._id}/edit`);
                              }}
                              className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#1A365D] shadow-sm transition hover:bg-[#F6AD55] hover:text-white"
                            >
                              <Pencil size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={(event) =>
                                handleDeleteMemory(event, memory._id)
                              }
                              disabled={deletingId === memory._id}
                              className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white disabled:opacity-60"
                            >
                              {deletingId === memory._id ? (
                                <Loader2 size={17} className="animate-spin" />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="mb-2 flex items-center gap-2 text-sm font-black text-[#F6AD55]">
                            <MapPin size={14} />
                            {memory.city || "Unknown City"},{" "}
                            {memory.country || "Unknown Country"}
                          </div>

                          <h3 className="line-clamp-1 text-xl font-black">
                            {memory.title}
                          </h3>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#002045]/65">
                            {memory.description}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#002045]/45">
                            <span className="flex items-center gap-1">
                              <CalendarDays size={14} />
                              {formatDate(memory.createdAt)}
                            </span>

                            <span className="flex items-center gap-1">
                              <Heart size={14} />
                              {memory.likes?.length || 0}
                            </span>

                            <span className="flex items-center gap-1">
                              <MessageCircle size={14} />
                              {memory.commentsCount || 0}
                            </span>
                          </div>
                        </div>
                      </article>
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