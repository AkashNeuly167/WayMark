import { useEffect, useState } from "react";
import {
  Bell,
  CheckCheck,
  Heart,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useToast } from "../context/useToast";
import TopNavbar from "../components/navigation/TopNavbar";
import MobileBottomNav from "../components/navigation/MobileBottomNav";
import NotificationSkeleton from "../components/ui/NotificationSkeleton";

import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notification.service";
import { notifyNotificationsUpdated } from "../utils/notificationEvents";

function Notifications() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        const data = await getNotifications();

        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Notifications fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    if (type === "like") {
      return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <Heart size={22} className="fill-red-500" />
        </div>
      );
    }

    if (type === "comment") {
      return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#F6AD55]">
          <MessageCircle size={22} />
        </div>
      );
    }

    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
        <UserPlus size={22} />
      </div>
    );
  };

  const getNotificationText = (notification) => {
    const senderName =
      notification.sender?.fullName ||
      notification.sender?.username ||
      "Someone";

    if (notification.type === "like") {
      return `${senderName} liked your memory.`;
    }

    if (notification.type === "comment") {
      return `${senderName} commented on your memory.`;
    }

    return `${senderName} started following you.`;
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);

        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id ? { ...item, isRead: true } : item
          )
        );
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

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notificationId ? { ...item, isRead: true } : item
        )
      );

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
    const unreadNotifications = notifications.filter((item) => !item.isRead);

    if (unreadNotifications.length === 0) return;

    try {
      setMarkingAll(true);

      await Promise.all(
        unreadNotifications.map((item) => markNotificationAsRead(item._id))
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        }))
      );

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
      <TopNavbar />

      <main className="mx-auto max-w-4xl px-4 pb-28 pt-8 md:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">Notifications</h1>
            <p className="mt-2 text-[#002045]/60">
              Follow, like, and comment updates from travelers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="hidden items-center gap-2 rounded-2xl border border-[#D8DEE6] bg-white px-4 py-2.5 text-sm font-semibold text-[#002045] transition hover:bg-[#F7FAFC] disabled:opacity-60 md:flex"
              >
                <CheckCheck size={17} />
                {markingAll ? "Updating..." : "Mark all read"}
              </button>
            )}

            <div className="hidden h-14 w-14 items-center justify-center rounded-3xl bg-orange-50 text-[#F6AD55] md:flex">
              <Bell size={26} />
            </div>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#D8DEE6] bg-white px-4 py-3 text-sm font-semibold text-[#002045] transition hover:bg-[#F7FAFC] disabled:opacity-60 md:hidden"
          >
            <CheckCheck size={17} />
            {markingAll ? "Updating..." : "Mark all read"}
          </button>
        )}

        {loading ? (
  <NotificationSkeleton />
) : notifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#D8DEE6] bg-white p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-[#F6AD55]">
              <Bell size={28} />
            </div>

            <h2 className="mt-5 text-2xl font-bold">No notifications yet</h2>
            <p className="mt-3 text-[#002045]/60">
              When someone follows, likes, or comments, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <article
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex w-full cursor-pointer items-start gap-4 rounded-3xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                  notification.isRead
                    ? "border-[#D8DEE6] bg-white"
                    : "border-orange-200 bg-orange-50"
                }`}
              >
                {getNotificationIcon(notification.type)}

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#002045]">
                    {getNotificationText(notification)}
                  </p>

                  <p className="mt-1 text-sm text-[#002045]/50">
                    {notification.isRead ? "Read" : "New notification"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={(e) => handleMarkReadOnly(e, notification._id)}
                      className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#F6AD55] transition hover:bg-orange-50"
                    >
                      Mark read
                    </button>
                  )}

                  {!notification.isRead && (
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F6AD55]" />
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default Notifications;