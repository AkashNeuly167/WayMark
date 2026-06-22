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
      className="group cursor-pointer overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={authorName}
              className="h-10 w-10 shrink-0 rounded-2xl object-cover ring-2 ring-slate-100"
            />
          ) : (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#1A365D] to-[#002045] text-sm font-black text-white shadow-md">
              {authorInitial}
            </div>
          )}

          <div className="min-w-0">
            <h4 className="truncate text-sm font-black text-slate-950">
              {authorName}
            </h4>

            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <Calendar size={11} />
              <span>{formatDate(memory.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-slate-100">
        <ImageCarousel
          images={memory.images || []}
          title={memory.title}
          variant="feed"
          className="h-[300px] !aspect-auto md:h-[390px] xl:h-[420px]"
        />
      </div>

      <div className="p-4 md:p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-1 text-xl font-black leading-tight text-[#002045] md:text-2xl">
              {memory.title}
            </h3>

            {(memory.city || memory.country) && (
              <div className="mt-2 flex max-w-full items-center gap-1.5 text-xs font-black text-orange-500">
                <MapPin size={13} className="shrink-0" />
                <span className="truncate">
                  {[memory.locationName, memory.city, memory.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>

          <span className="mt-1 hidden shrink-0 rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 transition group-hover:bg-orange-50 group-hover:text-orange-500 md:inline-flex">
            View
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {memory.description}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-black transition-all duration-200 disabled:opacity-50 ${
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
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-black text-slate-600 transition-all duration-200 hover:bg-orange-50 hover:text-orange-500"
            >
              <MessageCircle size={18} />
              <span>{memory.commentsCount || 0}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleBookmark}
            disabled={bookmarkLoading}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-black transition disabled:opacity-60 ${
              bookmarked
                ? "bg-orange-50 text-orange-500"
                : "text-slate-600 hover:bg-orange-50 hover:text-orange-500"
            }`}
            aria-label={bookmarked ? "Remove from saved" : "Save memory"}
          >
            <Bookmark
              size={18}
              className={bookmarked ? "fill-orange-500 text-orange-500" : ""}
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
