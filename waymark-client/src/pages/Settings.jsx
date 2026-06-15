import { useState } from "react";
import {
  Bell,
  Lock,
  LogOut,
  Palette,
  Shield,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import TopNavbar from "../components/navigation/TopNavbar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import ConfirmDialog from "../components/ui/ConfirmDialog";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const settingsItems = [
  {
    title: "Account",
    description: "Manage your profile and personal details.",
    icon: UserRound,
  },
  {
    title: "Privacy",
    description: "Control who can view your travel activity.",
    icon: Shield,
  },
  {
    title: "Security",
    description: "Password and login protection settings.",
    icon: Lock,
  },
  {
    title: "Notifications",
    description: "Manage likes, comments, and follow alerts.",
    icon: Bell,
  },
  {
    title: "Appearance",
    description: "Theme and display preferences.",
    icon: Palette,
  },
];

function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    logout();

    showToast({
      type: "success",
      title: "Logged out",
      message: "You have been logged out successfully.",
    });

    navigate("/login", { replace: true });
  };

  return (
    <>
      <ConfirmDialog
        open={logoutOpen}
        title="Logout?"
        description="You will be signed out of your WayMark account."
        confirmText="Logout"
        cancelText="Cancel"
        loading={false}
        onConfirm={handleLogout}
        onClose={() => setLogoutOpen(false)}
      />

      <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
        <TopNavbar />

        <main className="mx-auto max-w-5xl px-4 pb-28 pt-8 md:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold">Settings</h1>
            <p className="mt-2 text-[#002045]/60">
              Manage your WayMark account preferences.
            </p>
          </div>

          <div className="space-y-4">
            {settingsItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  type="button"
                  className="flex w-full items-center gap-4 rounded-3xl border border-[#D8DEE6] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#F6AD55]">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">{item.title}</h2>
                    <p className="mt-1 text-sm text-[#002045]/60">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-3xl border border-red-100 bg-white p-5 font-semibold text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </main>

        <MobileBottomNav />
      </div>
    </>
  );
}

export default Settings;