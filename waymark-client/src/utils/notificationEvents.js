export const NOTIFICATIONS_UPDATED_EVENT = "waymark-notifications-updated";

export const notifyNotificationsUpdated = () => {
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
};

export const subscribeToNotificationsUpdated = (callback) => {
  window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, callback);

  return () => {
    window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, callback);
  };
};