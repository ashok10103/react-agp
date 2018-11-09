import { fromJS } from 'immutable';
import  {uniqBy} from 'lodash';
import {
  SET_GYMS,
  SET_TRAINERS,
  SET_FILTER,
  SET_TOTALCOUNT,
  SET_PAGENUMBER
} from './constants';

const initialState = fromJS({
  gyms: [],
  trainers: [],
  filters: {},
  pageNumber: 1,
});

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GYMS:
      const loadMore = action.loadMore;
      let gyms = Object.assign([],state.get('gyms'));
      let gymData = Object.assign([],state.get('gyms'));    
      if (loadMore && gymData.length) {     
     
        // gyms = uniqBy(gyms.concat(action.data), '_id')
        if (action.data.length == 0 && gyms){
            gyms = gyms
        }
        else{
          gyms = action.data
        }
      } else {
        gyms = uniqBy(action.data, '_id');
      }
      return state
        .set('gyms', gyms)
    case SET_TRAINERS:
      const loadMoreValue = action.loadMore;

      let trainers = state.get('trainers');
      let trainersData = state.get('trainers');

      if (loadMoreValue && trainersData.length) {

        trainers = uniqBy(trainers.concat(action.data), '_id')
      } else {
        trainers = action.data;
      }
      return state
        .set('trainers', trainers)
    case SET_TOTALCOUNT:
      return state
        .set('count', action.data)
    case SET_FILTER:
      return state
        .set('filters', action.data)
    case SET_PAGENUMBER:        
      return state
      .set('pageNumber', action.pageNumber)
    default:
      return state;
  }
}

export default searchReducer;
