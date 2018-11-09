import {
  GET_COMPLAINT_GYMS,SET_GYM_DATA
 
  } from './constants';
  
  export const getComplaintGyms = (pageNumber) => {
      return{
    type: GET_COMPLAINT_GYMS,
    pageNumber
  }};
  export const setGymData = (data,count) => {
    return{
  type: SET_GYM_DATA,
  data,count
}};