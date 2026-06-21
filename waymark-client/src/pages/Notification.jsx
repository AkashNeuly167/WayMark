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


import MobileBottomNav from "../components/navigation/MobileBottomNav";
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
        <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white ring-2 ring-white">
          <Heart size={13} className="fill-white" />
        </div>
      );
    }

    if (type === "comment") {
      return (
        <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-[#1A365D] text-white ring-2 ring-white">
          <MessageCircle size={13} />
        </div>
      );
    }

    return (
      <div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-[#F6AD55] text-white ring-2 ring-white">
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
    <div className="min-h-screen bg-[#F7FAFC] text-[#002045]">
     

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:px-8 md:ml-64">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[#F6AD55]">
              Waymark Activity
            </p>

            <h1 className="text-4xl font-black text-[#1A365D] md:text-5xl">
              Activity & Alerts
            </h1>

            <p className="mt-2 max-w-2xl text-[#002045]/60">
              Stay updated with follows, likes, and comments from your travel
              community.
            </p>
          </div>

          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || markingAll}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D8DEE6] bg-white px-5 py-3 text-sm font-black text-[#002045] shadow-sm transition hover:bg-[#F7FAFC] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {markingAll ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <CheckCheck size={17} />
            )}
            {markingAll ? "Updating..." : "Mark all as read"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="mb-6 overflow-x-auto border-b border-[#D8DEE6]">
              <div className="flex min-w-max gap-8">
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
                      className={`relative pb-3 text-sm font-black transition ${
                        isActive
                          ? "text-[#1A365D]"
                          : "text-[#002045]/45 hover:text-[#1A365D]"
                      }`}
                    >
                      {tab.label}
                      <span className="ml-2 rounded-full bg-[#E8EDF2] px-2 py-0.5 text-[10px] font-black text-[#002045]/55">
                        {count}
                      </span>

                      {isActive && (
                        <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full bg-[#F6AD55]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {loading ? (
              <NotificationSkeleton />
            ) : notifications.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#D8DEE6] bg-white p-10 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-orange-50 text-[#F6AD55]">
                  <Bell size={28} />
                </div>

                <h2 className="mt-5 text-2xl font-black">
                  No notifications yet
                </h2>

                <p className="mt-3 text-[#002045]/60">
                  When someone follows, likes, or comments, it will appear here.
                </p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#D8DEE6] bg-white p-10 text-center">
                <h2 className="text-2xl font-black">Nothing here yet</h2>
                <p className="mt-3 text-[#002045]/60">
                  No {activeTab} notifications found.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => {
                  const senderAvatar = getAvatarUrl(notification.sender);
                  const senderInitial = getInitial(notification.sender);
                  const memoryImage = getMemoryImage(notification.memory);
                  const message = getNotificationMessage(notification);

                  return (
                    <article
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`group flex cursor-pointer items-start gap-4 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-[#1A365D]/20 hover:shadow-[0_10px_25px_rgba(26,54,93,0.08)] md:p-5 ${
                        notification.isRead
                          ? "border-[#D8DEE6] bg-white"
                          : "border-orange-200 bg-orange-50/80"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-full border-2 border-white bg-[#1A365D] text-sm font-black text-white shadow-sm">
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
                        <p className="text-sm leading-6 text-[#002045]/80 md:text-base">
                          <span className="font-black text-[#1A365D]">
                            {message.senderName}
                          </span>{" "}
                          {message.action}{" "}
                          <span className="font-black text-[#002045] underline decoration-[#F6AD55]/40 underline-offset-2">
                            {message.target}
                          </span>
                          {message.suffix}
                        </p>

                        {notification.type === "comment" &&
                          notification.commentText && (
                            <p className="mt-3 rounded-2xl border-l-4 border-[#F6AD55] bg-[#F7FAFC] px-4 py-3 text-sm italic leading-6 text-[#002045]/60">
                              “{notification.commentText}”
                            </p>
                          )}

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span className="text-xs font-semibold text-[#002045]/45">
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
                          <div className="hidden h-16 w-16 overflow-hidden rounded-2xl border border-[#D8DEE6] bg-[#E8EDF2] sm:block md:h-20 md:w-20">
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
                            className="hidden rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-black text-[#F6AD55] transition hover:bg-orange-50 md:inline-flex"
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
            <section className="rounded-3xl border border-[#D8DEE6] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black text-[#1A365D]">
                Notification Summary
              </h3>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-[#F7FAFC] p-4">
                  <span className="text-sm font-semibold text-[#002045]/60">
                    Total
                  </span>
                  <span className="font-black text-[#1A365D]">
                    {notifications.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-orange-50 p-4">
                  <span className="text-sm font-semibold text-[#002045]/60">
                    Unread
                  </span>
                  <span className="font-black text-[#F6AD55]">
                    {unreadCount}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[#F7FAFC] p-4">
                  <span className="text-sm font-semibold text-[#002045]/60">
                    Likes
                  </span>
                  <span className="font-black text-red-500">
                    {
                      notifications.filter((item) => item.type === "like")
                        .length
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-[#F7FAFC] p-4">
                  <span className="text-sm font-semibold text-[#002045]/60">
                    Comments
                  </span>
                  <span className="font-black text-[#1A365D]">
                    {
                      notifications.filter((item) => item.type === "comment")
                        .length
                    }
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-[#1A365D] p-6 text-white shadow-xl">
              <h3 className="text-xl font-black">Activity tip</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Click any notification to jump directly to the related memory or
                traveler profile.
              </p>
            </section>
          </aside>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default Notifications;