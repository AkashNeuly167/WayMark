import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useAuth } from "../context/AuthContext";

import TopNavbar from "../components/navigation/TopNavbar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import { useToast } from "../context/ToastContext";
import {
  createMemoryComment,
  getMemoryById,
  getMemoryComments,
  toggleLikeMemory,
  deleteMemoryComment,
} from "../services/memory.service";
import MemoryDetailSkeleton from "../components/ui/MemoryDetailSkeleton";

function MemoryDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;
  const location = useLocation();
  const commentsRef = useRef(null);
  const commentInputRef = useRef(null);
  const [memory, setMemory] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchMemoryDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const memoryRes = await getMemoryById(id);
        const commentsRes = await getMemoryComments(id);

        setMemory(memoryRes.memory);
        setComments(commentsRes.comments || []);
      } catch (error) {
        console.error("Fetch memory detail error:", error);
        setError("Failed to load memory.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemoryDetail();
  }, [id]);

  useEffect(() => {
    const shouldFocusComment =
      location.hash === "#comments" || location.state?.focusComment;

    if (!loading && shouldFocusComment) {
      setTimeout(() => {
        commentsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        commentInputRef.current?.focus();
      }, 150);
    }
  }, [loading, location.hash, location.state?.focusComment]);

  const refreshMemoryAndComments = async () => {
    const memoryRes = await getMemoryById(id);
    const commentsRes = await getMemoryComments(id);

    setMemory(memoryRes.memory);
    setComments(commentsRes.comments || []);
  };

  const handleLike = async () => {
    try {
      setLikeLoading(true);
      setError("");

      await toggleLikeMemory(id);
      await refreshMemoryAndComments();
    } catch (error) {
      console.error("Like error:", error);
      setError(error.response?.data?.message || "Failed to like memory.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {
      setCommentLoading(true);
      setError("");

      await createMemoryComment(id, commentText.trim());

      setCommentText("");
      await refreshMemoryAndComments();
      showToast({
        type: "success",
        title: "Comment added",
        message: "Your comment is now visible on this memory.",
      });
    } catch (error) {
      console.error("Comment error:", error);
      setError(error.response?.data?.message || "Failed to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

 const handleDeleteComment = async () => {
  if (!deleteCommentId) return;

  const commentId = deleteCommentId;

  try {
    setDeleteLoading(true);
    setError("");

    await deleteMemoryComment(commentId);

    // update UI instantly
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );

    setMemory((prevMemory) => ({
      ...prevMemory,
      commentsCount: Math.max((prevMemory?.commentsCount || 1) - 1, 0),
    }));

    setDeleteCommentId(null);

    showToast({
      type: "success",
      title: "Comment deleted",
      message: "The comment was removed successfully.",
    });

    // optional background refresh, but don't show failed if this has issue
    try {
      await refreshMemoryAndComments();
    } catch (refreshError) {
      console.error("Refresh after delete failed:", refreshError);
    }
  } catch (error) {
    console.error("Delete comment error:", error);

    showToast({
      type: "error",
      title: "Delete failed",
      message:
        error.response?.data?.message ||
        "Could not delete this comment.",
    });

    setError(error.response?.data?.message || "Failed to delete comment.");
  } finally {
    setDeleteLoading(false);
  }
};

  if (loading) {
  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <TopNavbar />
      <MemoryDetailSkeleton />
      <MobileBottomNav />
    </div>
  );
}

  if (!memory) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7FAFC] text-[#002045]">
        Memory not found.
      </div>
    );
  }

  const image = memory.images?.[0]?.url || memory.images?.[0];

  return (
    <>
      <ConfirmDialog
        open={Boolean(deleteCommentId)}
        title="Delete comment?"
        description="This comment will be permanently removed from this memory."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={handleDeleteComment}
        onClose={() => setDeleteCommentId(null)}
      />

      <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
        <TopNavbar />

        <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-8">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
              {error}
            </div>
          )}

          <section className="overflow-hidden rounded-3xl border border-[#D8DEE6] bg-white shadow-sm">
            {image ? (
              <img
                src={image}
                alt={memory.title}
                className="h-[280px] w-full object-cover md:h-[450px]"
              />
            ) : (
              <div className="flex h-[280px] w-full items-center justify-center bg-[#E8EDF2] md:h-[450px]">
                <p className="text-[#002045]/50">No image uploaded</p>
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-[#F6AD55]">
                <MapPin size={18} />
                <span>
                  {memory.city}, {memory.country}
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-bold text-[#002045] md:text-5xl">
                {memory.title}
              </h1>

              <p className="mt-3 text-[#002045]/60">
                by{" "}
                {memory.author?.fullName ||
                  memory.author?.username ||
                  "Unknown traveler"}
              </p>

              <p className="mt-6 text-base leading-7 text-[#002045]/75 md:text-lg md:leading-8">
                {memory.description}
              </p>

              <div className="mt-8 flex gap-4 border-t border-[#E5EAF0] pt-6">
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={likeLoading}
                  className="flex items-center gap-2 rounded-full border border-[#D8DEE6] px-4 py-2 transition hover:border-[#F6AD55] hover:text-[#F6AD55] disabled:opacity-60"
                >
                  {likeLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Heart size={20} />
                  )}
                  {memory.likes?.length || 0}
                </button>

                <div className="flex items-center gap-2 rounded-full border border-[#D8DEE6] px-4 py-2">
                  <MessageCircle size={20} />
                  {comments.length}
                </div>
              </div>
            </div>
          </section>

          <section
            id="comments"
            ref={commentsRef}
            className="mt-10 rounded-3xl border border-[#D8DEE6] bg-white p-6 shadow-sm md:p-8"
          >
            <h2 className="mb-6 text-2xl font-bold text-[#002045]">Comments</h2>

            <form onSubmit={handleCommentSubmit} className="mb-8 flex gap-3">
              <input
                ref={commentInputRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-2xl border border-[#D8DEE6] px-4 py-3 outline-none transition focus:border-[#F6AD55]"
              />

              <button
                type="submit"
                disabled={commentLoading}
                className="flex items-center justify-center rounded-2xl bg-[#F6AD55] px-5 text-white transition hover:bg-orange-400 disabled:opacity-60"
              >
                {commentLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>

            {comments.length === 0 ? (
              <p className="text-[#002045]/55">
                No comments yet. Be the first one.
              </p>
            ) : (
              <div className="space-y-5">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="rounded-2xl border border-[#E8EDF2] bg-[#F7FAFC] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-[#002045]">
                          {comment.author?.fullName ||
                            comment.author?.username ||
                            "Unknown user"}
                        </h4>

                        <p className="mt-2 text-[#002045]/70">{comment.text}</p>
                      </div>

                      {(comment.author?._id === currentUserId ||
                        comment.author === currentUserId) && (
                        <button
                          type="button"
                          onClick={() => setDeleteCommentId(comment._id)}
                          className="rounded-full p-2 text-red-500 transition hover:bg-red-50"
                          title="Delete comment"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}

export default MemoryDetail;
