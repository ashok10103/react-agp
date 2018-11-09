import {
  SET_BOOKINGS,
  GET_BOOKINGS,
  GET_ALL_BOOKINGS,
  DELETE_BOOKINGS,
  SET_FLAG, 
} from "./constants";

export const getBookings = (day, id) => ({
  type: GET_BOOKINGS,
  day,
  id
});

export const setBookings = data => ({
  type: SET_BOOKINGS,
  data
});

export const getAllBookings = id => ({
  type: GET_ALL_BOOKINGS,
  id
});

export const deleteBookings = (id, uId, day, clear) => ({
  type: DELETE_BOOKINGS,
  id,
  uId,
  day,
  clear
});

export const setFlag = () => {
  return {
    type: SET_FLAG
  };
};

