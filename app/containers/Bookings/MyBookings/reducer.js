import { fromJS } from "immutable";
import { SET_BOOKINGS, SET_FLAG, SET_ISSUES, GET_BOOKINGS } from "./constants";

const initialState = fromJS({
  bookings: {
    data: [],
    maximumBookingCount: 0
  },
  clear: false,
  
});

function BookingsListReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BOOKINGS:
      return state.set("bookings", action.data);
    case SET_FLAG:
      return state.update("clear", clear => !clear);

   
    default:
      return state;
  }
}

export default BookingsListReducer;
