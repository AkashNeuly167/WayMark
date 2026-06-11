import TopNavbar from "../components/navigation/TopNavbar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import StoriesBar from "../components/feed/StoriesBar";
import FeaturedMemoryCard from "../components/feed/FeaturedMemoryCard";
import MemoryCard from "../components/feed/MemoryCard";
import RightSidebar from "../components/feed/RightSidebar";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getMemories } from "../services/memory.service";
import { useNavigate } from "react-router-dom";

function Feed() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const data = await getMemories();
        setMemories(data.memories || data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading memories...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <TopNavbar />

      <main className="mx-auto grid max-w-[1500px] grid-cols-1 gap-10 px-4 pb-10 pt-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:pb-12">
        <section className="min-w-0">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#0A2342]">
                Good morning, Akash 👋
              </h1>

              <p className="mt-2 text-gray-500">
                Ready for your next adventure?
              </p>
            </div>

            <button className="rounded-2xl bg-[#F6AD55] px-6 py-3 font-semibold text-white">
              Share Memory
            </button>
          </div>

          <StoriesBar />

          <div className="mt-10 space-y-10">
            <FeaturedMemoryCard />

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
              {memories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          </div>
        </section>

        <RightSidebar />
      </main>

      <button
        onClick={() => navigate("/memories/create")}
        className="fixed bottom-8 right-8 hidden h-16 w-16 items-center justify-center rounded-full bg-[#F6AD55] text-white shadow-xl transition hover:scale-110 lg:flex cursor-pointer"
      >
        <Plus size={30} strokeWidth={2.5} />
      </button>

      <MobileBottomNav />
    </div>
  );
}

export default Feed;
