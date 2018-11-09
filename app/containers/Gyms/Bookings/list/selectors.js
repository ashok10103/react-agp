import { createSelector } from 'reselect';
const selectGymBookings= (state) => state.get('GymBookings');

const getBookingsSlots = () => createSelector(
  selectGymBookings,
  (gymBookingState) => gymBookingState.get('bookings')
);
export {
  getBookingsSlots,
};
