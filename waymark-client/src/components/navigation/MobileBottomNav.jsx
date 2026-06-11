import { Bell,  Home, PlusCircle, Search, User } from "lucide-react";
import { Link } from "react-router-dom";

function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around rounded-t-2xl border-t border-[#DDE3EA] bg-white shadow-lg md:hidden">
      <Link className="flex flex-col items-center text-[#F6AD55]" to="/feed">
        <Home size={22} />
        <span className="text-xs">Feed</span>
      </Link>

      <Link className="flex flex-col items-center text-[#002045]" to="/explore">
        <Search size={22} />
        <span className="text-xs">Explore</span>
      </Link>

      <Link to="/memories/create" className="text-[#F6AD55]">
        <PlusCircle size={36} />
      </Link>

      <Link className="flex flex-col items-center text-[#002045]" to="/notifications">
        <Bell size={22} />
        <span className="text-xs">Alerts</span>
      </Link>

      <Link className="flex flex-col items-center text-[#002045]" to="/profile/me">
        <User size={22} />
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  );
}

export default MobileBottomNav;