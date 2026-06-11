import { Bookmark, Heart, MapPin, MessageCircle } from "lucide-react";

function MemoryCard({ memory }) {
  const image =
    memory.images?.[0]?.url ||
    memory.images?.[0] ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop";
  return (
    <article className="overflow-hidden rounded-3xl border border-[#D8DEE6] bg-white shadow-sm transition hover:shadow-lg">
      <div className="relative">
        <img
          src={image}
          alt={memory.title}
          className="h-[280px] w-full object-cover"
        />

        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 backdrop-blur">
          <div className="flex items-center gap-1 text-sm font-medium">
            <MapPin size={14} />
            {memory.city}, {memory.country}
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Author */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A365D] text-white">
            {memory.author?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h4 className="font-semibold text-[#002045]">
              {memory.author?.fullName || memory.author?.username}
            </h4>

            <p className="text-xs text-[#002045]/50">
              @{memory.author?.username}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#002045]">{memory.title}</h3>

        {/* Description */}
        <p className="mt-3 line-clamp-3 text-sm text-[#002045]/70">
          {memory.description}
        </p>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-[#E5EAF0] pt-4">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Heart size={18} />
              <span>{memory.likes?.length || 0}</span>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle size={18} />
              <span>{memory.commentsCount || 0}</span>
            </div>
          </div>

          <Bookmark size={18} />
        </div>
      </div>
    </article>
  );
}

export default MemoryCard;
