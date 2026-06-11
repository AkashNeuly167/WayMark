import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ThermometerSun,
  Mountain,
} from "lucide-react";

function FeaturedMemoryCard() {
  return (
    <article className="overflow-hidden rounded-[28px] border border-[#D8DEE6] bg-white shadow-sm">
      <div className="flex items-center justify-between px-7 py-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
            alt="Arjun Sharma"
            className="h-11 w-11 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-[#002045]">Arjun Sharma</h3>
            <div className="flex items-center gap-1 text-sm text-[#002045]/60">
              <MapPin size={13} />
              Dolomites, Italy
            </div>
          </div>
        </div>

        <button className="text-[#002045]">
          <MoreHorizontal />
        </button>
      </div>

      <div className="relative h-[380px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop"
          alt="Cadini di Misurina"
          className="h-full w-full object-cover"
        />

        <div className="absolute right-5 top-5 space-y-3">
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-[#002045] backdrop-blur">
            <Mountain size={15} className="text-[#F6AD55]" />
            2,999 m
          </div>

          <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-[#002045] backdrop-blur">
            <ThermometerSun size={15} className="text-[#F6AD55]" />
            8°C
          </div>
        </div>

        <div className="absolute bottom-6 left-6 max-w-[330px] rounded-2xl bg-white/85 p-5 backdrop-blur">
          <h2 className="text-xl font-bold text-[#002045]">
            Cadini di Misurina
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#002045]/70">
            The most jagged spires I've ever seen. A morning hike turned into a
            story worth remembering.
          </p>
        </div>
      </div>

      <div className="px-7 py-5">
        <div className="flex items-center justify-between border-b border-[#E5EAF0] pb-5">
          <div className="flex items-center gap-7 text-[#002045]/80">
            <button className="flex items-center gap-2 hover:text-[#F6AD55]">
              <Heart size={22} />
              <span>1.2k</span>
            </button>

            <button className="flex items-center gap-2 hover:text-[#F6AD55]">
              <MessageCircle size={22} />
              <span>84</span>
            </button>

            <button className="hover:text-[#F6AD55]">
              <Share2 size={22} />
            </button>
          </div>

          <button className="text-[#002045]/80 hover:text-[#F6AD55]">
            <Bookmark size={22} />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <span className="rounded-full border border-[#D8DEE6] bg-[#F7FAFC] px-3 py-1 text-xs text-[#002045]/70">
            Alpine
          </span>
          <span className="rounded-full border border-[#D8DEE6] bg-[#F7FAFC] px-3 py-1 text-xs text-[#002045]/70">
            6h Hike
          </span>
        </div>
      </div>
    </article>
  );
}

export default FeaturedMemoryCard;