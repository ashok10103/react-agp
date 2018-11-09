
import { fromJS } from 'immutable';
import {
  CHANGE_VALUE,
  SET_VALID,
  SET_INVALID,
  VALIDATE,
  SET_TRAINER_SETTINGS,
  NEXT_LEVEL,
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
    field1: {

      trainerInfo: { ...initialFieldState },
      address: { ...initialFieldObjectState },
      country: { ...initialFieldState },

    },
    field2: {
      latitude: { ...initialValidFieldState },
      longitude: { ...initialValidFieldState },
      trainerType: { ...initialFieldArrayState },
      certificates: { ...initialFieldArrayState },

    },

  },
  valid: true,
  level: 1,
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

function TrainerRegisterReducer(state = initialState, action) {
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
    case NEXT_LEVEL:
      return state
        .set('level', action.value)
    case SET_TRAINER_SETTINGS:
      return state
        .set('trainerSettings', action.settings);
    default:
      return state;
  }
}

export default TrainerRegisterReducer;
