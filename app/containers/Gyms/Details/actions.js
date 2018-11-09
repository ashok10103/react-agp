import {
  GET_GYM_DETAIL,
  SET_GYM_DETAIL,
  GET_RATING_LIST,
  CHANGE_STAR,
  SEND_STAR,
  SET_NEW_STAR,
  ADD_RATING,
  SET_ISSUES,
  SET_MESSAGE,
  SEND_REPORT,
  CLEAR_FP_FORM,
  REVIEW_DETAIL
} from "./constants";

export const getGymDetail = (data, id) => ({
  type: GET_GYM_DETAIL,
  data,
  id
});

export const setGymDetail = data => ({
  type: SET_GYM_DETAIL,
  data
});

export const changeStar = star => {
  return {
    type: CHANGE_STAR,
    star
  };
};

export const sendStarRating = (newRate, feedback, id) => {
  return {
    type: SEND_STAR,
    newRate,
    feedback,
    id
  };
};

export const setNewStar = data => {
  return {
    type: SET_NEW_STAR,
    data
  };
};

export const addRating = () => {
  return {
    type: ADD_RATING,
    showStar: true
  };
};
export const setIssues = (id, value) => {
  return {
    type: SET_ISSUES,
    id,
    value
  };
};

export const setMessage = (name, value) => {
  return {
    type: SET_MESSAGE,
    name,
    value
  };
};

export const sendReport = (gymId, userType, handler) => {
  return {
    type: SEND_REPORT,
    gymId,
    userType,
    handler
  };
};

export const clearFPForm = () => {
  return {
    type: CLEAR_FP_FORM
  };
};

export const getRatingList = (gymId, pageNo) => {
  return {
    type: GET_RATING_LIST,
    gymId,
    pageNo
  };
};

export const reviewDetail = (data, count) => {
  return {
    type: REVIEW_DETAIL,
    data,
    count
  };
};
