import { createSelector } from 'reselect';
const selectGymSchedules = (state) => state.get('gymSchedule');

const getSchedules = () => createSelector(
  selectGymSchedules,
  (gymScheduleState) => gymScheduleState.get('schedules').toJS()
);
export {
  getSchedules,
};
