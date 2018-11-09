
import { fromJS } from 'immutable';
import {
  SET_TRAINER_EDIT, CHANGE_VALUE,
  SET_VALID,
  SET_INVALID,
  VALIDATE,
} from './constants';

const initialFieldState = {
  value: '',
  validated: false,
  validating: false,
  errors: [],
};
const initialFieldObjectState = {
  value: {
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    landmark: ''
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


    trainerInfo: { ...initialFieldState },
    address: { ...initialFieldObjectState },
    country: { ...initialFieldState },




    trainerType: { ...initialFieldArrayState },
    certificates: { ...initialFieldArrayState },


  },
  valid: true,

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

function getIdsFromObjectArray(data) {
  if (data.length) {
    return data.map((obj) => obj._id)
  }
  else return data
}

function TrainerEditReducer(state = initialState, action) {
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
    case SET_TRAINER_EDIT: {
      const { data } = action;
      const editedObj = data;
      return state
        .setIn(['fields', 'trainerInfo'], { value: editedObj.trainerInfo, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'address'], { value: editedObj.address, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'country'], { value: editedObj.country, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'trainerType'], { value: getIdsFromObjectArray(editedObj.trainerType), validated: true, validating: true, errors: [] })
        .setIn(['fields', 'certificates'], { value: getIdsFromObjectArray(editedObj.certificates), validated: true, validating: true, errors: [] })
    }
    default:
      return state;
  }
}

export default TrainerEditReducer;
