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
  SET_SETTINGS,
  NEXT_LEVEL,
  SET_IMAGES
} from './constants';

const initialFieldState = {
  value: '',
  validated: false,
  validating: false,
  errors: [],
};
const initialFieldObjectState = {
  value: {
    city: ''
  },
  validated: true,
  validating: true,
  errors: [],
};
const initialValidFieldState = {
  value: '',
  validated: true,
  validating: true,
  errors: [],
};
const initialValidFieldArrayState = {
  value: [],
  validated: true,
  validating: true,
  errors: [],
};
const initialFieldArrayState = {
  value: [],
  validated: false,
  validating: false,
  errors: [],
};
const initialState = fromJS({
  fields: {
    field1 : {
      name: { ...initialFieldState },
      gymInfo: { ...initialFieldState },
      equipments: { ...initialValidFieldArrayState },
      latitude: { ...initialValidFieldState },
      longitude: { ...initialValidFieldState },
      address: { ...initialFieldObjectState },
      country: { ...initialFieldState },
      phoneNumber:{ ...initialFieldState }

    },
    field2: {
      cost: { ...initialFieldState },
      currency:{ ...initialFieldArrayState},
      guestAccessType: { ...initialFieldArrayState },
      paymentType: { ...initialFieldArrayState },

    },
    field3: {
      amenities: { ...initialFieldArrayState },
      maxMembers: { ...initialFieldState },
      gymType: { ...initialFieldArrayState },
      gymRules: { ...initialFieldArrayState },
      description: { ...initialValidFieldState },
    }
  },
  rememberMe: false,
  submitting: false,
  submitted: false,
  valid: true,
  level: 1,
  statusText: '',
  settings: [],
  images: [],
  showUpload: false
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

function gymRegisterReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_VALUE:
    case SET_VALID:
    case SET_INVALID:
    case VALIDATE:
      const { field, module } = action; 
      const handledField = handleField(state.toJS()['fields'][module][field], action);           
      const fields = state.get('fields').setIn([module, field], handledField);

      const valid = Object.keys(fields.toJS()[module])
          .every((name) => {            
            return fields.toJS()[module][name].errors.length === 0
          });

      return state
          .set('fields', fields)
          .set('valid', valid);
    case SUBMITTING:
      return state
        .set('submitting', true);
    case SUBMITTED:
    case SUBMIT_SUCCESS:
      return state
        .set('submitting', true)
        .set('statusText', '')
        .set('submitted', true);
    case NEXT_LEVEL:
        return state
          .set('level', action.value)
    case CLEAR_SUBMIT:
      return initialState;
    case SUBMIT_FAILURE:
      return state
        .set('submitting', false)
        .set('statusText', action.err.status)
        .set('submitted', false);
    case CLEAR_FORM:
      return state = initialState;
    case SET_SETTINGS:
      return state
      .set('settings', action.settings);
    case SET_IMAGES:    
      const imagesArray = action.data && action.data.gymImages ?  action.data.gymImages  : [];      
      return state
      .set('images', imagesArray);
    default:
      return state;
  }
}

export default gymRegisterReducer;
