import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DesktopSidebar from "../components/navigation/DesktopSidebar";
import FeedMobileTopBar from "../components/navigation/FeedMobileTopBar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import MemoryCard from "../components/feed/MemoryCard";
import RightSidebar from "../components/feed/RightSidebar";
import FeedSkeleton from "../components/ui/FeedSkeleton";

import { getMemories } from "../services/memory.service";
import { useAuth } from "../context/AuthContext";

function Feed() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchMemories = async () => {
      try {
        const data = await getMemories();

        if (!ignore) {
          setMemories(data.memories || []);
        }
      } catch (error) {
        console.error("Fetch memories error:", error);
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
  }, []);

  const featuredMemory = memories[0];

  const gridMemories = useMemo(() => {
    return memories.slice(1);
  }, [memories]);

  const firstName =
    user?.fullName?.split(" ")[0] || user?.username || "Traveler";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <DesktopSidebar />
      <FeedMobileTopBar />

      <main className="md:ml-64">
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

            {loading ? (
              <FeedSkeleton />
            ) : memories.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-[#D8DEE6] bg-white p-10 text-center shadow-sm">
                <h2 className="text-2xl font-black">No memories yet</h2>
                <p className="mt-3 text-[#002045]/60">
                  Share your first travel memory to start your feed.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/memories/create")}
                  className="mt-6 rounded-2xl bg-[#F6AD55] px-6 py-3 font-black text-white"
                >
                  Share Memory
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {featuredMemory && <MemoryCard memory={featuredMemory} />}

                {gridMemories.length > 0 && (
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {gridMemories.map((memory) => (
                      <MemoryCard key={memory._id} memory={memory} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

          <RightSidebar memories={memories} />
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default Feed;