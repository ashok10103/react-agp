import { createSelector } from 'reselect';

const selectEditProfile = (state) => state.get('Share');
const selectGlobalData = (state) => state.get('global');

const getData = () => createSelector(
  selectEditProfile,
  (editState) => editState.get('data')

);
const getCount = () => createSelector(
  selectEditProfile,
  (editState) => editState.get('count')

);
const getGym = () => createSelector(
  selectEditProfile,
  (editState) => editState.get('gym')

);
const getSettings = () => createSelector(
  selectGlobalData,
  (registerState) => registerState.get('settings')
);



export {
  getData,
  getCount,
  getGym,
  getSettings
};
