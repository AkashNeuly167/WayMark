import { X, Send, Loader2, } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  createMemoryComment,
  deleteMemoryComment,
  getMemoryComments,
} from "../../services/memory.service";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/useToast";

function CommentsSheet({ open, memory, onClose, onCommentCountChange }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const inputRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    if (!open || !memory?._id) return;

    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await getMemoryComments(memory._id);
        setComments(data.comments || []);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 200);
      } catch (error) {
        console.error("Fetch comments error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [open, memory?._id]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || !memory) return null;

  const getAvatarUrl = (person) => {
    if (!person?.avatar) return "";
    return typeof person.avatar === "string" ? person.avatar : person.avatar.url;
  };

  const getInitial = (person) => {
    return (
      person?.username?.charAt(0).toUpperCase() ||
      person?.fullName?.charAt(0).toUpperCase() ||
      "W"
    );
  };

  const formatCommentTime = (dateString) => {
    if (!dateString) return "now";

    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim() || posting) return;

    try {
      setPosting(true);

      await createMemoryComment(memory._id, commentText.trim());

      const data = await getMemoryComments(memory._id);
      const nextComments = data.comments || [];

      setComments(nextComments);
      setCommentText("");

      onCommentCountChange?.(memory._id, nextComments.length);
    } catch (error) {
      console.error("Post comment error:", error);

      showToast({
        type: "error",
        title: "Comment failed",
        message: error.response?.data?.message || "Could not post comment.",
      });
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (deletingId) return;

    try {
      setDeletingId(commentId);

      await deleteMemoryComment(commentId);

      setComments((prev) => {
        const next = prev.filter((comment) => comment._id !== commentId);
        onCommentCountChange?.(memory._id, next.length);
        return next;
      });
    } catch (error) {
      console.error("Delete comment error:", error);

      showToast({
        type: "error",
        title: "Delete failed",
        message: error.response?.data?.message || "Could not delete comment.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[999]">
      <button
        type="button"
        aria-label="Close comments"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <section className="absolute bottom-0 left-0 right-0 flex max-h-[82vh] flex-col rounded-t-[2rem] bg-white shadow-2xl md:left-1/2 md:top-1/2 md:max-h-[760px] md:w-[560px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[2rem]">
        <div className="flex items-center justify-between border-b border-[#E5EAF0] px-5 py-4">
          <div>
            <h2 className="text-lg font-black text-[#002045]">Comments</h2>
            <p className="text-xs font-medium text-[#002045]/45">
              {memory.title}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#F7FAFC] text-[#002045] transition hover:bg-[#E8EDF2]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-[#F6AD55]" size={26} />
            </div>
          ) : comments.length === 0 ? (
            <div className="py-10 text-center">
              <h3 className="font-black text-[#002045]">No comments yet</h3>
              <p className="mt-1 text-sm text-[#002045]/50">
                Be the first one to add to this memory.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => {
                const authorName =
                  comment.author?.fullName ||
                  comment.author?.username ||
                  "Traveler";

                const authorAvatar = getAvatarUrl(comment.author);

                const commentAuthorId = comment.author?._id || comment.author;
                const isCommentOwner =
                  commentAuthorId?.toString() === currentUserId?.toString();

                return (
                  <div key={comment._id} className="flex gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#1A365D] text-xs font-black text-white">
                      {authorAvatar ? (
                        <img
                          src={authorAvatar}
                          alt={authorName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitial(comment.author)
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-[#1A365D]">
                          {authorName}
                        </span>

                        <span className="text-xs font-medium text-[#002045]/40">
                          {formatCommentTime(comment.createdAt)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-[#002045]/75">
                        {comment.text}
                      </p>

                      <div className="mt-2 flex items-center gap-4 text-xs font-black text-[#002045]/45">
                        <button
                          type="button"
                          onClick={() => {
                            const username =
                              comment.author?.username ||
                              comment.author?.fullName ||
                              "traveler";

                            setCommentText(`@${username} `);
                            inputRef.current?.focus();
                          }}
                          className="transition hover:text-[#F6AD55]"
                        >
                          Reply
                        </button>

                        {isCommentOwner && (
                          <button
                            type="button"
                            onClick={() => handleDelete(comment._id)}
                            className="transition hover:text-red-500"
                          >
                            {deletingId === comment._id ? "Deleting..." : "Delete"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-t border-[#E5EAF0] bg-white px-5 py-4"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#1A365D] text-xs font-black text-white">
            {getAvatarUrl(user) ? (
              <img
                src={getAvatarUrl(user)}
                alt={user?.username || "You"}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitial(user)
            )}
          </div>

          <input
            ref={inputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="min-w-0 flex-1 rounded-full bg-[#F7FAFC] px-4 py-3 text-sm text-[#002045] outline-none placeholder:text-[#002045]/35"
          />

          <button
            type="submit"
            disabled={posting || !commentText.trim()}
            className="rounded-full bg-[#F6AD55] px-4 py-3 text-sm font-black text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {posting ? "..." : <Send size={17} />}
          </button>
        </form>
      </section>
    </div>
  );
}

export default CommentsSheet;