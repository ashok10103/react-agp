import {
  GET_GYM_LIST,
  SET_GYM_LIST,
} from './constants';

export const getGymList = (data) => ({
  type: GET_GYM_LIST,
  data,
});

export const setGymList = (data) => ({
  type: SET_GYM_LIST,
  data,
});
