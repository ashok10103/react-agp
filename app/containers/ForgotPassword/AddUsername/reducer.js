import { fromJS } from 'immutable';
import {
  CHANGE_VALUE,
  SET_VALID,
  SET_INVALID,
  VALIDATE,
  SUBMITTED,
  SUBMITTING,
  SUBMIT_SUCCESS,
  SUBMIT_FAILURE, CLEAR_FORM,
  CLEAR_SUBMIT,
  CLEAR_FP_FORM,
  SET_REMEMBER_ME,
} from './constants';

const initialFieldState = {
  value: '',
  validated: false,
  validating: false,
  errors: [],
};

const initialState = fromJS({
  fields: {
    email: { ...initialFieldState },
  },

  rememberMe: false,
  submitting: false,
  submitted: false,
  valid: true,
  statusText: '',
});


function handleField(state, action) {
  switch (action.type) {
    case VALIDATE: {
      return {
        ...state,
        validated: false,
        validating: true,
        errors: [],
      };
    }
    case CHANGE_VALUE: {
      const { value } = action;
      return {
        ...state,
        value,
      };
    }
    case SET_INVALID: {
      const { error } = action;
      return {
        ...state,
        validating: false,
        validated: false,
        errors: state.errors.concat(error),
      };
    }
    case SET_VALID: {
      const { error } = action;

      return {
        ...state,
        validating: false,
        validated: true,
        errors: state.errors.filter((e) => e !== error),
      };
    }

  }
}


function AddUsernameReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_VALUE:
    case SET_VALID:
    case SET_INVALID:
    case VALIDATE:
      const { field } = action;
      const handledField = handleField(state.toJS()['fields'][field], action);
      const fields = state.get('fields').setIn([field], handledField);
      const valid = Object.keys(fields.toJS())
        .every((name) => {
          return fields.toJS()[name].errors.length === 0
        });

      return state
        .set('fields', fields)
        .set('valid', valid);




    default:
      return state;
  }
}

export default AddUsernameReducer;
