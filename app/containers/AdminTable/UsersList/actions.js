import {
  SUBMIT_TOGGLE,
  GET_USERS,
  SET_USERS_LIST,
  BLOCK_USER,
  BLOCK_SUCCESSFULL,
  DELETE_USER,
  SET_PAGENUMBER,
  SEARCH_USER,
  SET_TOTALCOUNT,
  DELETE_SUCCESSFULL,
  SEND_USER_DATA,
  GET_INITIAL_DATA,
  UPDATE_DATA,
  SET_USER_DETAILS
} from "./constants";

export const submitToggle = () => {
  return {
    type: SUBMIT_TOGGLE
  };
};

export const getUsers = (pageNumber, typee, key) => {
  return {
    type: GET_USERS,
    pageNumber,
    typee,
    key
  };
};
export const setUsersList = (data, filterActive) => {
  return {
    type: SET_USERS_LIST,
    data,
    filterActive
  };
};

export const blockUser = (id, blockedState) => {
  return {
    type: BLOCK_USER,
    id,
    blockedState
  };
};
export const deleteUser = id => {
  return {
    type: DELETE_USER,
    id
  };
};

export const blockedMessage = (message, id) => {
  return {
    type: BLOCK_SUCCESSFULL,
    message,
    id
  };
};

export const setPageNumber = pageNumber => ({
  type: SET_PAGENUMBER,
  pageNumber
});

export const searchUser = id => {
  return {
    type: SEARCH_USER,
    id
  };
};

export const setTotalCount = data => ({
  type: SET_TOTALCOUNT,
  data
});

export const deleteSuccessfull = (msg, idd) => {
  return {
    type: DELETE_SUCCESSFULL,
    msg,
    idd
  };
};

export const sendUserData = (typee, field, value) => {
  return {
    type: SEND_USER_DATA,
    typee,
    field,
    value
  };
};

export const updateData = (typee, id, edit) => {
  return {
    type: UPDATE_DATA,
    typee,
    id,
    edit
  };
};

export const getInitialData = (typee, id) => {
  return {
    type: GET_INITIAL_DATA,
    typee,
    id
  };
};

export const setUserDetails = (dataa, typ) => {
  return {
    type: SET_USER_DETAILS,
    dataa,
    typ
  };
};
