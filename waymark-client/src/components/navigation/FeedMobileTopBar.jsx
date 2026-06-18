import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function FeedMobileTopBar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#DDE3EA] bg-[#F7FAFC]/95 px-5 backdrop-blur md:hidden">
      <Link to="/feed" className="text-2xl font-black text-[#002045]">
        Waymark
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/notifications" className="text-[#002045]">
          <Bell size={20} />
        </Link>

        <Link
          to="/profile/me"
          className="grid h-9 w-9 place-items-center rounded-full bg-[#1A365D] text-sm font-black text-white"
        >
          {(user?.username || user?.fullName || "W").charAt(0).toUpperCase()}
        </Link>
      </div>
    </header>
  );
}

export default FeedMobileTopBar;