import { fromJS } from 'immutable';
import {
  SET_BOOKINGS,
  GET_BOOKINGS,
  ADD_SLOTS,
  RESET_BOOKING_DATA,
  SET_CUSTOMER_ID,
  SET_CARDS
} from './constants';

const initialState = fromJS({
  bookings: {
    data: [],
    maximumBookingCount: 0
  },
  bookingSlots: {
    schedules: [],
    amount: 0
  },
  customerId: '',
  cards: []
});


function gymBookingsListReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BOOKINGS:
      return state
        .set('bookings', action.data);
    case RESET_BOOKING_DATA:
      return state = initialState;
    case ADD_SLOTS:
      const data = fromJS(action.data)
      return state
        .set('bookingSlots', data);
    case SET_CUSTOMER_ID:    
      return state
      .set('customerId', action.customerId);
    case SET_CARDS:    
      return state
      .set('cards', action.data);
    default:
      return state;
  }
}

export default gymBookingsListReducer;
