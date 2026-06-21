import { Grid3X3, Home, PlusCircle, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";

function MobileBottomNav() {
  const location = useLocation();
  const unreadCount = useUnreadNotifications();

  const isActive = (path) => location.pathname === path;

  const navClass = (path) =>
    `flex flex-col items-center transition ${
      isActive(path) ? "text-[#F6AD55]" : "text-[#002045]"
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around rounded-t-2xl border-t border-[#DDE3EA] bg-white shadow-lg md:hidden">
      <Link className={navClass("/feed")} to="/feed">
        <Home size={22} />
        <span className="text-xs">Feed</span>
      </Link>

      <Link className={navClass("/explore")} to="/explore">
        <Search size={22} />
        <span className="text-xs">Explore</span>
      </Link>

      <Link to="/memories/create" className="text-[#F6AD55]">
        <PlusCircle size={36} />
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

        <span className="text-xs">More</span>
      </Link>

      <Link className={navClass("/profile/me")} to="/profile/me">
        <User size={22} />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  );
}

export default MobileBottomNav;