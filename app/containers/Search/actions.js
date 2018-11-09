import {
  GET_GYMS,
  SET_GYMS,
  GET_TRAINERS,
  SET_TRAINERS,
  SET_FILTER,
  SET_TOTALCOUNT,
  SET_PAGENUMBER
} from './constants';

export const updateUser = (user, id, file, handler) => ({
  type: UPDATE_USER,
  user,
  id,
  file,
  handler
});

export const getTrainers = (data, loadMore) => ({
  type: GET_TRAINERS,
  data,
  loadMore
});

export const getGyms = (data, limit, loadMore) => ({
  type: GET_GYMS,
  data,
  limit,
  loadMore
});

export const setTrainers = (data, loadMore) => ({
  type: SET_TRAINERS,
  data,
  loadMore
});

export const setGyms = (data, loadMore) => ({
  type: SET_GYMS,
  data,
  loadMore
});

export const setFilters = (data) => ({
  type: SET_FILTER,
  data
});

export const setTotalCount = (data) => ({
  type: SET_TOTALCOUNT,
  data
});

export const setPageNumber = (pageNumber) => ({
  type: SET_PAGENUMBER,
  pageNumber
});