import {
  // SET_BOOKINGS,
  GET_NOTIFICATIONS,
  SET_NOTIFICATIONS
} from "./constants";

export const getNotifications = id => {
  return {
    type: GET_NOTIFICATIONS,
    id
  };
};

export const setNotifications = data => ({
  type: SET_NOTIFICATIONS,
  data
});
