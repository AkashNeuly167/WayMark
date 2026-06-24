import { Bookmark, Calendar, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { unsaveMemory } from "../../services/bookmark.service";
import ImageCarousel from "./ImageCarousel";

function SavedMemoryRow({ memory, onRemoved }) {
  const [loading, setLoading] = useState(false);

  const authorName =
    memory.author?.fullName || memory.author?.username || "Waymark Traveler";

  const location = [memory.city, memory.country].filter(Boolean).join(", ");

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleRemove = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);
      await unsaveMemory(memory._id);
      onRemoved?.(memory._id);
    } catch (error) {
      console.error("Remove saved memory error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/memories/${memory._id}`}
      className="group flex gap-4 rounded-[2rem] border border-white/10 bg-[#101D2E] p-3 shadow-[0_18px_55px_rgba(0,0,0,0.2)] transition hover:-translate-y-0.5 hover:border-[#F6AD55]/35 hover:bg-[#14243A]"
    >
      <div className="h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#06111F] ring-1 ring-white/10 md:h-28 md:w-36">
        <ImageCarousel
          images={memory.images || []}
          title={memory.title}
          className="h-full !aspect-auto"
          variant="thumb"
        />
      </div>

      <div className="min-w-0 flex-1 py-1">
        {location && (
          <div className="mb-2 flex items-center gap-1 text-xs font-black text-[#F6AD55]">
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}

        <h3 className="line-clamp-1 text-lg font-black text-white md:text-xl">
          {memory.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-400">
          {memory.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
          <span className="truncate">{authorName}</span>

          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(memory.createdAt)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRemove}
        disabled={loading}
        className="my-auto grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#F6AD55] transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-60"
        title="Remove from saved"
      >
        {loading ? (
          <Bookmark size={18} className="fill-[#F6AD55] text-[#F6AD55]" />
        ) : (
          <Trash2 size={18} />
        )}
      </button>
    </Link>
  );
}

export default SavedMemoryRow;