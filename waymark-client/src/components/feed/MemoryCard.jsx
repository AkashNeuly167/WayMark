import { useEffect, useState } from "react";
import {
  Bookmark,
  Calendar,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { toggleLikeMemory } from "../../services/memory.service";
import {
  getSavedMemoryIds,
  saveMemory,
  unsaveMemory,
} from "../../services/bookmark.service";
import { useAuth } from "../../context/AuthContext";
import ImageCarousel from "../memory/ImageCarousel";

function MemoryCard({ memory, onCommentClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user?._id || user?.id;

  const hasImages = memory.images && memory.images.length > 0;

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
      className="group cursor-pointer overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_24px_70px_rgba(15,23,42,0.16)]"
    >
      <div className="relative overflow-hidden">
        {hasImages ? (
          <ImageCarousel
            images={memory.images || []}
            title={memory.title}
            className="h-[280px] aspect-auto"
          />
        ) : (
          <div className="flex h-[280px] w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              No image uploaded
            </p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-75 transition-opacity duration-300 group-hover:opacity-85" />

        <button
          type="button"
          onClick={handleBookmark}
          disabled={bookmarkLoading}
          className={`absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/25 shadow-lg backdrop-blur-md transition disabled:opacity-60 ${
            bookmarked
              ? "bg-orange-500 text-white"
              : "bg-black/25 text-white hover:bg-white/20"
          }`}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark memory"}
        >
          <Bookmark
            size={18}
            className={bookmarked ? "fill-white text-white" : ""}
          />
        </button>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 p-5">
          <div className="mb-3 inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/20 bg-white/95 px-3 py-1.5 text-xs font-black text-slate-900 shadow-lg backdrop-blur">
            <MapPin size={14} className="shrink-0 text-orange-500" />
            <span className="truncate">
              {memory.city}, {memory.country}
            </span>
          </div>

          <h3 className="line-clamp-2 text-2xl font-black leading-tight text-white drop-shadow-md">
            {memory.title}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={authorName}
                className="h-11 w-11 rounded-2xl object-cover ring-2 ring-slate-100"
              />
            ) : (
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#1A365D] to-[#002045] text-sm font-black text-white shadow-md">
                {authorInitial}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate font-bold text-slate-950">{authorName}</h4>

            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Calendar size={12} />
              <span>{formatDate(memory.createdAt)}</span>
            </div>
          </div>
        </div>

        {(memory.locationName || memory.city || memory.country) && (
          <div className="mb-4 rounded-2xl bg-orange-50 px-4 py-3">
            <div className="flex items-start gap-2">
              <Navigation
                size={16}
                className="mt-0.5 shrink-0 text-orange-500"
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-orange-600">
                  {memory.locationName || memory.city}
                </p>
                <p className="mt-0.5 truncate text-xs font-semibold text-orange-500/75">
                  {memory.city}, {memory.country}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-600">
          {memory.description}
        </p>

        <div className="mb-5 flex flex-wrap gap-2">
          {memory.country && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              #{memory.country}
            </span>
          )}

          {memory.city && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              #{memory.city}
            </span>
          )}

          {memory.locationName && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              #{memory.locationName}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition-all duration-200 disabled:opacity-50 ${
                liked
                  ? "bg-red-50 text-red-500"
                  : "text-slate-600 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <Heart
                size={18}
                className={`transition-transform duration-200 ${
                  likeAnimating ? "scale-125" : "scale-100"
                } ${liked ? "fill-red-500 text-red-500" : ""}`}
              />
              <span>{likesCount}</span>
            </button>

            <button
              type="button"
              onClick={handleCommentClick}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 transition-all duration-200 hover:bg-orange-50 hover:text-orange-500"
            >
              <MessageCircle size={18} />
              <span>{memory.commentsCount || 0}</span>
            </button>
          </div>

          <span className="rounded-full bg-slate-50 px-3 py-2 text-xs font-black text-slate-400 transition group-hover:bg-orange-50 group-hover:text-orange-500">
            View story
          </span>
        </div>
      </div>
    </article>
  );
}

export default MemoryCard;