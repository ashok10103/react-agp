import { fromJS } from 'immutable';
import { SET_DATA

} from './constants';


const initialState = fromJS({
  data:{},
  count:0
  
});

function shareReducer(state = initialState, action) {
  switch (action.type) {
       
    case SET_DATA: {
        const { count,data,gym } = action;
       
      return state
      .set('data', data)
      .set('count', count)
      .set('gym', gym)
      }
    default:
      return state;
  }
}

export default shareReducer;
