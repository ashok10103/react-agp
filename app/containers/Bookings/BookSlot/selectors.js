import { createSelector } from 'reselect';
const selectGymBookings= (state) => state.get('Booking');

const getBookingsSlots = () => createSelector(
  selectGymBookings,
  (gymBookingState) => gymBookingState.get('bookings')
);

const getSelectedSchedules = () => createSelector(
  selectGymBookings,
  (gymBookingState) => gymBookingState.get('bookingSlots').toJS()
);
const getCustomerId = () => createSelector(
  selectGymBookings,
  (gymBookingState) => gymBookingState.get('customerId')
);

const getCards= () => createSelector(
  selectGymBookings,
  (gymBookingState) => gymBookingState.get('cards')
);
const selectGlobalData = (state) => state.get('global');
const getCurrentUser= () => createSelector(
  selectGlobalData,
  (getUserData) => getUserData.get('currentUser')
);

export {
  getBookingsSlots,
  getSelectedSchedules,
  getCustomerId,
  getCards,
  getCurrentUser
};
