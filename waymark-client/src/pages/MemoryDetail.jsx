import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Loader2,
  Map,
  MapPin,
  MessageCircle,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import EditMemoryModal from "../components/memory/EditMemoryModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import MemoryDetailSkeleton from "../components/ui/MemoryDetailSkeleton";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";
import ImageCarousel from "../components/memory/ImageCarousel";

import {
  createMemoryComment,
  deleteMemory,
  deleteMemoryComment,
  getMemoryById,
  getMemoryComments,
  toggleLikeMemory,
} from "../services/memory.service";

function MemoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const { showToast } = useToast();

  const currentUserId = user?._id || user?.id;

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

  const [ownerMenuOpen, setOwnerMenuOpen] = useState(false);
  const [deleteMemoryOpen, setDeleteMemoryOpen] = useState(false);
  const [deleteMemoryLoading, setDeleteMemoryLoading] = useState(false);
  const [editMemoryOpen, setEditMemoryOpen] = useState(false);

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

  const getAvatarUrl = (person) => {
    if (!person?.avatar) return "";
    return typeof person.avatar === "string"
      ? person.avatar
      : person.avatar.url;
  };

  const getInitial = (person) => {
    return (
      person?.username?.charAt(0).toUpperCase() ||
      person?.fullName?.charAt(0).toUpperCase() ||
      "W"
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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

  const handleReplyClick = (comment) => {
    const username =
      comment.author?.username || comment.author?.fullName || "traveler";

    setCommentText(`@${username} `);

    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 50);
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

      showToast({
        type: "error",
        title: "Comment failed",
        message: error.response?.data?.message || "Could not add comment.",
      });
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

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId),
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
          error.response?.data?.message || "Could not delete this comment.",
      });

      setError(error.response?.data?.message || "Failed to delete comment.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteMemory = async () => {
    try {
      setDeleteMemoryLoading(true);
      setError("");

      await deleteMemory(id);

      showToast({
        type: "success",
        title: "Memory deleted",
        message: "Your memory was removed successfully.",
      });

      setDeleteMemoryOpen(false);
      navigate("/feed");
    } catch (error) {
      console.error("Delete memory error:", error);

      showToast({
        type: "error",
        title: "Delete failed",
        message:
          error.response?.data?.message || "Could not delete this memory.",
      });

      setError(error.response?.data?.message || "Failed to delete memory.");
    } finally {
      setDeleteMemoryLoading(false);
    }
  };

  const handleMemoryUpdated = (updatedMemory) => {
    setMemory((prevMemory) => ({
      ...prevMemory,
      ...updatedMemory,
    }));

    showToast({
      type: "success",
      title: "Memory updated",
      message: "Your memory changes were saved successfully.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-white">
        <MemoryDetailSkeleton />
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="flex h-screen items-center justify-center bg-transparent text-white">
        <div className="rounded-[2rem] border border-white/10 bg-[#101D2E] px-8 py-6 font-black shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
          Memory not found.
        </div>
      </div>
    );
  }

  const images = memory.images || [];

  const memoryAuthorId = memory.author?._id || memory.author;
  const isMemoryOwner =
    memoryAuthorId?.toString() === currentUserId?.toString();

  const alreadyLiked = memory.likes?.some((like) => {
    const likeId = typeof like === "string" ? like : like?._id;
    return likeId?.toString() === currentUserId?.toString();
  });

  const memoryAuthorAvatarUrl = getAvatarUrl(memory.author);
  const currentUserAvatarUrl = getAvatarUrl(user);

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

      <ConfirmDialog
        open={deleteMemoryOpen}
        title="Delete memory?"
        description="This memory, its image, likes, and comments will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMemoryLoading}
        onConfirm={handleDeleteMemory}
        onClose={() => setDeleteMemoryOpen(false)}
      />

      <div className="min-h-screen bg-transparent text-white">
        <main className="mx-auto max-w-[1400px] px-4 pb-28 pt-5 md:px-8 md:pt-7">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-5 py-4 font-semibold text-red-300">
              {error}
            </div>
          )}

          <section className="relative mb-6 h-[58vh] min-h-[420px] overflow-hidden rounded-[2rem] bg-[#06111F] shadow-[0_24px_80px_rgba(0,0,0,0.34)] ring-1 ring-white/10 md:h-[72vh]">
            <ImageCarousel
              images={images}
              title={memory.title}
              className="h-full !aspect-auto"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06111F] via-[#06111F]/45 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-10">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-300">
                <MapPin size={16} className="text-[#F6AD55]" />
                <span>{memory.locationName || memory.city}</span>
                <span>•</span>
                <span>
                  {[memory.city, memory.country].filter(Boolean).join(", ")}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">
                  {formatDate(memory.createdAt)}
                </span>
              </div>

              <div className="flex items-end justify-between gap-5">
                <h1 className="max-w-3xl text-4xl font-black leading-tight text-white drop-shadow-lg md:text-6xl">
                  {memory.title}
                </h1>

                {isMemoryOwner && (
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setOwnerMenuOpen((prev) => !prev)}
                      className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur transition hover:bg-white/15"
                      aria-label="Memory actions"
                    >
                      <MoreVertical size={22} />
                    </button>

                    {ownerMenuOpen && (
                      <div className="absolute bottom-14 right-0 z-20 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#101D2E] text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                        <button
                          type="button"
                          onClick={() => {
                            setOwnerMenuOpen(false);
                            setEditMemoryOpen(true);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-black text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          <Pencil size={16} />
                          Edit memory
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setOwnerMenuOpen(false);
                            setDeleteMemoryOpen(true);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-black text-red-400 transition hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                          Delete memory
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="space-y-6 lg:col-span-8">
              <article className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-8">
                <div className="mb-7 flex items-center justify-between gap-5 border-b border-white/10 pb-7">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#F6AD55] to-orange-600 text-lg font-black text-white ring-1 ring-white/10">
                      {memoryAuthorAvatarUrl ? (
                        <img
                          src={memoryAuthorAvatarUrl}
                          alt={memory.author?.username || "Author"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitial(memory.author)
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-black text-white">
                        {memory.author?.fullName ||
                          memory.author?.username ||
                          "Unknown traveler"}
                      </h3>
                      <p className="text-sm font-medium text-slate-500">
                        Shared this memory
                      </p>
                    </div>
                  </div>
                </div>

                <blockquote className="text-lg italic leading-8 text-slate-300 md:text-xl">
                  “{memory.description}”
                </blockquote>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={handleLike}
                      disabled={likeLoading}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 font-black transition disabled:opacity-60 ${
                        alreadyLiked
                          ? "bg-red-500/10 text-red-400"
                          : "text-slate-400 hover:bg-[#F6AD55]/10 hover:text-[#F6AD55]"
                      }`}
                    >
                      {likeLoading ? (
                        <Loader2 size={21} className="animate-spin" />
                      ) : (
                        <Heart
                          size={21}
                          className={alreadyLiked ? "fill-red-400" : ""}
                        />
                      )}
                      {memory.likes?.length || 0}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        commentsRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                        commentInputRef.current?.focus();
                      }}
                      className="flex items-center gap-2 rounded-full px-4 py-2 font-black text-slate-400 transition hover:bg-[#F6AD55]/10 hover:text-[#F6AD55]"
                    >
                      <MessageCircle size={21} />
                      {comments.length}
                    </button>
                  </div>
                </div>
              </article>

              <section
                id="comments"
                ref={commentsRef}
                className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] md:p-7"
              >
                <div className="mb-7">
                  <h2 className="text-2xl font-black text-white">
                    Community Discussion
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {comments.length} comment{comments.length === 1 ? "" : "s"}{" "}
                    on this memory
                  </p>
                </div>

                <form
                  onSubmit={handleCommentSubmit}
                  className="mb-9 flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.16)] md:p-5"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#F6AD55] to-orange-600 text-xs font-black text-white ring-1 ring-white/10">
                    {currentUserAvatarUrl ? (
                      <img
                        src={currentUserAvatarUrl}
                        alt={user?.username || "You"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitial(user)
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <textarea
                      ref={commentInputRef}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add to the story..."
                      rows={3}
                      className="dark-input w-full resize-none rounded-2xl border border-white/10 bg-[#06111F] px-4 py-3 text-sm font-semibold leading-6 !text-white caret-[#F6AD55] outline-none placeholder:!text-slate-600 focus:border-[#F6AD55]/60 focus:ring-4 focus:ring-[#F6AD55]/10"
                    />

                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={commentLoading || !commentText.trim()}
                        className="rounded-full bg-[#F6AD55] px-6 py-2.5 text-sm font-black text-[#06111F] shadow-[0_16px_40px_rgba(246,173,85,0.18)] transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {commentLoading ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </div>
                </form>

                {comments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.04] p-7 text-center">
                    <h3 className="text-base font-black text-white">
                      No comments yet
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Be the first one to add to the story.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {comments.map((comment) => {
                      const commentAuthorId =
                        comment.author?._id || comment.author;
                      const isCommentOwner =
                        commentAuthorId?.toString() ===
                        currentUserId?.toString();

                      const commentAvatarUrl = getAvatarUrl(comment.author);

                      const commentAuthorName =
                        comment.author?.fullName ||
                        comment.author?.username ||
                        "Unknown traveler";

                      return (
                        <div key={comment._id} className="flex gap-4">
                          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#F6AD55] to-orange-600 text-xs font-black text-white ring-1 ring-white/10">
                            {commentAvatarUrl ? (
                              <img
                                src={commentAvatarUrl}
                                alt={commentAuthorName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitial(comment.author)
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <span className="font-black text-white">
                                {commentAuthorName}
                              </span>

                              <span className="rounded-full bg-[#F6AD55]/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#F6AD55]">
                                Traveler
                              </span>

                              <span className="text-xs font-medium text-slate-600">
                                {formatCommentTime(comment.createdAt)}
                              </span>
                            </div>

                            <p className="text-[15px] leading-7 text-slate-300">
                              {comment.text}
                            </p>

                            <div className="mt-2 flex items-center gap-4 text-xs font-black text-slate-500">
                              <button
                                type="button"
                                onClick={() => handleReplyClick(comment)}
                                className="transition hover:text-[#F6AD55]"
                              >
                                Reply
                              </button>

                              {isCommentOwner && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteCommentId(comment._id)
                                  }
                                  className="transition hover:text-red-400"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </section>

            <aside className="space-y-6 lg:col-span-4">
              <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
                <h4 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[#F6AD55]">
                  Location Details
                </h4>

                <div className="space-y-3">
                  <DetailBox
                    label="Place"
                    value={memory.locationName || "Unknown place"}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <DetailBox label="City" value={memory.city || "Unknown"} />
                    <DetailBox
                      label="Country"
                      value={memory.country || "Unknown"}
                    />
                  </div>

                  <DetailBox label="Shared" value={formatDate(memory.createdAt)} />
                </div>
              </section>

              <section className="overflow-hidden rounded-[2rem] border border-[#F6AD55]/20 bg-gradient-to-br from-[#1A365D] to-[#06111F] p-1 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
                <div className="relative h-64 overflow-hidden rounded-[1.75rem] bg-[#06111F]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(246,173,85,0.28),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.08)_75%,transparent_75%,transparent)] bg-[length:100%_100%,42px_42px]" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-5 animate-ping rounded-full bg-[#F6AD55]/35" />
                      <div className="relative h-5 w-5 rounded-full border-2 border-white bg-[#F6AD55] shadow-lg" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                          Coordinates
                        </p>

                        <p className="mt-1 truncate text-xs font-black">
                          {memory.coordinates?.lat && memory.coordinates?.lng
                            ? `${memory.coordinates.lat}, ${memory.coordinates.lng}`
                            : "Coordinates not added"}
                        </p>
                      </div>

                      <Map size={20} className="shrink-0 text-white" />
                    </div>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </main>

        {editMemoryOpen && (
          <EditMemoryModal
            memory={memory}
            onClose={() => setEditMemoryOpen(false)}
            onUpdated={handleMemoryUpdated}
          />
        )}
      </div>
    </>
  );
}

function DetailBox({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}

export default MemoryDetail;