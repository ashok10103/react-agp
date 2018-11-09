import {
  GET_SHARE_DATA, SET_DATA
} from './constants';


export const getShareData = (id) => ({
  type: GET_SHARE_DATA,
  id

});

export const setData = (gym,count,data) => {
  return{
    type: SET_DATA,
    gym,
    count,
    data
  }
 

};




