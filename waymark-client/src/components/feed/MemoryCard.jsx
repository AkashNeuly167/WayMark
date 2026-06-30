import { useEffect, useState } from "react";
import { Bookmark, Calendar, Heart, MapPin, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { toggleLikeMemory } from "../../services/memory.service";
import {
  getSavedMemoryIds,
  saveMemory,
  unsaveMemory,
} from "../../services/bookmark.service";
import { useAuth } from "../../context/AuthContext";
import ImageCarousel from "../memory/ImageCarousel";
import { getOptimizedImageUrl } from "../../utils/cloudinary";

function MemoryCard({ memory, onCommentClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user?._id || user?.id;

  const avatarUrl =
    typeof memory.author?.avatar === "string"
      ? memory.author.avatar
      : memory.author?.avatar?.url;

  const alreadyLiked = memory.likes?.some((like) => {
    const likeId = typeof like === "string" ? like : like?._id;
    return likeId?.toString() === userId?.toString();
  });

  const [liked, setLiked] = useState(alreadyLiked || false);
  const [likesCount, setLikesCount] = useState(memory.likes?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeAnimating, setLikeAnimating] = useState(false);

  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (!memory?._id || !userId) return;

      try {
        const data = await getSavedMemoryIds();
        const savedIds = data.savedMemoryIds || [];

        setBookmarked(savedIds.includes(memory._id));
      } catch (error) {
        console.error("Fetch bookmark status error:", error);
      }
    };

    fetchSavedStatus();
  }, [memory?._id, userId]);

  const authorName =
    memory.author?.fullName || memory.author?.username || "WayMark Traveler";

  const authorInitial =
    memory.author?.username?.charAt(0).toUpperCase() ||
    memory.author?.fullName?.charAt(0).toUpperCase() ||
    "W";

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCardClick = () => {
    navigate(`/memories/${memory._id}`);
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (likeLoading) return;

    const previousLiked = liked;
    const previousCount = likesCount;

    try {
      setLikeLoading(true);
      setLikeAnimating(true);

      const nextLiked = !liked;

      setLiked(nextLiked);
      setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(prev - 1, 0)));

      const data = await toggleLikeMemory(memory._id);

      if (typeof data.likesCount === "number") {
        setLikesCount(data.likesCount);
      }

      if (typeof data.liked === "boolean") {
        setLiked(data.liked);
      }
    } catch (error) {
      console.error("Feed like error:", error);

      setLiked(previousLiked);
      setLikesCount(previousCount);
    } finally {
      setLikeLoading(false);

      setTimeout(() => {
        setLikeAnimating(false);
      }, 300);
    }
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (onCommentClick) {
      onCommentClick(memory);
      return;
    }

    navigate(`/memories/${memory._id}#comments`, {
      state: { focusComment: true },
    });
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (bookmarkLoading || !memory?._id) return;

    const previousBookmarked = bookmarked;

    try {
      setBookmarkLoading(true);
      setBookmarked(!previousBookmarked);

      if (previousBookmarked) {
        await unsaveMemory(memory._id);
      } else {
        await saveMemory(memory._id);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      setBookmarked(previousBookmarked);
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className="group cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 bg-[#101D2E] shadow-[0_20px_70px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-[#F6AD55]/35 hover:bg-[#14243A] hover:shadow-[0_28px_90px_rgba(0,0,0,0.38)]"
    >
      <div className="relative overflow-hidden bg-[#06111F]">
        <ImageCarousel
          images={memory.images || []}
          title={memory.title}
          variant="feed"
          className="h-[320px] !aspect-auto md:h-[380px] xl:h-[420px]"
        />

        {(memory.city || memory.country) && (
          <div className="pointer-events-none absolute left-4 top-4 z-20 inline-flex max-w-[78%] items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3.5 py-2 text-xs font-black text-white shadow-xl backdrop-blur-md">
            <MapPin size={14} className="shrink-0 text-[#F6AD55]" />
            <span className="truncate">
              {[memory.locationName, memory.city, memory.country]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#101D2E] to-transparent" />
      </div>

      <div className="px-4 pb-3 pt-3 md:px-5 md:pb-4">
        <div className="mb-4 flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={getOptimizedImageUrl(avatarUrl,120)}
              alt={authorName}
              loading="lazy"
              decoding="async"
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#F6AD55] to-orange-600 text-sm font-black text-white shadow-lg">
              {authorInitial}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-black text-white">
              {authorName}
            </h4>

            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <Calendar size={11} />
              <span>{formatDate(memory.createdAt)}</span>
            </div>
          </div>
        </div>

        <h3 className="line-clamp-1 text-xl font-black leading-tight text-white md:text-2xl">
          {memory.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-slate-400">
          {memory.description}
        </p>

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-black transition-all duration-200 disabled:opacity-50 ${
                liked
                  ? "bg-red-500/10 text-red-400"
                  : "text-slate-300 hover:bg-red-500/10 hover:text-red-400"
              }`}
            >
              <Heart
                size={19}
                className={`transition-transform duration-200 ${
                  likeAnimating ? "scale-125" : "scale-100"
                } ${liked ? "fill-red-400 text-red-400" : ""}`}
              />
              <span>{likesCount}</span>
            </button>

            <button
              type="button"
              onClick={handleCommentClick}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-black text-slate-300 transition hover:bg-white/5 hover:text-[#F6AD55]"
            >
              <MessageCircle size={19} />
              <span>{memory.commentsCount || 0}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-black transition disabled:opacity-60 ${
              bookmarked
                ? "bg-[#F6AD55]/15 text-[#F6AD55]"
                : "text-slate-300 hover:bg-[#F6AD55]/10 hover:text-[#F6AD55]"
            }`}
            aria-label={bookmarked ? "Remove from saved" : "Save memory"}
          >
            <Bookmark
              size={19}
              className={bookmarked ? "fill-[#F6AD55] text-[#F6AD55]" : ""}
            />
            <span className="hidden sm:inline">
              {bookmarked ? "Saved" : "Save"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default MemoryCard;