import {
  GET_API_TO_EDIT, SET_GYM_EDIT, CHANGE_VALUE, SET_VALID,
  SET_INVALID,
  VALIDATE, SUBMIT, GET_SETTINGS, SET_SETTINGS, GYM_UPLOAD, REMOVE_IMAGE
} from './constants';


export const getApiToEdit = (id) => ({
  type: GET_API_TO_EDIT,
  id
});


export const setGymEdit = (data) => ({
  type: SET_GYM_EDIT,
  data
});

export const changeValue = (field, value) => ({
  type: CHANGE_VALUE,
  field,
  value,

});

export const validate = (field, validation) => {
  return {
    type: VALIDATE,
    field,
    validation,
  }
};

export const setInvalid = (field, error) => ({
  type: SET_INVALID,
  field,
  error,

});

export const setValid = (field, error) => ({
  type: SET_VALID,
  field,
  error,

});

export const submit = (validations, finalData, id) => ({
  type: SUBMIT,
  finalData,
  validations,
  id
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


export const removeImage = (image, id) => ({
  type: REMOVE_IMAGE,
  image,
  id
});