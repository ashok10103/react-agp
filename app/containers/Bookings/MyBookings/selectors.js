import { createSelector } from 'reselect';
const selectGymBookings= (state) => state.get('BookingsList');

const getBookingsSlots = () => createSelector(
  selectGymBookings,
  (gymBookingState) => gymBookingState.get('bookings')
);



export {
  getBookingsSlots,

};
