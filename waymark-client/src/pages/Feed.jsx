import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommentsSheet from "../components/comments/CommentsSheet";
import FeedMobileTopBar from "../components/navigation/FeedMobileTopBar";
import MemoryCard from "../components/feed/MemoryCard";
import RightSidebar from "../components/feed/RightSidebar";
import FeedSkeleton from "../components/ui/FeedSkeleton";

import { getFollowingFeed, getMemories } from "../services/memory.service";
import { useAuth } from "../context/AuthContext";

function Feed() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("discover");
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchMemories = async () => {
      try {
        setLoading(true);

        const data =
          activeTab === "following"
            ? await getFollowingFeed()
            : await getMemories();

        if (!ignore) {
          setMemories(data.memories || []);
        }
      } catch (error) {
        console.error("Fetch memories error:", error);

        if (!ignore) {
          setMemories([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchMemories();

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

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <FeedMobileTopBar />

      <main className="">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-5 pb-28 pt-8 md:px-10 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0">
            <div className="mb-8 flex items-start justify-between gap-5">
              <div>
                <h1 className="max-w-[420px] text-4xl font-black leading-tight text-[#1A365D] md:text-5xl">
                  {greeting}, {firstName}
                </h1>

                <p className="mt-2 text-sm font-medium text-[#002045]/55 md:text-base">
                  Ready for your next milestone?
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/memories/create")}
                className="mt-2 inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#F6AD55] px-5 py-4 text-sm font-black text-white shadow-md transition hover:bg-orange-400 md:px-7"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Share Memory</span>
                <span className="sm:hidden">Share</span>
              </button>
            </div>

            <div className="mb-8 rounded-3xl border border-[#D8DEE6] bg-white p-1 shadow-sm">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("discover")}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    activeTab === "discover"
                      ? "bg-[#002045] text-white shadow-sm"
                      : "text-[#002045]/55 hover:bg-[#F7FAFC] hover:text-[#002045]"
                  }`}
                >
                  Discover
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("following")}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    activeTab === "following"
                      ? "bg-[#002045] text-white shadow-sm"
                      : "text-[#002045]/55 hover:bg-[#F7FAFC] hover:text-[#002045]"
                  }`}
                >
                  Following
                </button>
              </div>
            </div>

            {loading ? (
              <FeedSkeleton />
            ) : memories.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[#D8DEE6] bg-white p-10 text-center shadow-sm">
                <h2 className="text-2xl font-black">{emptyTitle}</h2>

                <p className="mt-3 text-[#002045]/60">{emptyMessage}</p>

                <button
                  type="button"
                  onClick={() =>
                    activeTab === "following"
                      ? navigate("/explore")
                      : navigate("/memories/create")
                  }
                  className="mt-6 rounded-2xl bg-[#F6AD55] px-6 py-3 font-black text-white"
                >
                  {activeTab === "following"
                    ? "Explore Travelers"
                    : "Share Memory"}
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {featuredMemory && (
                  <MemoryCard
                    memory={featuredMemory}
                    onCommentClick={openComments}
                  />
                )}

                {gridMemories.length > 0 && (
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {gridMemories.map((memory) => (
                      <MemoryCard
                        key={memory._id}
                        memory={memory}
                        onCommentClick={openComments}
                      />
                    ))}
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
