import {
  BarChart3,
  Bell,
  Compass,
  Home,
  List,
  Map,
  Search,
  Settings,
  SquarePen,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useUnreadNotifications } from "../../hooks/useUnreadNotifications";

function DesktopSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const unreadCount = useUnreadNotifications();

  const navItems = [
    { label: "Feed", path: "/feed", icon: Home },
    { label: "Explore", path: "/explore", icon: Search },
    { label: "Journeys", path: "/journeys", icon: Map },
    { label: "Notifications", path: "/notifications", icon: Bell },
    { label: "Create", path: "/memories/create", icon: SquarePen },
    { label: "Bucket List", path: "/bucket-list", icon: List },
    { label: "Travel Wrapped", path: "/travel-wrapped", icon: BarChart3 },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  const profileName = user?.fullName || user?.username || "Waymark Traveler";

  const profileInitial = (user?.username || user?.fullName || "W")
    .charAt(0)
    .toUpperCase();

  const avatarUrl =
    typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url;

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col bg-transparent p-6 text-white md:flex">
      <div>
        <h1 className="text-3xl font-black text-[#F6AD55]">Waymark</h1>
        <p className="mt-1 text-sm text-white/60">Modern Adventure</p>
      </div>

      <nav className="mt-12 flex flex-1 flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const isNotifications = item.path === "/notifications";

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 font-bold transition ${
                active
                  ? "bg-white/10 text-[#F6AD55]"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex min-w-0 items-center gap-4">
                <span className="relative">
                  <Icon size={20} />

                  {isNotifications && unreadCount > 0 && (
                    <span className="absolute -right-2.5 -top-2.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#F6AD55] px-1 text-[10px] font-black leading-none text-white shadow-md">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </span>

                <span className="truncate">{item.label}</span>
              </span>

              {active && (
                <span className="h-8 w-1 rounded-full bg-[#F6AD55]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-white/10 pt-5">
        <Link
          to="/profile/me"
          className={`flex items-center gap-3 rounded-2xl p-3 transition ${
            isActive("/profile/me") ? "bg-white/10" : "hover:bg-white/10"
          }`}
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#F6AD55] bg-white/10 font-black text-white">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profileName}
                className="h-full w-full object-cover"
              />
            ) : (
              profileInitial
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-white">
              {profileName}
            </p>
            <p className="text-xs text-white/50">View Profile</p>
          </div>

          <Compass size={18} className="ml-auto text-white/45" />
        </Link>
      </div>
    </aside>
  );
}

export default DesktopSidebar;