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
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between px-5 py-5 md:px-7 md:py-6">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
            alt="Arjun Sharma"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-[#F6AD55]"
          />

          <div>
            <h3 className="font-black text-white">Arjun Sharma</h3>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <MapPin size={13} className="text-[#F6AD55]" />
              Dolomites, Italy
            </div>
          </div>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-400 transition hover:bg-white/[0.1] hover:text-white"
          aria-label="More options"
        >
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="relative h-[380px] overflow-hidden bg-[#06111F]">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop"
          alt="Cadini di Misurina"
          className="h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06111F]/80 via-transparent to-black/20" />

        <div className="absolute right-5 top-5 space-y-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-black text-white backdrop-blur">
            <Mountain size={15} className="text-[#F6AD55]" />
            2,999 m
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-black text-white backdrop-blur">
            <ThermometerSun size={15} className="text-[#F6AD55]" />
            8°C
          </div>
        </div>

        <div className="absolute bottom-6 left-6 max-w-[330px] rounded-2xl border border-white/10 bg-[#06111F]/75 p-5 text-white shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
          <h2 className="text-xl font-black text-white">
            Cadini di Misurina
          </h2>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">
            The most jagged spires I've ever seen. A morning hike turned into a
            story worth remembering.
          </p>
        </div>
      </div>

      <div className="px-5 py-5 md:px-7">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-7 text-slate-400">
            <button
              type="button"
              className="flex items-center gap-2 font-black transition hover:text-[#F6AD55]"
            >
              <Heart size={22} />
              <span>1.2k</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-2 font-black transition hover:text-[#F6AD55]"
            >
              <MessageCircle size={22} />
              <span>84</span>
            </button>

            <button
              type="button"
              className="transition hover:text-[#F6AD55]"
              aria-label="Share memory"
            >
              <Share2 size={22} />
            </button>
          </div>

          <button
            type="button"
            className="text-slate-400 transition hover:text-[#F6AD55]"
            aria-label="Save memory"
          >
            <Bookmark size={22} />
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          <span className="rounded-full border border-[#F6AD55]/20 bg-[#F6AD55]/10 px-3 py-1 text-xs font-black text-[#F6AD55]">
            Alpine
          </span>
          <span className="rounded-full border border-[#F6AD55]/20 bg-[#F6AD55]/10 px-3 py-1 text-xs font-black text-[#F6AD55]">
            6h Hike
          </span>
        </div>
      </div>
    </article>
  );
}

export default FeaturedMemoryCard;