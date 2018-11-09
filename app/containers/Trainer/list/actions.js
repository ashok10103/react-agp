import {
  SET_BOOKINGS,
  GET_BOOKINGS
} from './constants';

export const getBookings = (day, id) => ({
  type: GET_BOOKINGS,
  day,
  id,
});

export const setBookings = (data) => ({
  type: SET_BOOKINGS,
  data,
});