import {
  GET_GYM_DETAIL,
  SET_GYM_DETAIL,
  NEW_SCHEDULE,
  UPDATE_SCHEDULE,
  REMOVE_SCHEDULE,
  SAVE_SCHEDULE,
  GET_SCHEDULE,
  SET_SCHEDULE
} from './constants';

export const getGymDetail = (data, id) => ({
  type: GET_GYM_DETAIL,
  data,
  id,
});

export const setGymDetail = (data) => ({
  type: SET_GYM_DETAIL,
  data,
});
export const changeSchedule = (data) => ({
  type: CHANGE_SCHEDULE,
  data,
});

export const newSchedule = (schedule, day) => ({
  type: NEW_SCHEDULE,
  schedule,
  day
});

export const updateSchedule = (schedule, day, index) => ({
  type: UPDATE_SCHEDULE,
  schedule,
  day,
  index
});

export const removeSchedule = (day, index) => ({
  type: REMOVE_SCHEDULE,
  day,
  index
});

export const saveSchedule = (id) => ({
  type: SAVE_SCHEDULE,
  id,
});

export const getSchedule = (id) => ({
  type: GET_SCHEDULE,
  id,
});

export const setSchedule = (data) => ({
  type: SET_SCHEDULE,
  data,
});