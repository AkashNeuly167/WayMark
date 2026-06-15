import { useEffect, useState } from "react";
import {
  Bell,
  Compass,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { getNotifications } from "../../services/notification.service";

function TopNavbar() {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await getNotifications();

        const unread = (data.notifications || []).filter(
          (notification) => !notification.isRead,
        ).length;

        setUnreadCount(unread);
      } catch (error) {
        console.error("Notification badge error:", error);
      }
    };

    fetchUnreadCount();
  }, []);

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `transition hover:text-[#F6AD55] ${
      isActive(path) ? "text-[#F6AD55]" : "text-[#002045]/70"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#DDE3EA] bg-[#F7FAFC]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 md:px-8">
        <Link to="/feed" className="text-2xl font-bold text-[#002045]">
          Waymark
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <Link className={navLinkClass("/feed")} to="/feed">
            Feed
          </Link>

          <Link className={navLinkClass("/explore")} to="/explore">
            Explore
          </Link>

          <Link className={navLinkClass("/journeys")} to="/journeys">
            Journeys
          </Link>

          <Link className={navLinkClass("/bucket-list")} to="/bucket-list">
            Bucket List
          </Link>

          <Link className={navLinkClass("/profile/me")} to="/profile/me">
            Passport
          </Link>
        </nav>

        <div className="hidden w-[260px] items-center gap-3 rounded-full border border-[#C8D0DA] bg-white px-4 py-2 lg:flex">
          <Search size={18} className="text-[#002045]/50" />
          <input
            placeholder="Search destinations..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#002045]/40"
          />
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/notifications"
            className="relative rounded-full p-2 text-[#002045] transition hover:bg-white hover:text-[#F6AD55]"
            aria-label="Notifications"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          <Settings size={20} className="hidden md:block" />

          <Link
            to="/memories/create"
            className="hidden items-center gap-2 rounded-full bg-[#F6AD55] px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-400 md:flex"
          >
            <Plus size={16} />
            Create
          </Link>

          <Link
            to="/profile/me"
            className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#F6AD55] bg-white text-[#002045]"
          >
            <Compass size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
