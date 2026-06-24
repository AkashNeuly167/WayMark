import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  Heart,
  Loader2,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useToast } from "../context/useToast";
import NotificationSkeleton from "../components/ui/NotificationSkeleton";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notification.service";
import { notifyNotificationsUpdated } from "../utils/notificationEvents";

const tabs = [
  { label: "All", value: "all" },
  { label: "Likes", value: "like" },
  { label: "Comments", value: "comment" },
  { label: "Followers", value: "follow" },
];

function Notifications() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter((item) => item.type === activeTab);
  }, [notifications, activeTab]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        const data = await getNotifications();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Notifications fetch error:", error);

        showToast({
          type: "error",
          title: "Failed to load",
          message: "Could not load notifications.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [showToast]);

  const getAvatarUrl = (person) => {
    if (!person?.avatar) return "";
    return typeof person.avatar === "string" ? person.avatar : person.avatar.url;
  };

  const getInitial = (person) => {
    return (
      person?.username?.charAt(0).toUpperCase() ||
      person?.fullName?.charAt(0).toUpperCase() ||
      "W"
    );
  };

  const getMemoryImage = (memory) => {
    if (!memory) return "";

    const firstImage = memory.images?.[0];

    if (!firstImage) return "";
    return firstImage.url || firstImage;
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Recently";

    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTypeBadge = (type) => {
    if (type === "like") {
      return (
        <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white ring-2 ring-[#101D2E]">
          <Heart size={13} className="fill-white" />
        </div>
      );
    }

    if (type === "comment") {
      return (
        <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-sky-500 text-white ring-2 ring-[#101D2E]">
          <MessageCircle size={13} />
        </div>
      );
    }

    return (
      <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-[#F6AD55] text-[#06111F] ring-2 ring-[#101D2E]">
        <UserPlus size={13} />
      </div>
    );
  };

  const getNotificationMessage = (notification) => {
    const senderName =
      notification.sender?.fullName ||
      notification.sender?.username ||
      "Someone";

    const memoryTitle =
      notification.memory?.title || notification.memoryTitle || "your memory";

    if (notification.type === "like") {
      return {
        senderName,
        action: "liked",
        target: memoryTitle,
        suffix: ".",
      };
    }

    if (notification.type === "comment") {
      return {
        senderName,
        action: "commented on",
        target: memoryTitle,
        suffix: ".",
      };
    }

    return {
      senderName,
      action: "started following",
      target: "you",
      suffix: ".",
    };
  };

  const markLocalRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item._id === notificationId ? { ...item, isRead: true } : item,
      ),
    );
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);
        markLocalRead(notification._id);
        notifyNotificationsUpdated();
      }

      if (notification.memory?._id) {
        navigate(`/memories/${notification.memory._id}`);
        return;
      }

      if (notification.memory) {
        navigate(`/memories/${notification.memory}`);
        return;
      }

      if (notification.sender?._id) {
        navigate(`/profile/${notification.sender._id}`);
      }
    } catch (error) {
      console.error("Notification click error:", error);
    }
  };

  const handleMarkReadOnly = async (e, notificationId) => {
    e.stopPropagation();

    try {
      await markNotificationAsRead(notificationId);

      markLocalRead(notificationId);
      notifyNotificationsUpdated();

      showToast({
        type: "success",
        title: "Marked as read",
        message: "Notification updated.",
      });
    } catch (error) {
      console.error("Mark read error:", error);

      showToast({
        type: "error",
        title: "Failed",
        message: "Could not mark notification as read.",
      });
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0 || markingAll) return;

    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        })),
      );

      notifyNotificationsUpdated();

      showToast({
        type: "success",
        title: "All caught up",
        message: "All notifications marked as read.",
      });
    } catch (error) {
      console.error("Mark all read error:", error);

      showToast({
        type: "error",
        title: "Failed",
        message: "Could not mark all notifications as read.",
      });
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 md:px-8 md:pt-7">
        <section className="mb-7 rounded-[2rem] border border-white/10 bg-[#101D2E] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)] md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#F6AD55]">
                Waymark Activity
              </p>

              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                Activity & Alerts
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                Stay updated with follows, likes, and comments from your travel
                community.
              </p>
            </div>

            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || markingAll}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <CheckCheck size={17} />
              )}
              {markingAll ? "Updating..." : "Mark all as read"}
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="mb-5 overflow-x-auto rounded-2xl border border-white/10 bg-[#101D2E] p-1">
              <div className="grid min-w-max grid-cols-4 gap-1">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.value;

                  const count =
                    tab.value === "all"
                      ? notifications.length
                      : notifications.filter((item) => item.type === tab.value)
                          .length;

                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setActiveTab(tab.value)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-black transition ${
                        isActive
                          ? "bg-[#F6AD55] text-[#06111F]"
                          : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      {tab.label}
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-black ${
                          isActive
                            ? "bg-[#06111F]/15 text-[#06111F]"
                            : "bg-white/[0.06] text-slate-500"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {loading ? (
              <NotificationSkeleton />
            ) : notifications.length === 0 ? (
              <EmptyState
                icon={<Bell size={28} />}
                title="No notifications yet"
                message="When someone follows, likes, or comments, it will appear here."
              />
            ) : filteredNotifications.length === 0 ? (
              <EmptyState
                title="Nothing here yet"
                message={`No ${activeTab} notifications found.`}
              />
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const senderAvatar = getAvatarUrl(notification.sender);
                  const senderInitial = getInitial(notification.sender);
                  const memoryImage = getMemoryImage(notification.memory);
                  const message = getNotificationMessage(notification);

                  return (
                    <article
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`group flex cursor-pointer items-start gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-[#F6AD55]/35 hover:bg-[#14243A] md:p-5 ${
                        notification.isRead
                          ? "border-white/10 bg-[#101D2E]"
                          : "border-[#F6AD55]/25 bg-[#F6AD55]/10"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#F6AD55] to-orange-600 text-sm font-black text-white shadow-sm ring-1 ring-white/10">
                          {senderAvatar ? (
                            <img
                              src={senderAvatar}
                              alt={message.senderName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            senderInitial
                          )}
                        </div>

                        {getTypeBadge(notification.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-6 text-slate-300 md:text-base">
                          <span className="font-black text-white">
                            {message.senderName}
                          </span>{" "}
                          {message.action}{" "}
                          <span className="font-black text-white underline decoration-[#F6AD55]/40 underline-offset-2">
                            {message.target}
                          </span>
                          {message.suffix}
                        </p>

                        {notification.type === "comment" &&
                          notification.commentText && (
                            <p className="mt-3 rounded-2xl border-l-4 border-[#F6AD55] bg-white/[0.05] px-4 py-3 text-sm italic leading-6 text-slate-400">
                              “{notification.commentText}”
                            </p>
                          )}

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span className="text-xs font-semibold text-slate-500">
                            {formatTime(notification.createdAt)}
                          </span>

                          {!notification.isRead && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F6AD55]/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#F6AD55]">
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        {memoryImage && (
                          <div className="hidden h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-[#06111F] sm:block md:h-20 md:w-20">
                            <img
                              src={memoryImage}
                              alt={notification.memory?.title || "Memory"}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                            />
                          </div>
                        )}

                        {!notification.isRead && (
                          <button
                            type="button"
                            onClick={(e) =>
                              handleMarkReadOnly(e, notification._id)
                            }
                            className="hidden rounded-full border border-[#F6AD55]/30 bg-[#F6AD55]/10 px-3 py-1.5 text-xs font-black text-[#F6AD55] transition hover:bg-[#F6AD55]/20 md:inline-flex"
                          >
                            Mark read
                          </button>
                        )}

                        {!notification.isRead && (
                          <span className="h-2.5 w-2.5 rounded-full bg-[#F6AD55]" />
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <aside className="space-y-6 lg:col-span-4">
            <section className="rounded-[2rem] border border-white/10 bg-[#101D2E] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.22)]">
              <h3 className="text-xl font-black text-white">
                Notification Summary
              </h3>

              <div className="mt-5 space-y-3">
                <SummaryRow label="Total" value={notifications.length} />
                <SummaryRow label="Unread" value={unreadCount} accent />
                <SummaryRow
                  label="Likes"
                  value={
                    notifications.filter((item) => item.type === "like").length
                  }
                  red
                />
                <SummaryRow
                  label="Comments"
                  value={
                    notifications.filter((item) => item.type === "comment")
                      .length
                  }
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#F6AD55]/20 bg-gradient-to-br from-[#1A365D] to-[#06111F] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
              <h3 className="text-xl font-black">Activity tip</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Click any notification to jump directly to the related memory or
                traveler profile.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function SummaryRow({ label, value, accent, red }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <span className="text-sm font-semibold text-slate-400">{label}</span>
      <span
        className={`font-black ${
          accent ? "text-[#F6AD55]" : red ? "text-red-400" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyState({ icon, title, message }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-white/10 bg-[#101D2E] p-10 text-center shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
      {icon && (
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#F6AD55]/15 text-[#F6AD55]">
          {icon}
        </div>
      )}

      <h2 className="mt-5 text-2xl font-black text-white">{title}</h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        {message}
      </p>
    </div>
  );
}

export default Notifications;