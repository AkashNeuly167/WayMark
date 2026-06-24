import { Grid3X3, Home, PlusCircle, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";

function MobileBottomNav() {
  const location = useLocation();
  const unreadCount = useUnreadNotifications();

  const isActive = (path) => location.pathname === path;

  const navClass = (path) =>
    `flex flex-col items-center gap-1 text-[11px] font-black transition ${
      isActive(path)
        ? "text-[#F6AD55]"
        : "text-slate-500 hover:text-white"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around rounded-t-[1.5rem] border-t border-white/10 bg-[#06111F]/95 shadow-[0_-18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl md:hidden">
      <Link className={navClass("/feed")} to="/feed">
        <Home size={22} />
        <span>Feed</span>
      </Link>

      <Link className={navClass("/explore")} to="/explore">
        <Search size={22} />
        <span>Explore</span>
      </Link>

      <Link
        to="/memories/create"
        className="grid h-14 w-14 -translate-y-4 place-items-center rounded-full bg-[#F6AD55] text-[#06111F] shadow-[0_14px_35px_rgba(246,173,85,0.35)] transition hover:bg-orange-300"
        aria-label="Create memory"
      >
        <PlusCircle size={34} />
      </Link>

      <Link className={navClass("/more")} to="/more">
        <div className="relative">
          <Grid3X3 size={22} />

          {unreadCount > 0 && (
            <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black leading-none text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

        <span>More</span>
      </Link>

      <Link className={navClass("/profile/me")} to="/profile/me">
        <User size={22} />
        <span>Profile</span>
      </Link>
    </nav>
  );
}

export default MobileBottomNav;