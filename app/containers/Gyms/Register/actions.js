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
  GET_SETTINGS,
  SET_SETTINGS,
  NEXT_LEVEL,
  GET_IMAGES,
  SET_IMAGES,
  GYM_UPLOAD,
  REMOVE_IMAGE
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

export const moveToNext = (field, value, module) => ({
  type: NEXT_LEVEL,
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
export const submit = (validations, module, lat, long ) => ({
  type: SUBMIT,
  validations,
  module,
  lat, 
  long
});

// Mark the form as submitting for display indication
export const setSubmitting = () => ({
  type: SUBMITTING,
});

// Mark the form as submitted for display indication
export const setSubmitted = (values, module) => ({
  type: SUBMITTED,
  values,
  module,
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

export const clearSubmit = () => ({
  type: CLEAR_SUBMIT,
});


export const getSettings = () => ({
  type: GET_SETTINGS,
});


export const setSettings = (settings) => ({
  type: SET_SETTINGS,
  settings,
});

export const uploadImages = (file, id) => ({
  type: GYM_UPLOAD,
  file,
  id
})

export const getImages = (id) => ({
  type: GET_IMAGES,
  id
});


export const setImages = (data) => ({
  type: SET_IMAGES,
  data
});

export const removeImage = (image, id) => ({
  type: REMOVE_IMAGE,
  image,
  id
});
