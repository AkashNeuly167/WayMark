import { useState } from "react";
import {
  Bell,
  Bookmark,
  ChevronRight,
  Compass,
  Loader2,
  Lock,
  LogOut,
  MapPinned,
  Save,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";
import { updateMyProfile } from "../services/user.service";

function Settings() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    country: user?.country || "",
    website: user?.website || "",
  });

  const profileName = user?.fullName || user?.username || "Waymark Traveler";

  const profileInitial = (user?.username || user?.fullName || "W")
    .charAt(0)
    .toUpperCase();

  const avatarUrl =
    typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const data = await updateMyProfile(formData);

      if (data.user) {
        updateUser?.(data.user);
      }

      showToast({
        type: "success",
        title: "Profile updated",
        message: "Your settings have been saved.",
      });
    } catch (error) {
      console.error("Update settings error:", error);

      showToast({
        type: "error",
        title: "Update failed",
        message: "Could not update your profile settings.",
      });
    } finally {
      setSaving(false);
    }
  };

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

  const quickActions = [
    {
      title: "Profile",
      description: "View your public Waymark profile.",
      icon: User,
      action: () => navigate("/profile/me"),
    },
    {
      title: "Notifications",
      description: "View likes, comments, and follow alerts.",
      icon: Bell,
      action: () => navigate("/notifications"),
    },
    {
      title: "Bucket List",
      description: "Manage places you want to visit.",
      icon: MapPinned,
      action: () => navigate("/bucket-list"),
    },
    {
      title: "Saved Memories",
      description: "Open memories you saved for later.",
      icon: Bookmark,
      action: () => navigate("/saved"),
    },
    {
      title: "Travel Wrapped",
      description: "See your yearly travel summary.",
      icon: Sparkles,
      action: () => navigate("/travel-wrapped"),
    },
  ];

  const comingSoonItems = [
    {
      title: "Privacy Controls",
      description:
        "Private profile and visibility controls need backend support.",
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
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-8 md:pt-10">
        <div className="mb-8">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
            Account Center
          </p>

          <h1 className="text-4xl font-black text-[#1A365D] md:text-5xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-[#002045]/60">
            Manage your Waymark profile, account shortcuts, and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-8">
            <div className="rounded-[2rem] border border-[#DDE3EA] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[#F6AD55] bg-[#1A365D] text-xl font-black text-white">
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
                    <h2 className="truncate text-xl font-black text-[#002045]">
                      {profileName}
                    </h2>

                    <p className="mt-1 truncate text-sm text-[#002045]/60">
                      {user?.email || "Manage your Waymark account"}
                    </p>

                    <p className="mt-1 text-xs font-bold text-[#F6AD55]">
                      @{user?.username || "waymark"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/profile/me")}
                  className="rounded-full bg-[#F6AD55] px-5 py-3 text-sm font-black text-white transition hover:bg-orange-400"
                >
                  View Profile
                </button>
              </div>
            </div>

            <form
              onSubmit={handleProfileSave}
              className="rounded-[2rem] border border-[#DDE3EA] bg-white p-6 shadow-sm"
            >
              <div className="mb-6">
                <h3 className="text-xl font-black text-[#1A365D]">
                  Profile Settings
                </h3>

                <p className="mt-1 text-sm text-[#002045]/55">
                  These details appear on your public traveler profile.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-black text-[#002045]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full rounded-2xl border border-[#D8DEE6] bg-[#F7FAFC] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#F6AD55] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-[#002045]">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                    className="w-full rounded-2xl border border-[#D8DEE6] bg-[#F7FAFC] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#F6AD55] focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-black text-[#002045]">
                    Website
                  </label>

                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full rounded-2xl border border-[#D8DEE6] bg-[#F7FAFC] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#F6AD55] focus:bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-black text-[#002045]">
                    Bio
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell travelers about yourself..."
                    className="w-full resize-none rounded-2xl border border-[#D8DEE6] bg-[#F7FAFC] px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#F6AD55] focus:bg-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1A365D] px-6 py-3 text-sm font-black text-white transition hover:bg-[#002045] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            <section>
              <h3 className="mb-3 text-lg font-black text-[#002045]">
                Quick Actions
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                {quickActions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={item.action}
                      className="flex items-center gap-4 rounded-[1.7rem] border border-[#DDE3EA] bg-white p-5 text-left shadow-sm transition hover:border-[#F6AD55] hover:shadow-md"
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-orange-50 text-[#F6AD55]">
                        <Icon size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-black text-[#002045]">
                          {item.title}
                        </h4>

                        <p className="mt-1 text-sm leading-5 text-[#002045]/60">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight
                        className="shrink-0 text-[#002045]/35"
                        size={20}
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          </section>

          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-[2rem] border border-[#DDE3EA] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-[#1A365D]">
                Account Info
              </h3>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl bg-[#F7FAFC] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#002045]/40">
                    Username
                  </p>
                  <p className="mt-1 truncate font-black text-[#002045]">
                    @{user?.username || "waymark"}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F7FAFC] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#002045]/40">
                    Email
                  </p>
                  <p className="mt-1 truncate font-black text-[#002045]">
                    {user?.email || "Not available"}
                  </p>
                </div>

                <div className="rounded-2xl bg-orange-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#F6AD55]">
                    Account Status
                  </p>
                  <p className="mt-1 font-black text-[#002045]">Active</p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#DDE3EA] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-[#1A365D]">
                Coming Soon
              </h3>

              <div className="mt-5 space-y-4">
                {comingSoonItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.4rem] border border-dashed border-[#C8D0DA] bg-[#F7FAFC] p-4"
                    >
                      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-white text-[#002045]/45">
                        <Icon size={20} />
                      </div>

                      <h4 className="font-black text-[#002045]">
                        {item.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-[#002045]/55">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[2rem] border border-red-100 bg-red-50 p-6">
              <h3 className="text-lg font-black text-red-600">Danger Zone</h3>

              <p className="mt-2 text-sm leading-6 text-red-500/75">
                Logout from this device. You can login again anytime.
              </p>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-500 px-5 py-3 text-sm font-black text-white transition hover:bg-red-600"
              >
                <LogOut size={18} />
                Logout
              </button>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Settings;