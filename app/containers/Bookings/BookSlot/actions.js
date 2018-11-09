import {
  SET_BOOKINGS,
  GET_BOOKINGS,
  ADD_SLOTS,
  BOOK_TRAINER_SLOTS,
  RESET_BOOKING_DATA,
  CHECK_FOR_CARD,
  ADD_CARD,
  SET_CUSTOMER_ID,
  LIST_ALL_CARDS,
  SET_CARDS,
  PAY_ONLINE
} from './constants';

export const getBookings = (day, bookingType, id) => ({
  type: GET_BOOKINGS,
  day,
  bookingType,
  id,
});

export const setBookings = (data) => ({
  type: SET_BOOKINGS,
  data,
});

export const addSlots = (data) => ({
  type: ADD_SLOTS,
  data,
});

export const bookTrainerSlots = (id) => ({
  type: BOOK_TRAINER_SLOTS,
  id,
});

export const resetBookingData = () => ({
  type: RESET_BOOKING_DATA
});

export const checkForCard = () => ({
  type: CHECK_FOR_CARD
});

export const setCustomerId = (customerId) => ({
  type: SET_CUSTOMER_ID,
  customerId
});

export const listCards = (customerId) => ({
  type: LIST_ALL_CARDS,
  customerId
});

export const setCards = (data) => ({
  type: SET_CARDS,
  data
});

export const addCard = ((token) => {
  return {
    type: ADD_CARD,
    token
  }
});
export const payOnline = ((params) => {
  return {
    type: PAY_ONLINE,
    params
  }
});