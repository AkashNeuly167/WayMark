import { Bell, Compass, Plus, Search, Settings } from "lucide-react";
import { Link } from "react-router-dom";

function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#DDE3EA] bg-[#F7FAFC]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8">
        <Link to="/feed" className="text-2xl font-bold text-[#002045]">
          Waymark
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-[#002045]/70 md:flex">
          <Link className="text-[#F6AD55]" to="/feed">Feed</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/journeys">Journeys</Link>
          <Link to="/profile/me">Passport</Link>
        </nav>

        <div className="hidden w-[260px] items-center gap-3 rounded-full border border-[#C8D0DA] bg-white px-4 py-2 lg:flex">
          <Search size={18} className="text-[#002045]/50" />
          <input
            placeholder="Search destinations..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#002045]/40"
          />
        </div>

        <div className="flex items-center gap-4">
          <Bell size={20} />
          <Settings size={20} className="hidden md:block" />

          <Link
            to="/memories/create"
            className="hidden items-center gap-2 rounded-full bg-[#F6AD55] px-4 py-2 text-sm font-bold text-white md:flex"
          >
            <Plus size={16} />
            Create
          </Link>

          <div className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#F6AD55] bg-white">
            <Compass size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;