import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import CommentsSheet from "../components/comments/CommentsSheet";
import FeedMobileTopBar from "../components/navigation/FeedMobileTopBar";
import MemoryCard from "../components/feed/MemoryCard";
import RightSidebar from "../components/feed/RightSidebar";
import FeedSkeleton from "../components/ui/FeedSkeleton";

import { getFollowingFeed, getMemories } from "../services/memory.service";
import { useAuth } from "../context/AuthContext";

const PAGE_LIMIT = 10;

function Feed() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("discover");
  const [memories, setMemories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);

  const fetchMemories = useCallback(
    async ({ nextPage = 1, append = false } = {}) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const data =
          activeTab === "following"
            ? await getFollowingFeed(nextPage, PAGE_LIMIT)
            : await getMemories(nextPage, PAGE_LIMIT);

        const nextMemories = data.memories || [];

        setMemories((prev) =>
          append ? [...prev, ...nextMemories] : nextMemories,
        );

        setPage(nextPage);
        setHasMore(Boolean(data.hasMore || data.hasNextPage));
      } catch (error) {
        console.error("Fetch memories error:", error);

        if (!append) {
          setMemories([]);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeTab],
  );

  useEffect(() => {
    let ignore = false;

    const loadFirstPage = async () => {
      try {
        setLoading(true);

        const data =
          activeTab === "following"
            ? await getFollowingFeed(1, PAGE_LIMIT)
            : await getMemories(1, PAGE_LIMIT);

        if (ignore) return;

        setMemories(data.memories || []);
        setPage(1);
        setHasMore(Boolean(data.hasMore || data.hasNextPage));
      } catch (error) {
        if (!ignore) {
          console.error("Fetch memories error:", error);
          setMemories([]);
          setHasMore(false);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadFirstPage();

    return () => {
      ignore = true;
    };
  }, [activeTab]);

  const featuredMemory = memories[0];

  const gridMemories = useMemo(() => {
    return memories.slice(1);
  }, [memories]);

  const firstName =
    user?.fullName?.split(" ")[0] || user?.username || "Traveler";

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const emptyTitle =
    activeTab === "following" ? "No following memories yet" : "No memories yet";

  const emptyMessage =
    activeTab === "following"
      ? "Follow travelers to see their memories here."
      : "Share your first travel memory to start your feed.";

  const openComments = (memory) => {
    setSelectedMemory(memory);
    setCommentsOpen(true);
  };

  const handleCommentCountChange = (memoryId, count) => {
    setMemories((prev) =>
      prev.map((memory) =>
        memory._id === memoryId ? { ...memory, commentsCount: count } : memory,
      ),
    );
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;

    fetchMemories({
      nextPage: page + 1,
      append: true,
    });
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <FeedMobileTopBar />

      <main>
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 pb-28 pt-4 md:px-8 md:pt-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-black tracking-tight text-white md:text-2xl">
                  {greeting}, {firstName} ☀️
                </h2>

                <p className="mt-1 text-xs font-semibold text-slate-400 md:text-sm">
                  See where travelers are going today.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/memories/create")}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#F6AD55] px-3.5 py-2.5 text-xs font-black text-[#06111F] shadow-[0_14px_35px_rgba(246,173,85,0.22)] transition hover:bg-orange-300 md:rounded-2xl md:px-5 md:py-3 md:text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Memory</span>
                <span className="sm:hidden">Post</span>
              </button>
            </div>

            <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.04] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("discover")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                    activeTab === "discover"
                      ? "bg-[#F6AD55] text-[#06111F] shadow-sm"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Discover
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("following")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                    activeTab === "following"
                      ? "bg-[#F6AD55] text-[#06111F] shadow-sm"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  Following
                </button>
              </div>
            </div>

            {loading ? (
              <FeedSkeleton />
            ) : memories.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#101D2E] p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.18)] md:p-10">
                <h2 className="text-xl font-black text-white md:text-2xl">
                  {emptyTitle}
                </h2>

                <p className="mt-2 text-sm text-slate-400 md:mt-3 md:text-base">
                  {emptyMessage}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    activeTab === "following"
                      ? navigate("/explore")
                      : navigate("/memories/create")
                  }
                  className="mt-5 rounded-2xl bg-[#F6AD55] px-5 py-2.5 text-sm font-black text-[#06111F] transition hover:bg-orange-300 md:mt-6 md:px-6 md:py-3"
                >
                  {activeTab === "following"
                    ? "Explore Travelers"
                    : "Share Memory"}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {featuredMemory && (
                  <MemoryCard
                    memory={featuredMemory}
                    onCommentClick={openComments}
                  />
                )}

                {gridMemories.length > 0 && (
                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {gridMemories.map((memory) => (
                      <MemoryCard
                        key={memory._id}
                        memory={memory}
                        onCommentClick={openComments}
                      />
                    ))}
                  </div>
                )}

                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#101D2E] px-6 py-3 text-sm font-black text-white transition hover:border-[#F6AD55]/40 hover:bg-[#14243A] disabled:opacity-60"
                    >
                      {loadingMore && (
                        <Loader2
                          size={18}
                          className="animate-spin text-[#F6AD55]"
                        />
                      )}
                      {loadingMore ? "Loading..." : "Load more"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          <RightSidebar memories={memories} />
        </div>
      </main>

      <CommentsSheet
        open={commentsOpen}
        memory={selectedMemory}
        onClose={() => setCommentsOpen(false)}
        onCommentCountChange={handleCommentCountChange}
      />
    </div>
  );
}

export default Feed;
