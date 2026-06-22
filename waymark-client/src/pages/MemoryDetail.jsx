import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  ImageOff,
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
      <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
        <MemoryDetailSkeleton />
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

  const images = memory.images || [];
  const heroImage = images[0]?.url || images[0];

  const galleryImages = images
    .map((imageItem) => imageItem?.url || imageItem)
    .filter(Boolean)
    .slice(1, 5);

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

      <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
        <main className="mx-auto max-w-[1400px] px-4 pb-28 pt-6  md:px-8 md:pt-8">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-600">
              {error}
            </div>
          )}

          <section className="relative mb-6 h-[58vh] min-h-[420px] overflow-hidden rounded-[2rem] bg-[#E8EDF2] shadow-xl md:h-[72vh]">
            {heroImage ? (
              <img
                src={heroImage}
                alt={memory.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#E8EDF2]">
                <ImageOff size={42} className="text-[#002045]/35" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#002045]/85 via-[#002045]/30 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-white/80">
                <MapPin size={16} />
                <span>{memory.locationName || memory.city}</span>
                <span>•</span>
                <span>
                  {memory.city}, {memory.country}
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
                      className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                      aria-label="Memory actions"
                    >
                      <MoreVertical size={22} />
                    </button>

                    {ownerMenuOpen && (
                      <div className="absolute bottom-14 right-0 z-20 w-44 overflow-hidden rounded-2xl border border-[#D8DEE6] bg-white text-[#002045] shadow-xl">
                        <button
                          type="button"
                          onClick={() => {
                            setOwnerMenuOpen(false);
                            setEditMemoryOpen(true);
                          }}
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold transition hover:bg-[#F7FAFC]"
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
                          className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
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
              <article className="rounded-[2rem] border border-[#D8DEE6] bg-white p-6 shadow-sm md:p-8">
                <div className="mb-7 flex items-center justify-between gap-5 border-b border-[#E5EAF0] pb-7">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#002045]/10 bg-[#1A365D] text-lg font-black text-white">
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
                      <h3 className="truncate text-lg font-black text-[#1A365D]">
                        {memory.author?.fullName ||
                          memory.author?.username ||
                          "Unknown traveler"}
                      </h3>
                      <p className="text-sm font-medium text-[#002045]/50">
                        Shared this memory
                      </p>
                    </div>
                  </div>
                </div>

                <blockquote className="text-lg italic leading-8 text-[#002045]/80 md:text-xl">
                  “{memory.description}”
                </blockquote>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#E5EAF0] pt-6">
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={handleLike}
                      disabled={likeLoading}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 font-black transition disabled:opacity-60 ${
                        alreadyLiked
                          ? "bg-red-50 text-red-500"
                          : "text-[#002045]/65 hover:bg-orange-50 hover:text-[#F6AD55]"
                      }`}
                    >
                      {likeLoading ? (
                        <Loader2 size={21} className="animate-spin" />
                      ) : (
                        <Heart
                          size={21}
                          className={alreadyLiked ? "fill-red-500" : ""}
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
                      className="flex items-center gap-2 rounded-full px-4 py-2 font-black text-[#002045]/65 transition hover:bg-orange-50 hover:text-[#F6AD55]"
                    >
                      <MessageCircle size={21} />
                      {comments.length}
                    </button>
                  </div>
                </div>
              </article>

              {galleryImages.length > 0 && (
                <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {galleryImages.map((imageUrl, index) => (
                    <div
                      key={`${imageUrl}-${index}`}
                      className="aspect-square overflow-hidden rounded-2xl bg-[#E8EDF2] shadow-sm"
                    >
                      <img
                        src={imageUrl}
                        alt={`${memory.title} gallery ${index + 1}`}
                        className="h-full w-full object-cover transition duration-700 hover:scale-110"
                      />
                    </div>
                  ))}
                </section>
              )}

              <section
                id="comments"
                ref={commentsRef}
                className="rounded-[2rem] border border-[#D8DEE6] bg-white p-5 shadow-sm md:p-7"
              >
                <div className="mb-7">
                  <h2 className="text-2xl font-black text-[#1A365D]">
                    Community Discussion
                  </h2>
                  <p className="mt-1 text-sm text-[#002045]/50">
                    {comments.length} comment{comments.length === 1 ? "" : "s"}{" "}
                    on this memory
                  </p>
                </div>

                <form
                  onSubmit={handleCommentSubmit}
                  className="mb-9 flex gap-4 rounded-3xl border border-[#D8DEE6]/70 bg-white p-4 shadow-sm md:p-5"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#1A365D] text-xs font-black text-white">
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
                      className="w-full resize-none rounded-2xl border-0 bg-[#F7FAFC] px-4 py-3 text-sm leading-6 text-[#002045] outline-none ring-0 placeholder:text-[#002045]/35 focus:ring-2 focus:ring-[#F6AD55]/40"
                    />

                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={commentLoading || !commentText.trim()}
                        className="rounded-full bg-[#F6AD55] px-6 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {commentLoading ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </div>
                </form>

                {comments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#D8DEE6] bg-[#F7FAFC] p-7 text-center">
                    <h3 className="text-base font-black text-[#002045]">
                      No comments yet
                    </h3>
                    <p className="mt-1 text-sm text-[#002045]/50">
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
                          <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[#1A365D] text-xs font-black text-white">
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
                              <span className="font-black text-[#1A365D]">
                                {commentAuthorName}
                              </span>

                              <span className="rounded-full bg-[#1A365D]/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#1A365D]/70">
                                Traveler
                              </span>

                              <span className="text-xs font-medium text-[#002045]/40">
                                {formatCommentTime(comment.createdAt)}
                              </span>
                            </div>

                            <p className="text-[15px] leading-7 text-[#002045]/75">
                              {comment.text}
                            </p>

                            <div className="mt-2 flex items-center gap-4 text-xs font-black text-[#002045]/45">
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
                                  className="transition hover:text-red-500"
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
              <section className="rounded-[2rem] border border-[#D8DEE6] bg-white p-6 shadow-sm">
                <h4 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[#1A365D]">
                  Location Details
                </h4>

                <div className="space-y-3">
                  <div className="rounded-2xl bg-[#F7FAFC] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#002045]/40">
                      Place
                    </p>
                    <p className="mt-1 font-black text-[#002045]">
                      {memory.locationName || "Unknown place"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-[#F7FAFC] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#002045]/40">
                        City
                      </p>
                      <p className="mt-1 font-black text-[#002045]">
                        {memory.city}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#F7FAFC] p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#002045]/40">
                        Country
                      </p>
                      <p className="mt-1 font-black text-[#002045]">
                        {memory.country}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#F7FAFC] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#002045]/40">
                      Shared
                    </p>
                    <p className="mt-1 font-black text-[#002045]">
                      {formatDate(memory.createdAt)}
                    </p>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-[2rem] bg-[#1A365D] p-1 shadow-xl">
                <div className="relative h-64 overflow-hidden rounded-[1.75rem] bg-[#0B132B]">
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

export default MemoryDetail;
