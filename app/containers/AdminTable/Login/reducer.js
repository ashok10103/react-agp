import { fromJS } from "immutable";
import {
  CHANGE_VALUE,
  SET_VALID,
  SET_INVALID,
  VALIDATE

  //   SUBMIT_SUCCESS,
  //   SUBMIT_FAILURE,
  //   CLEAR_FORM
} from "./constants";

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

function handleField(state, action) {
  switch (action.type) {
    case VALIDATE: {
      return {
        ...state,
        validated: false,
        validating: true,
        errors: []
      };
    }
    case CHANGE_VALUE: {
      const { value } = action;
      return {
        ...state,
        value
      };
    }
    case SET_INVALID: {
      const { error } = action;
      return {
        ...state,
        validating: false,
        validated: true,
        errors: state.errors.concat(error)
      };
    }
    case SET_VALID: {
      const { error } = action;

      return {
        ...state,
        validating: false,
        validated: true,
        errors: state.errors.filter(e => e !== error)
      };
    }
    default:
      return state;
  }
}

function AdminLoginReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_VALUE:
    case SET_VALID:
    case SET_INVALID:
    case VALIDATE:
      const { field } = action;
      const handledField = handleField(state.toJS().fields[field], action);
      const fields = state.get("fields").set(field, handledField);
      const valid = Object.keys(fields.toJS()).every(
        name => fields.toJS()[name].errors.length === 0
      );
      return state.set("fields", fields).set("valid", valid);

    default:
      return state;
  }
}

export default AdminLoginReducer;
