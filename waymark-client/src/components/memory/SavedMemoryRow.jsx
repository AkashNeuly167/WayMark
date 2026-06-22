import { Bookmark, Calendar, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { unsaveMemory } from "../../services/bookmark.service";
import ImageCarousel from "./ImageCarousel";

function SavedMemoryRow({ memory, onRemoved }) {
  const [loading, setLoading] = useState(false);

  const authorName =
    memory.author?.fullName || memory.author?.username || "Waymark Traveler";

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
      className="group flex gap-4 rounded-3xl border border-[#D8DEE6] bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
    >
      <div className="h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#E8EDF2] md:h-28 md:w-36">
        <ImageCarousel
          images={memory.images || []}
          title={memory.title}
          className="h-full !aspect-auto"
        />
      </div>

      <div className="min-w-0 flex-1 py-1">
        <div className="mb-2 flex items-center gap-1 text-xs font-bold text-[#F6AD55]">
          <MapPin size={13} />
          <span className="truncate">
            {memory.city}, {memory.country}
          </span>
        </div>

        <h3 className="line-clamp-1 text-lg font-black text-[#002045] md:text-xl">
          {memory.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm leading-5 text-[#002045]/60">
          {memory.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-[#002045]/40">
          <span>{authorName}</span>

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
        className="my-auto grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-500 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-60"
        title="Remove from saved"
      >
        {loading ? (
          <Bookmark size={18} className="fill-orange-500" />
        ) : (
          <Trash2 size={18} />
        )}
      </button>
    </Link>
  );
}

export default SavedMemoryRow;