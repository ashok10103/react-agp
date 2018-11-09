import {

  CHANGE_VALUE,
  SET_VALID,
  SET_INVALID,
  VALIDATE,
  SUBMIT,
  SET_GYM_EDIT,
  GET_SETTINGS,
  SET_TRAINER_SETTINGS, SET_TRAINER_EDIT,
  NEXT_LEVEL,
  GET_API_TO_EDIT
} from './constants';


export const changeValue = (field, value) => {
  return {
    type: CHANGE_VALUE,
    field,
    value,

  }
};


//   // Validate an individual field given a specific validation
export const validate = (field, validation) => ({
  type: VALIDATE,
  field,
  validation,

});

//   // Mark a field as invalid with a specific error message
export const setInvalid = (field, error) => {
  return {
    type: SET_INVALID,
    field,
    error,
  }

};

//   // Mark the field as invalid with the error message to be removed
export const setValid = (field, error) => ({

  type: SET_VALID,
  field,
  error,

});


export const submit = (validations, finalData, id) => ({
  type: SUBMIT,
  validations,
  finalData,

  id
});

export const getSettings = () => {
  return {
    type: GET_SETTINGS,
  }
}

export const getApiToEdit = (id) => {
  return {
    type: GET_API_TO_EDIT,
    id
  }
}

export const setTrainerEdit = (data) => {
  return {
    type: SET_TRAINER_EDIT,
    data
  }
};
export const setTrainerSettings = (settings) => ({
  type: SET_TRAINER_SETTINGS,
  settings,
});


