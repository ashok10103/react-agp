import {
  CLOSE_MODAL,
  CHANGE_VALUE,
  VALIDATE,
  SET_VALID,
  SET_INVALID,
  SUBMIT,
  SET_BANK_DETAILS,
  CREATE_ACCOUNT,
  GET_ACCOUNT,
  SUBMIT_DOCUMENT,
  SET_UPLOAD_DOCUMENT,
  CLEAR_CURRENT_ACCOUNT
} from "./constants";

export const closeModal = () => {
  return {
    type: CLOSE_MODAL
  };
};

export const changeValue = (field, value, module) => {
  return {
    type: CHANGE_VALUE,
    field,
    value,
    module
  };
};

export const validate = (field, validation, module) => ({
  type: VALIDATE,
  field,
  validation,
  module
});

//   // Mark a field as invalid with a specific error message
export const setInvalid = (field, error, module) => ({
  type: SET_INVALID,
  field,
  error,
  module
});

//   // Mark the field as invalid with the error message to be removed
export const setValid = (field, error, module) => ({
  type: SET_VALID,
  field,
  error,
  module
});

export const submit = (validations, handler, module, changedFields) => {
  return {
    type: SUBMIT,
    validations,
    handler,
    module,
    changedFields
  };
};

export const setBankDetails = data => {
  return {
    type: SET_BANK_DETAILS,
    data
  };
};

export const setToken = token => {
  return {
    type: CREATE_ACCOUNT,
    token
  };
};

export const getBankDetails = () => {
  return {
    type: GET_ACCOUNT
  };
};

export const submitDocuments = (handler, changedFields) => {
  return {
    type: SUBMIT_DOCUMENT,
    handler,
    changedFields
  };
};
export const setUploadDocument = documentType => {
  return {
    type: SET_UPLOAD_DOCUMENT,
    documentType
  };
};
export const clearCurrentAccount = () => {
  return {
    type: CLEAR_CURRENT_ACCOUNT
  };
};
