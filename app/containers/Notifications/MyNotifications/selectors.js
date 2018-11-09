import { createSelector } from 'reselect';
const selectGymNotifications= (state) => state.get('NotificationList');

const getStateNotifications = () => createSelector(
    selectGymNotifications,
  (notificationState) => notificationState.get('notifications')
);
export {
  getStateNotifications,
};
