export const NOTIFICATIONS_UPDATED_EVENT = "waymark:notifications-updated";

export const notifyNotificationsUpdated = () => {
  window.dispatchEvent(new Event(NOTIFICATIONS_UPDATED_EVENT));
};