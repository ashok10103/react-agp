import { fromJS } from 'immutable';
import {
  SET_GYM_EDIT, CHANGE_VALUE, SET_VALID,
  SET_INVALID,
  VALIDATE, SET_SETTINGS

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
}

const initialState = fromJS({
  gyms: [],
  noMoreData: true,
  fields: {

    name: { ...initialFieldState },
    gymInfo: { ...initialFieldState },
    address: { ...initialFieldObjectState },
    country: { ...initialFieldState },
    cost: { ...initialFieldState },
    currency: { ...initialFieldState },
    phoneNumber: { ...initialFieldState },
    guestAccessType: { ...initialFieldArrayState },
    paymentType: { ...initialFieldArrayState },
    amenities: { ...initialFieldArrayState },
    maxMembers: { ...initialFieldState },
    gymType: { ...initialFieldArrayState },
    gymRules: { ...initialFieldArrayState },
    description: { ...initialValidFieldState },
    gymImages: { ...initialFieldArrayState }

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
    // default:
    //   return state;
  }
}

function getIdsFromObjectArray(data) {
  if (data.length) {
    return data.map((obj) => obj._id)
  }
  else return data
}

function gymEditReducer(state = initialState, action) {
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



    case SET_GYM_EDIT: {
      const { data } = action;

      const editedObj = data;
      return state

        .setIn(['fields', 'name'], { value: editedObj.name, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'gymInfo'], { value: editedObj.gymInfo, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'address'], { value: editedObj.address, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'country'], { value: editedObj.country, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'cost'], { value: editedObj.cost, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'currency'], { value: editedObj.currency, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'phoneNumber'], { value: editedObj.phoneNumber, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'guestAccessType'], { value: getIdsFromObjectArray(editedObj.guestAccessType), validated: true, validating: true, errors: [] })
        .setIn(['fields', 'paymentType'], { value: getIdsFromObjectArray(editedObj.paymentType), validated: true, validating: true, errors: [] })
        .setIn(['fields', 'amenities'], { value: getIdsFromObjectArray(editedObj.amenities), validated: true, validating: true, errors: [] })
        .setIn(['fields', 'maxMembers'], { value: editedObj.maxMembers, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'gymType'], { value: getIdsFromObjectArray(editedObj.gymType), validated: true, validating: true, errors: [] })
        .setIn(['fields', 'gymRules'], { value: getIdsFromObjectArray(editedObj.gymRules), validated: true, validating: true, errors: [] })
        .setIn(['fields', 'description'], { value: editedObj.description, validated: true, validating: true, errors: [] })
        .setIn(['fields', 'gymImages'], { value: editedObj.gymImages, validated: true, validating: true, errors: [] })

    }

    case SET_SETTINGS:
      return state
        .set('settings', action.settings);

    default:
      return state;
  }
}

export default gymEditReducer;
