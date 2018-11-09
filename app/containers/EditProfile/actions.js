import {
  UPDATE_USER,VALIDATE,CHANGE_VALUE,SET_VALID,SET_INVALID,GET_USER_DATA,SET_USER_DETAILS
} from './constants';

export const updateUser = (user, id, file, handler,validations) => ({
  type: UPDATE_USER,
  user,
  id,
  file,
  handler,
  validations
});

export const validate = (field, validation) => {
  return {
    type: VALIDATE,
    field,
    validation,
  }
};

export const changeValue = (field, value) => {
  return {
    type: CHANGE_VALUE,
    field,
    value,
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
  error

});

export const getUserData = (id) => ({
  type: GET_USER_DATA,
  id

});


export const setUserDetails = (data) => {
  return{
  type: SET_USER_DETAILS,
  data
  }
};



