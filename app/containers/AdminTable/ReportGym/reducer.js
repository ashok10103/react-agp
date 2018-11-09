import { fromJS } from "immutable";
import { SET_GYM_DATA } from "./constants";

const initialFieldState = {
  value: ""
};

const initialState = fromJS({
  fields: {
    name: {
      ...initialFieldState
    },
    userType: {
      ...initialFieldState
    },
    reason: {
      ...initialFieldState
    },
    reportedBy: {
      ...initialFieldState
    },
    date: {
      ...initialFieldState
    }
  },

  valid: true,
  statusText: "",
  count: 0
});
function ReportGymReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GYM_DATA: {
      const { data, count } = action;
      let items;
      const editedObj = data;

      return state.set("data", editedObj).set("count", count);
    }
    default:
      return state;
  }
}

export default ReportGymReducer;
