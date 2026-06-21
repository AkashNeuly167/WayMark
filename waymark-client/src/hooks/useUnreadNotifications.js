import { useCallback, useEffect, useState } from "react";

import { getNotifications } from "../services/notification.service";
import { subscribeToNotificationsUpdated } from "../utils/notificationEvents";

export const useUnreadNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(() => {
    getNotifications()
      .then((data) => {
        const notifications = data.notifications || [];

        const count = notifications.filter(
          (notification) => !notification.isRead,
        ).length;

        setUnreadCount(count);
      })
      .catch((error) => {
        console.error("Unread notifications error:", error);
      });
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refreshUnreadCount();
    }, 0);

    const unsubscribe =
      subscribeToNotificationsUpdated(refreshUnreadCount);

    return () => {
      window.clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [refreshUnreadCount]);

  return unreadCount;
};