import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function FeedMobileTopBar() {
  const { user } = useAuth();

  const profileName = user?.fullName || user?.username || "Waymark Traveler";

  const profileInitial = (user?.username || user?.fullName || "W")
    .charAt(0)
    .toUpperCase();

  const avatarUrl =
    typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#06111F]/90 px-5 backdrop-blur-xl md:hidden">
      <Link to="/feed" className="text-2xl font-black tracking-tight text-white">
        Waymark
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/notifications"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-300 transition hover:bg-white/[0.1] hover:text-[#F6AD55]"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </Link>

        <Link
          to="/profile/me"
          className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border-2 border-[#F6AD55] bg-gradient-to-br from-[#F6AD55] to-orange-600 text-sm font-black text-white shadow-[0_10px_25px_rgba(246,173,85,0.22)]"
          aria-label="Profile"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={profileName}
              className="h-full w-full object-cover"
            />
          ) : (
            profileInitial
          )}
        </Link>
      </div>
    </header>
  );
}

export default FeedMobileTopBar;