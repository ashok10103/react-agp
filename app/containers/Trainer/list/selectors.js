import { createSelector } from 'reselect';
const selectGymBookings= (state) => state.get('TrainerBookings');

const getBookingsSlots = () => createSelector(
  selectGymBookings,
  (gymBookingState) => gymBookingState.get('bookings')
);
export {
  getBookingsSlots,
};
