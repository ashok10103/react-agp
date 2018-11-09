import { createSelector } from 'reselect';

const selectEditProfile = (state) => state.get('EditProfile');

const getFieldsEdit = () => createSelector(
  selectEditProfile,
  (editState) => editState.get('fields').toJS()

);


export {
  getFieldsEdit
};
