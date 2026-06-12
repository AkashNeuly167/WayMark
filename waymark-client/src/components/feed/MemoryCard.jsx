import { useState } from "react";
import { Bookmark, Heart, MapPin, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { toggleLikeMemory } from "../../services/memory.service";
import { useAuth } from "../../context/AuthContext";

function MemoryCard({ memory }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user?._id || user?.id;

  const image = memory.images?.[0]?.url || memory.images?.[0];

  const alreadyLiked = memory.likes?.some((like) => {
    const likeId = typeof like === "string" ? like : like?._id;
    return likeId?.toString() === userId?.toString();
  });

  const getStoredBookmarks = () => {
    try {
      return JSON.parse(localStorage.getItem("waymark_bookmarks")) || [];
    } catch {
      return [];
    }
  };

  const [liked, setLiked] = useState(alreadyLiked || false);
  const [likesCount, setLikesCount] = useState(memory.likes?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const [bookmarked, setBookmarked] = useState(() =>
    getStoredBookmarks().includes(memory._id)
  );

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

      const nextLiked = !liked;

      setLiked(nextLiked);
      setLikesCount((prev) =>
        nextLiked ? prev + 1 : Math.max(prev - 1, 0)
      );

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
    }
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    navigate(`/memories/${memory._id}#comments`, {
      state: { focusComment: true },
    });
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const bookmarks = getStoredBookmarks();

    let updatedBookmarks;

    if (bookmarked) {
      updatedBookmarks = bookmarks.filter((id) => id !== memory._id);
    } else {
      updatedBookmarks = [...new Set([...bookmarks, memory._id])];
    }

    localStorage.setItem(
      "waymark_bookmarks",
      JSON.stringify(updatedBookmarks)
    );

    setBookmarked(!bookmarked);
  };

  return (
    <article
      onClick={handleCardClick}
      className="cursor-pointer overflow-hidden rounded-3xl border border-[#D8DEE6] bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative">
        {image ? (
          <img
            src={image}
            alt={memory.title}
            className="h-[280px] w-full object-cover"
          />
        ) : (
          <div className="flex h-[280px] w-full items-center justify-center bg-[#E8EDF2]">
            <p className="text-[#002045]/50">No image uploaded</p>
          </div>
        )}

        <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 backdrop-blur">
          <div className="flex items-center gap-1 text-sm font-medium text-[#002045]">
            <MapPin size={14} />
            {memory.city}, {memory.country}
          </div>
        </div>
      </div>

      <div className="p-5">
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

        <h3 className="text-xl font-bold text-[#002045]">{memory.title}</h3>

        <p className="mt-3 line-clamp-3 text-sm text-[#002045]/70">
          {memory.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-[#E5EAF0] pt-4">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-2 transition disabled:opacity-60 ${
                liked ? "text-red-500" : "text-[#002045]"
              } hover:text-red-500`}
            >
              <Heart
                size={18}
                className={liked ? "fill-red-500 text-red-500" : ""}
              />
              <span>{likesCount}</span>
            </button>

            <button
              type="button"
              onClick={handleCommentClick}
              className="flex items-center gap-2 text-[#002045] transition hover:text-[#F6AD55]"
            >
              <MessageCircle size={18} />
              <span>{memory.commentsCount || 0}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleBookmark}
            className={`transition ${
              bookmarked ? "text-[#F6AD55]" : "text-[#002045]"
            } hover:text-[#F6AD55]`}
          >
            <Bookmark
              size={18}
              className={
                bookmarked ? "fill-[#F6AD55] text-[#F6AD55]" : ""
              }
            />
          </button>
        </div>
      </div>
    </article>
  );
}

export default MemoryCard;