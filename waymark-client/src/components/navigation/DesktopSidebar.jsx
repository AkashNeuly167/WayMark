import { Compass, Home, Map, Search, SquarePen, } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DesktopSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: "Feed", path: "/feed", icon: Home },
    { label: "Explore", path: "/explore", icon: Search },
    { label: "Journeys", path: "/journeys", icon: Map },
    { label: "Passport", path: "/profile/me", icon: Compass },
    { label: "Create", path: "/memories/create", icon: SquarePen }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col bg-[#002045] p-6 text-white md:flex">
      <div>
        <h1 className="text-3xl font-black text-[#F6AD55]">Waymark</h1>
        <p className="mt-1 text-sm text-white/60">Modern Adventure</p>
      </div>

      <nav className="mt-12 flex flex-1 flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

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
              <span className="flex items-center gap-4">
                <Icon size={20} />
                {item.label}
              </span>

              {active && <span className="h-8 w-1 rounded-full bg-[#F6AD55]" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#F6AD55] bg-white/10 font-black text-white">
            {(user?.username || user?.fullName || "W").charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black">
              {user?.fullName || user?.username || "Waymark Traveler"}
            </p>
            <p className="text-xs text-white/50">Pro Explorer</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default DesktopSidebar;