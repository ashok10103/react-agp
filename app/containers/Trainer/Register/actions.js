import {
  // GET_API_DATA,
  // GET_API_DATA_LOADED,
  // GET_API_DATA_ERROR,
  CHANGE_VALUE,
  SET_VALID,
  SET_INVALID,
  VALIDATE,
  SUBMIT,
  GET_SETTINGS,
  SET_TRAINER_SETTINGS,
  NEXT_LEVEL,

} from './constants';
export const changeValue = (field, value, module) => {
  return {
    type: CHANGE_VALUE,
    field,
    value,
    module,
  }
};

export const moveToNext = (field, value, module) => ({
  type: NEXT_LEVEL,
  field,
  value,
  module,
});
//   // Validate an individual field given a specific validation
export const validate = (field, validation, module) => ({
  type: VALIDATE,
  field,
  validation,
  module,
});

//   // Mark a field as invalid with a specific error message
export const setInvalid = (field, error, module) => ({
  type: SET_INVALID,
  field,
  error,
  module,
});

//   // Mark the field as invalid with the error message to be removed
export const setValid = (field, error, module) => ({

  type: SET_VALID,
  field,
  error,
  module,
});

//   // Submit the form
//   // We'll supply all of the validations for the form as well as a handler
//   // to call after the form has been validated
export const submit = (validations, module, lat, long) => {
  return {
    type: SUBMIT,
    validations,
    module,
    lat, long

  }
};
export const getSettings = () => {
  return {
    type: GET_SETTINGS,
  }
}

export const setTrainerSettings = (settings) => ({
  type: SET_TRAINER_SETTINGS,
  settings,
});