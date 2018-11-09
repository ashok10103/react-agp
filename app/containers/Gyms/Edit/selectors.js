import { createSelector } from 'reselect';

const selectGymEdit = (state) => state.get('gymEdit');

const getFieldsEdit = () => createSelector(
  selectGymEdit,
  (editState) => editState.get('fields').toJS()

);

const fetchSettings = () => createSelector(
  selectGymEdit,
  (registerState) => registerState.get('settings')
);

export {
  getFieldsEdit, fetchSettings,
};


