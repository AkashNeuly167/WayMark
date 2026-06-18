import {
  Bell,
  ChevronRight,
  Compass,
  Lock,
  LogOut,
  MapPinned,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";

function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    logout();

    showToast({
      type: "success",
      title: "Logged out",
      message: "You have been logged out successfully.",
    });

    navigate("/login");
  };

  const menuItems = [
    {
      title: "Profile",
      description: "View and edit your WayMark profile.",
      icon: User,
      action: () => navigate("/profile/me"),
      active: true,
    },
    {
      title: "Notifications",
      description: "View likes, comments, and follow notifications.",
      icon: Bell,
      action: () => navigate("/notifications"),
      active: true,
    },
    {
      title: "Bucket List",
      description: "Manage places you want to visit.",
      icon: MapPinned,
      action: () => navigate("/bucket-list"),
      active: true,
    },
    {
      title: "Travel Wrapped",
      description: "See your yearly travel summary.",
      icon: Sparkles,
      action: () => navigate("/travel-wrapped"),
      active: true,
    },
  ];

  const comingSoonItems = [
    {
      title: "Privacy Controls",
      description: "Private profile and visibility controls need backend support.",
      icon: Shield,
    },
    {
      title: "Security",
      description: "Password change and login alerts need backend support.",
      icon: Lock,
    },
    {
      title: "Appearance",
      description: "Theme customization can be added later.",
      icon: Compass,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F7FAFC] px-4 py-6 pb-28 md:px-8 md:ml-64 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#002045] md:text-4xl">
            Settings
          </h1>
          <p className="mt-2 text-[#002045]/60">
            Manage your account and WayMark preferences.
          </p>
        </div>

        <section className="mb-6 rounded-[2rem] border border-[#DDE3EA] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-[#F6AD55]">
                <User size={28} />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#002045]">
                  {user?.username || user?.fullName || "WayMark Traveler"}
                </h2>
                <p className="mt-1 text-sm text-[#002045]/60">
                  {user?.email || "Manage your WayMark account"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/profile/me")}
              className="rounded-full bg-[#F6AD55] px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-400"
            >
              Edit Profile
            </button>
          </div>
        </section>

        <section className="mb-6">
          <h3 className="mb-3 text-lg font-black text-[#002045]">
            Quick Actions
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={item.action}
                  className="flex items-center gap-4 rounded-[1.7rem] border border-[#DDE3EA] bg-white p-5 text-left shadow-sm transition hover:border-[#F6AD55] hover:shadow-md"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-[#F6AD55]">
                    <Icon size={22} />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-[#002045]">{item.title}</h4>
                    <p className="mt-1 text-sm text-[#002045]/60">
                      {item.description}
                    </p>
                  </div>

                  <ChevronRight className="text-[#002045]/35" size={20} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-6">
          <h3 className="mb-3 text-lg font-black text-[#002045]">
            Coming Soon
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            {comingSoonItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[1.7rem] border border-dashed border-[#C8D0DA] bg-white/70 p-5"
                >
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#F7FAFC] text-[#002045]/45">
                    <Icon size={22} />
                  </div>

                  <h4 className="font-bold text-[#002045]">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-[#002045]/55">
                    {item.description}
                  </p>

                  <span className="mt-4 inline-flex rounded-full bg-[#F7FAFC] px-3 py-1 text-xs font-bold text-[#002045]/50">
                    Backend required
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-[2rem] border border-red-100 bg-red-50 p-6">
          <h3 className="text-lg font-black text-red-600">Account</h3>
          <p className="mt-2 text-sm text-red-500/75">
            Logout from this device. You can login again anytime.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </section>
      </div>
    </main>
  );
}

export default Settings;