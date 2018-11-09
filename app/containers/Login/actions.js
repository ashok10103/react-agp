import {
  GET_API_DATA,
  GET_API_DATA_LOADED,
  GET_API_DATA_ERROR,
  CHANGE_VALUE,
  SET_VALID,
  SET_INVALID,
  VALIDATE,
  SUBMITTED,
  SUBMITTING,
  SUBMIT,
  SUBMIT_SUCCESS,
  SUBMIT_FAILURE, CLEAR_FORM,
  CLEAR_SUBMIT,
  REST_PASS,
  CLEAR_FP_FORM,
  SET_REMEMBER_ME,
  SOCIAL_LOGIN,
} from './constants';

export const getAPIData = () => ({
  type: GET_API_DATA,
});

export const getAPIDataLoaded = (data) => ({
  type: GET_API_DATA_LOADED,
  data,
});

export const getAPIDataError = (error) => ({
  type: GET_API_DATA_ERROR,
  error,
});
export const changeValue = (field, value, module) => ({
  type: CHANGE_VALUE,
  field,
  value,
  module,
});
// Validate an individual field given a specific validation
export const validate = (field, validation, module) => ({
  type: VALIDATE,
  field,
  validation,
  module,
});

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

// Submit the form
// We'll supply all of the validations for the form as well as a handler
// to call after the form has been validated
export const submit = (validations, handler, module, userType) => ({
  type: SUBMIT,
  validations,
  handler,
  module,
  userType
});

// Mark the form as submitting for display indication
export const setSubmitting = () => ({
  type: SUBMITTING,
});

// Mark the form as submitted for display indication
export const setSubmitted = (values, handler, module, userType) => ({
  type: SUBMITTED,
  values,
  handler,
  module,
  userType
});

// Mark the form submitting success
export const submitSuccess = (auth) => ({
  type: SUBMIT_SUCCESS,
  auth,
});

// Mark the form submitting failure
export const submitError = (err) => ({
  type: SUBMIT_FAILURE,
  err,
});

export const clearFormFields = () => ({
  type: CLEAR_FORM,
});

export const clearFPForm = () => ({
  type: CLEAR_FP_FORM,
});

export const clearSubmit = () => ({
  type: CLEAR_SUBMIT,
});

export const socialLogin = (values) => ({
  type: SOCIAL_LOGIN,
  values,
});

export const resetPass = (cb, cb2, data) => ({
  type: REST_PASS,
  cb,
  cb2,
  data,
});

export const setRememberMe = (value) => ({
  type: SET_REMEMBER_ME,
  value,
});