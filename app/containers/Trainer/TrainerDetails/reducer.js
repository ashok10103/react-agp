import { fromJS } from 'immutable';
import {
  SET_TRAINER_DETAIL, CHANGE_STAR, SET_NEW_STAR,ADD_RATING
} from './constants';

const initialState = fromJS({
  showStar: false,
  star: 0
});

function trainerDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TRAINER_DETAIL:
      return state
        .set('details', action.data);
    case CHANGE_STAR:
      return state
        .set('star', action.star);

    case SET_NEW_STAR:
      const starr = action.data.rating
      return state
        .set('star', starr);
        
    case ADD_RATING:
      return state
        .set('showStar',true);
    default:
      return state;
  }
}

export default trainerDetailReducer;
