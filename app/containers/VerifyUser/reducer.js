import { fromJS } from "immutable";
import { SET_MESSAGE } from "./constants";

const initialFieldState = {
  value: "",
  validated: false,
  validating: false,
  errors: []
};

const initialState = fromJS({
  fields: {
    emailId: {
      ...initialFieldState
    },
    password: {
      ...initialFieldState
    }
  },

  valid: true,
  statusText: ""
});

function VerifyUserReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MESSAGE:
      return state;

    default:
      return state;
  }
}

export default VerifyUserReducer;
