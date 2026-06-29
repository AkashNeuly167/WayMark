import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Heart,
  Loader2,
  Map,
  MapPin,
  MessageCircle,
  Navigation,
  Pencil,
  Route,
  Sparkles,
  Trash2,
} from "lucide-react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";

import { deleteMemory, getMemories } from "../services/memory.service";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";
import ImageCarousel from "../components/memory/ImageCarousel";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
    return [...(journeyData || [])].sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [journeyData]);

  const timelineGroups = useMemo(() => {
    const grouped = memories.reduce((acc, memory) => {
      const date = memory.createdAt ? new Date(memory.createdAt) : new Date();

      const key = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!acc[key]) {
        acc[key] = {
          label: key,
          memories: [],
          timestamp: date.getTime(),
        };
      }

      acc[key].memories.push(memory);
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => b.timestamp - a.timestamp);
  }, [memories]);

  const countries = useMemo(() => {
    return Array.from(
      new Set(memories.map((memory) => memory.country).filter(Boolean)),
    );
  }, [memories]);

  const cities = useMemo(() => {
    return Array.from(
      new Set(memories.map((memory) => memory.city).filter(Boolean)),
    );
  }, [memories]);

  const totalLikes = useMemo(() => {
    return memories.reduce((total, memory) => {
      return total + (memory.likes?.length || 0);
    }, 0);
  }, [memories]);

  const routeStops = useMemo(() => {
    return memories
      .filter((memory) => memory.city || memory.country || memory.locationName)
      .slice(0, 6);
  }, [memories]);

  const routeMapStops = useMemo(() => {
    return memories
      .filter((memory) => {
        const lat = Number(memory.coordinates?.lat);
        const lng = Number(memory.coordinates?.lng);

        return !Number.isNaN(lat) && !Number.isNaN(lng);
      })
      .slice()
      .reverse();
  }, [memories]);

  const routePositions = useMemo(() => {
    return routeMapStops.map((memory) => [
      Number(memory.coordinates.lat),
      Number(memory.coordinates.lng),
    ]);
  }, [routeMapStops]);

  const routeCenter = useMemo(() => {
    if (routePositions.length === 0) {
      return [30.7333, 76.7794];
    }

    return routePositions[routePositions.length - 1];
  }, [routePositions]);

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
    <div className="min-h-screen bg-transparent text-white">
      <main className="mx-auto max-w-[1400px] px-4 pb-28 pt-5 md:px-8 md:pt-7">
        <section className="mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_24px_80px_rgba(0,0,0,0.24)]">
          <div className="relative overflow-hidden p-6 md:p-9">
            <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#F6AD55]/20 blur-[100px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

            <div className="relative grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#F6AD55]/20 bg-[#F6AD55]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                  <Route size={15} />
                  Travel Timeline
                </div>

                <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
                  Your Journey Log
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                  A timeline of places you have visited, memories you created,
                  and routes you are building one story at a time.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Latest route
                    </p>

                    <h2 className="mt-1 text-xl font-black text-white">
                      {routeStops.length > 0
                        ? `${routeStops[0]?.city || "Unknown"} trail`
                        : "No route yet"}
                    </h2>
                  </div>

                  <Navigation className="text-[#F6AD55]" size={24} />
                </div>

                <div className="space-y-3">
                  {routeStops.length > 0 ? (
                    routeStops.slice(0, 4).map((memory, index) => (
                      <div key={memory._id} className="flex items-center gap-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#F6AD55]/25 bg-[#F6AD55]/10 text-xs font-black text-[#F6AD55]">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-white">
                            {memory.locationName ||
                              memory.city ||
                              "Unnamed stop"}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {memory.city || "Unknown City"},{" "}
                            {memory.country || "Unknown Country"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-slate-500">
                      Create memories to start building your travel route.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-white/10 p-4 md:grid-cols-4 md:p-6">
            <JourneyStat
              icon={<Sparkles size={22} />}
              value={memories.length}
              label="Memories"
            />

            <JourneyStat
              icon={<Map size={22} />}
              value={countries.length}
              label="Countries"
            />

            <JourneyStat
              icon={<MapPin size={22} />}
              value={cities.length}
              label="Cities"
            />

            <JourneyStat
              icon={<Heart size={22} />}
              value={totalLikes}
              label="Likes"
            />
          </div>
        </section>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="h-96 animate-pulse rounded-[2rem] border border-white/10 bg-[#101D2E]" />

            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-[2rem] border border-white/10 bg-[#101D2E]"
                />
              ))}
            </div>
          </div>
        ) : memories.length === 0 ? (
          <EmptyJourney />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
              <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#F6AD55]">
                      Route Map
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {routeMapStops.length} mapped stops
                    </p>
                  </div>

                  <MapPin className="text-[#F6AD55]" size={22} />
                </div>

                <div className="relative z-0 mt-5 h-80 overflow-hidden rounded-3xl border border-white/10 bg-[#06111F]">
                  {routeMapStops.length > 0 ? (
                    <MapContainer
                      center={routeCenter}
                      zoom={5}
                      scrollWheelZoom={false}
                      className="z-0 h-full w-full"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {routePositions.length > 1 && (
                        <Polyline
                          positions={routePositions}
                          pathOptions={{
                            color: "#F6AD55",
                            weight: 4,
                            opacity: 0.9,
                          }}
                        />
                      )}

                      {routeMapStops.map((memory, index) => (
                        <Marker
                          key={memory._id}
                          position={[
                            Number(memory.coordinates.lat),
                            Number(memory.coordinates.lng),
                          ]}
                          eventHandlers={{
                            click: () => navigate(`/memories/${memory._id}`),
                          }}
                        >
                          <Tooltip>
                            {index + 1}.{" "}
                            {memory.locationName ||
                              memory.city ||
                              memory.title ||
                              "Journey stop"}
                          </Tooltip>
                        </Marker>
                      ))}
                    </MapContainer>
                  ) : (
                    <div className="grid h-full place-items-center px-6 text-center">
                      <div>
                        <MapPin className="mx-auto text-[#F6AD55]" size={30} />

                        <p className="mt-3 text-sm font-black text-white">
                          No mapped stops yet
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Add coordinates while creating memories to build your
                          route map.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
                <p className="text-xs font-black uppercase tracking-widest text-[#F6AD55]">
                  Visited Places
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {cities.slice(0, 12).map((city) => (
                    <span
                      key={city}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-black text-slate-300"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </section>
            </aside>

            <section className="space-y-8">
              {timelineGroups.map((group) => (
                <div key={group.label}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#F6AD55]/20 bg-[#F6AD55]/10 text-[#F6AD55]">
                      <CalendarDays size={20} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-white">
                        {group.label}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {group.memories.length} journey stops
                      </p>
                    </div>
                  </div>

                  <div className="relative space-y-5 border-l border-white/10 pl-5 md:pl-7">
                    {group.memories.map((memory) => (
                      <TimelineMemory
                        key={memory._id}
                        memory={memory}
                        deletingId={deletingId}
                        formatDate={formatDate}
                        onOpen={() => navigate(`/memories/${memory._id}`)}
                        onEdit={(event) => {
                          event.stopPropagation();
                          navigate(`/memories/${memory._id}/edit`);
                        }}
                        onDelete={(event) =>
                          handleDeleteMemory(event, memory._id)
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function TimelineMemory({
  memory,
  deletingId,
  formatDate,
  onOpen,
  onEdit,
  onDelete,
}) {
  return (
    <article
      onClick={onOpen}
      className="group relative cursor-pointer rounded-[2rem] border border-white/10 bg-[#101D2E] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-[#F6AD55]/35 hover:bg-[#14243A] md:p-5"
    >
      <div className="absolute -left-[29px] top-8 h-4 w-4 rounded-full border-4 border-[#06111F] bg-[#F6AD55] md:-left-[37px]" />

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#06111F]">
          <ImageCarousel
            images={memory.images || []}
            title={memory.title}
            variant="thumb"
            className="h-48 !aspect-auto md:h-full"
          />
        </div>

        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-black text-[#F6AD55]">
            <MapPin size={14} />

            <span>{memory.locationName || memory.city || "Unknown stop"}</span>

            <ChevronRight size={14} />

            <span className="text-slate-500">
              {memory.country || "Unknown Country"}
            </span>
          </div>

          <h3 className="line-clamp-1 text-2xl font-black text-white">
            {memory.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
            {memory.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
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

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-black text-slate-300 transition hover:bg-[#F6AD55] hover:text-[#06111F]"
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={deletingId === memory._id}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-60"
            >
              {deletingId === memory._id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function JourneyStat({ icon, value, label }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-5">
      <div className="text-[#F6AD55]">{icon}</div>

      <p className="mt-3 text-3xl font-black text-white">{value}</p>

      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function EmptyJourney() {
  return (
    <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#101D2E] p-10 text-center shadow-[0_20px_70px_rgba(0,0,0,0.2)]">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border border-[#F6AD55]/20 bg-[#F6AD55]/10 text-[#F6AD55]">
        <Route size={28} />
      </div>

      <h2 className="mt-5 text-2xl font-black text-white">No journeys yet</h2>

      <p className="mx-auto mt-3 max-w-xl text-slate-400">
        Create your first memory and your route timeline will start appearing
        here.
      </p>

      <Link
        to="/memories/create"
        className="mt-6 inline-flex rounded-2xl bg-[#F6AD55] px-5 py-3 font-black text-[#06111F] transition hover:bg-orange-300"
      >
        Share your first memory
      </Link>
    </div>
  );
}

export default Journey;