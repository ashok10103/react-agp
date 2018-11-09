import { fromJS } from 'immutable';
import {
  SET_GYM_LIST,
} from './constants';

const initialState = fromJS({
  gyms: [],
  noMoreData: true,
});
function insertArray(array, action) {
  const newArray = [...array, ...action];
  return newArray;
  }
function gymListReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GYM_LIST: {
      const result = insertArray(state.toJS().gyms, action.data);      
      return state
      .set('noMoreData', action.data.length > 0)
      .set('gyms', result);    
    }
    default:
      return state;
  }
}

export default gymListReducer;
