import { fromJS } from 'immutable';
import {SET_NOTIFICATIONS } from './constants';

const initialState = fromJS({
 
  
});


function notificationListReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATIONS:     
    return state
      .set('notifications', action.data);
    default:
      return state;
  }
}

export default notificationListReducer;
