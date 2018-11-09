import {
  CHANGE_VALUE,
  SET_VALID,
  SET_INVALID,
  VALIDATE,
  SUBMITTED,
  SUBMITTING,
  SUBMIT
} from "./constants";

export const changeValue = (field, value) => {
  return {
    type: CHANGE_VALUE,
    field,
    value
  };
};

export const validate = (field, validation) => ({
  type: VALIDATE,
  field,
  validation
});

export const setInvalid = (field, error) => ({
  type: SET_INVALID,
  field,
  error
});

export const setValid = (field, error) => ({
  type: SET_VALID,
  field,
  error
});

export const submit = (validations, email, password) => {
  return {
    type: SUBMIT,
    validations,
    email,
    password
  };
};

export const setSubmitting = () => ({
  type: SUBMITTING
});

export const setSubmitted = (values, token) => ({
  type: SUBMITTED,
  values,
  token
});
