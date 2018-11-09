import { fromJS } from 'immutable';
import { CHANGE_VALUE,
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
  SET_USER_DETAILS
} from './constants';

const initialFieldState = {
  value: '',
  validated: false,
  validating: false,
  errors: [],
};
const initialValidFieldState = {
  value: '',
  validated: true,
  validating: true,
  errors: [],
};
const initialState = fromJS({
  fields: {
    emailId: { ...initialFieldState },
    // password: { ...initialFieldState },
    firstName: { ...initialFieldState },
    lastName: { ...initialValidFieldState },
    phoneNumber: { ...initialFieldState },
    userType: { ...initialValidFieldState },
    credits: { ...initialValidFieldState },
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
    default:
      return state;
  }
}

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_VALUE:
    case SET_VALID:
    case SET_INVALID:
    case VALIDATE:
      const { field, module } = action;
      const handledField = handleField(state.toJS()['fields'][field], action);
      const fields = state.get('fields').set(field, handledField);
      const valid = Object.keys(fields.toJS())
          .every((name) => fields.toJS()[name].errors.length === 0);
      return state
          .set('fields', fields)
          .set('valid', valid);
    case SET_REMEMBER_ME:
      return state
        .set('rememberMe', action.value);
    case SUBMITTING:
      return state
        .set('submitting', true);
    case SUBMITTED:
    case SUBMIT_SUCCESS:
      return state
        .set('submitting', true)
        .set('statusText', '')
        .set('submitted', true);
    case CLEAR_SUBMIT:
      return initialState;
    case SUBMIT_FAILURE:
      return state
        .set('submitting', false)
        .set('statusText', action.err.status)
        .set('submitted', false);
    case CLEAR_FP_FORM:
    return state
        .set('submitting', false)
        .set('submitted', false);
    case CLEAR_FORM:
      return state = initialState;
    
    case SET_USER_DETAILS: {
        const { data } = action;
        const editedObj = data;
      return state
          .setIn(['fields', 'emailId'], { value: editedObj.emailId, validated: true, validating: true, errors: [] })
          .setIn(['fields', 'firstName'], { value: editedObj.firstName, validated: true, validating: true, errors: [] })
          .setIn(['fields', 'lastName'], { value: editedObj.lastName, validated: true, validating: true, errors: [] })
          .setIn(['fields', 'phoneNumber'], { value: editedObj.phoneNumber, validated: true, validating: true, errors: [] })
          .setIn(['fields', 'userType'], { value: editedObj.userType, validated: true, validating: true, errors: [] })
          .setIn(['fields', 'credits'], { value: editedObj.credits, validated: true, validating: true, errors: [] })
      }
    default:
      return state;
  }
}

export default loginReducer;
