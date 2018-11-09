import {
  GET_TRAINER_DETAIL,
  SET_TRAINER_DETAIL, CHANGE_STAR, SEND_STAR, SET_NEW_STAR
} from './constants';

export const getTrainerDetail = (data, id) => {
  return {
    type: GET_TRAINER_DETAIL,
    data,
    id,
  }
};

export const setTrainerDetail = (data) => {
  return {
    type: SET_TRAINER_DETAIL,
    data,
  }
};


export const changeStar = (star) => {
  return {
    type: CHANGE_STAR,
    star
  }
};

export const sendStarRating = (newRate, id, userId) => {
  return {
    type: SEND_STAR,
    newRate,
    id, userId
  }
};

export const setNewStar = (data) => {
  return {
    type: SET_NEW_STAR,
    data,
  }
};


export const addRating = () => ({
  type: ADD_RATING,
  showStar: true
}
)


