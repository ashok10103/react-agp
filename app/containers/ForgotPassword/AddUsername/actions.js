import {

  CHANGE_VALUE,
  SET_VALID,
  SET_INVALID,
  VALIDATE,
  SUBMIT,
  CLEAR_FP_FORM,
} from './constants';


export const changeValue = (field, value, module) => ({
  type: CHANGE_VALUE,
  field,
  value,
  module,
});
// Validate an individual field given a specific validation
export const validate = (field, validation, module) => {
  return {
    type: VALIDATE,
    field,
    validation,
    module,
  }
};


// Mark a field as invalid with a specific error message
export const setInvalid = (field, error, module) => ({
  type: SET_INVALID,
  field,
  error,
  module,
});

// Mark the field as invalid with the error message to be removed
export const setValid = (field, error, module) => ({
  type: SET_VALID,
  field,
  error,
  module,
});
export const submit = (validations, value, userType, module) => {
  return {
    type: SUBMIT,
    validations,
    value,
    userType,
    module,
  }
};

export const clearFormFields = () => {
  return {
    type: CLEAR_FORM,
  }
};

export const clearFPForm = () => ({
  type: CLEAR_FP_FORM,
});