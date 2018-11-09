import { fromJS } from 'immutable';
import {
  SET_BOOKINGS,
  GET_BOOKINGS
} from './constants';

const initialState = fromJS({
  bookings: {
    data: [],
    maximumBookingCount: 0
  }
});


function trainerBookingsListReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BOOKINGS:     
      return state
        .set('bookings', action.data);
    default:
      return state;
  }
}

export default trainerBookingsListReducer;
