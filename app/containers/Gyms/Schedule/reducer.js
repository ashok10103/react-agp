import { fromJS, Map } from 'immutable';
import {
  SET_GYM_DETAIL,
  NEW_SCHEDULE,
  UPDATE_SCHEDULE,
  SET_SCHEDULE
} from './constants';

const scheduleSample =  {
  sunday: [],
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
};

const initialState = fromJS({
  schedules: scheduleSample
});


function gymScheduleReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GYM_DETAIL:
      return state
        .set('gym', action.data);
    case NEW_SCHEDULE:
      const { schedule, day } = action;
      const daySchedule = state.toJS()['schedules'][day]
      daySchedule.push(schedule);
      const schedules = state.get('schedules').setIn([day], daySchedule);
      return state
        .set('schedules', schedules);
    case UPDATE_SCHEDULE:
      const daySchedules = state.toJS()['schedules'][action.day]
      if (action.schedule) {
        daySchedules.splice(action.index, 1, action.schedule);
      } else {
        daySchedules.splice(action.index, 1);
      }
      const scheduleValues = state.get('schedules').setIn([action.day], daySchedules);
      return state
        .set('schedules', scheduleValues);
    case SET_SCHEDULE:
      const { data } = action;
      const slots =  data.timeSlots && data.timeSlots.length ? data.timeSlots[0] : scheduleSample;
      const schedulesObj = fromJS(slots)
      return state
        .set('schedules', schedulesObj);
    default:
      return state;
  }
}

export default gymScheduleReducer;
