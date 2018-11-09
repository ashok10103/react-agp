import { createSelector } from 'reselect';
const selectGymList = (state) => state.get('gymList');

const GymData = () => createSelector(
  selectGymList,
  (gymListState) => gymListState.get('gyms')
);
export {
  GymData,
};
