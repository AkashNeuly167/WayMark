import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  ChevronRight,
  Eye,
  Lock,
  LogOut,
  Moon,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/useToast";

const SETTINGS_STORAGE_KEY = "waymark_settings";

const defaultSettings = {
  privacy: {
    privateProfile: false,
    showEmail: false,
    showCountry: true,
  },
  security: {
    loginAlerts: true,
    rememberDevice: true,
  },
  notifications: {
    likes: true,
    comments: true,
    follows: true,
  },
  appearance: {
    theme: "system",
    compactMode: false,
  },
};

const getInitialSettings = () => {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!savedSettings) return defaultSettings;

  try {
    const parsedSettings = JSON.parse(savedSettings);

    return {
      ...defaultSettings,
      privacy: {
        ...defaultSettings.privacy,
        ...parsedSettings.privacy,
      },
      security: {
        ...defaultSettings.security,
        ...parsedSettings.security,
      },
      notifications: {
        ...defaultSettings.notifications,
        ...parsedSettings.notifications,
      },
      appearance: {
        ...defaultSettings.appearance,
        ...parsedSettings.appearance,
      },
    };
  } catch {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    return defaultSettings;
  }
};

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-[#DDE3EA] bg-white p-5">
      <div>
        <h4 className="font-bold text-[#002045]">{title}</h4>
        <p className="mt-1 text-sm text-[#002045]/60">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition ${
          checked ? "bg-[#F6AD55]" : "bg-[#C8D0DA]"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState("account");
  const [settings, setSettings] = useState(getInitialSettings);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const sections = useMemo(
    () => [
      {
        id: "account",
        title: "Account Settings",
        description: "Manage your profile and account actions",
        icon: User,
      },
      {
        id: "privacy",
        title: "Privacy",
        description: "Control what others can see",
        icon: Eye,
      },
      {
        id: "security",
        title: "Security",
        description: "Manage login and safety options",
        icon: Shield,
      },
      {
        id: "notifications",
        title: "Notifications",
        description: "Choose what alerts you receive",
        icon: Bell,
      },
      {
        id: "appearance",
        title: "Appearance",
        description: "Customize your WayMark experience",
        icon: Moon,
      },
    ],
    []
  );

  const activeSectionData = sections.find(
    (section) => section.id === activeSection
  );

  const updateSetting = (section, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));

    showToast({
      type: "success",
      title: "Settings updated",
      message: "Your preference has been saved.",
    });
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

  const handleClearLocalSettings = () => {
    const confirmClear = window.confirm("Reset all local settings to default?");
    if (!confirmClear) return;

    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    setSettings(defaultSettings);

    showToast({
      type: "success",
      title: "Settings reset",
      message: "Your settings have been reset to default.",
    });
  };

  const renderSectionContent = () => {
    if (activeSection === "account") {
      return (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => navigate("/profile/me")}
            className="flex w-full items-center justify-between rounded-3xl border border-[#DDE3EA] bg-white p-5 text-left transition hover:border-[#F6AD55]"
          >
            <div>
              <h4 className="font-bold text-[#002045]">View Profile</h4>
              <p className="mt-1 text-sm text-[#002045]/60">
                Open your WayMark profile.
              </p>
            </div>
            <ChevronRight className="text-[#002045]/40" />
          </button>

          <button
            type="button"
            onClick={handleClearLocalSettings}
            className="flex w-full items-center gap-3 rounded-3xl border border-orange-100 bg-orange-50 p-5 text-left transition hover:bg-orange-100"
          >
            <Trash2 className="text-[#F6AD55]" />
            <div>
              <h4 className="font-bold text-[#002045]">Reset Settings</h4>
              <p className="mt-1 text-sm text-[#002045]/60">
                Reset privacy, security, notification, and appearance
                preferences.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-3xl border border-red-100 bg-red-50 p-5 text-left transition hover:bg-red-100"
          >
            <LogOut className="text-red-500" />
            <div>
              <h4 className="font-bold text-red-600">Logout</h4>
              <p className="mt-1 text-sm text-red-500/70">
                Logout from this device.
              </p>
            </div>
          </button>
        </div>
      );
    }

    if (activeSection === "privacy") {
      return (
        <div className="space-y-4">
          <ToggleRow
            title="Private Profile"
            description="Hide your profile from public discovery."
            checked={settings.privacy.privateProfile}
            onChange={(value) =>
              updateSetting("privacy", "privateProfile", value)
            }
          />

          <ToggleRow
            title="Show Email"
            description="Allow other travelers to see your email."
            checked={settings.privacy.showEmail}
            onChange={(value) => updateSetting("privacy", "showEmail", value)}
          />

          <ToggleRow
            title="Show Country"
            description="Display your country on your profile."
            checked={settings.privacy.showCountry}
            onChange={(value) => updateSetting("privacy", "showCountry", value)}
          />
        </div>
      );
    }

    if (activeSection === "security") {
      return (
        <div className="space-y-4">
          <ToggleRow
            title="Login Alerts"
            description="Show alerts when account login activity changes."
            checked={settings.security.loginAlerts}
            onChange={(value) =>
              updateSetting("security", "loginAlerts", value)
            }
          />

          <ToggleRow
            title="Remember Device"
            description="Keep this device logged in using local storage."
            checked={settings.security.rememberDevice}
            onChange={(value) =>
              updateSetting("security", "rememberDevice", value)
            }
          />

          <div className="rounded-3xl border border-[#DDE3EA] bg-white p-5">
            <div className="flex items-center gap-3">
              <Lock className="text-[#F6AD55]" />
              <div>
                <h4 className="font-bold text-[#002045]">Password Change</h4>
                <p className="mt-1 text-sm text-[#002045]/60">
                  Password change needs a backend route. Add this later with
                  current password, new password, and confirm password fields.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === "notifications") {
      return (
        <div className="space-y-4">
          <ToggleRow
            title="Like Notifications"
            description="Notify me when someone likes my memory."
            checked={settings.notifications.likes}
            onChange={(value) =>
              updateSetting("notifications", "likes", value)
            }
          />

          <ToggleRow
            title="Comment Notifications"
            description="Notify me when someone comments on my memory."
            checked={settings.notifications.comments}
            onChange={(value) =>
              updateSetting("notifications", "comments", value)
            }
          />

          <ToggleRow
            title="Follow Notifications"
            description="Notify me when someone follows me."
            checked={settings.notifications.follows}
            onChange={(value) =>
              updateSetting("notifications", "follows", value)
            }
          />
        </div>
      );
    }

    if (activeSection === "appearance") {
      return (
        <div className="space-y-4">
          <div className="rounded-3xl border border-[#DDE3EA] bg-white p-5">
            <h4 className="font-bold text-[#002045]">Theme</h4>
            <p className="mt-1 text-sm text-[#002045]/60">
              Choose your preferred app theme.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {["light", "dark", "system"].map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => updateSetting("appearance", "theme", theme)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold capitalize transition ${
                    settings.appearance.theme === theme
                      ? "border-[#F6AD55] bg-orange-50 text-[#F6AD55]"
                      : "border-[#DDE3EA] bg-white text-[#002045]/70 hover:border-[#F6AD55]"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <ToggleRow
            title="Compact Mode"
            description="Use tighter spacing in supported sections."
            checked={settings.appearance.compactMode}
            onChange={(value) =>
              updateSetting("appearance", "compactMode", value)
            }
          />
        </div>
      );
    }

    return null;
  };

  return (
    <main className="min-h-screen bg-[#F7FAFC] px-4 py-6 pb-28 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#002045] md:text-4xl">
            Settings
          </h1>
          <p className="mt-2 text-[#002045]/60">
            Manage your WayMark account preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="space-y-3">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-4 rounded-3xl border p-4 text-left transition ${
                    isActive
                      ? "border-[#F6AD55] bg-white shadow-lg"
                      : "border-[#DDE3EA] bg-white hover:border-[#F6AD55]"
                  }`}
                >
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-2xl ${
                      isActive
                        ? "bg-[#F6AD55] text-white"
                        : "bg-orange-50 text-[#F6AD55]"
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-[#002045]">
                      {section.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#002045]/55">
                      {section.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={18}
                    className={
                      isActive ? "text-[#F6AD55]" : "text-[#002045]/30"
                    }
                  />
                </button>
              );
            })}
          </aside>

          <section className="rounded-[2rem] border border-[#DDE3EA] bg-white/60 p-4 shadow-sm md:p-6">
            <div className="mb-6 rounded-3xl bg-white p-5">
              <h2 className="text-2xl font-black text-[#002045]">
                {activeSectionData?.title}
              </h2>
              <p className="mt-1 text-sm text-[#002045]/60">
                {activeSectionData?.description}
              </p>
            </div>

            {renderSectionContent()}
          </section>
        </div>
      </div>
    </main>
  );
}

export default Settings;