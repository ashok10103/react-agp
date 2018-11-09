import { createSelector } from 'reselect';

// Need to use .get, beucase reducer defaulState was created by using
// ImmutableJS

const selectResetPassword = (state) => state.get('ResetPassword');
const selectNotification = (state) => state.get('notifications');

const getFields = () => createSelector(selectResetPassword, (resetPasswordState) => resetPasswordState.get('fields').toJS());
const getValid = () => createSelector(selectResetPassword, (resetPasswordState) => resetPasswordState.get('valid'));
const submitErr = () => createSelector(selectNotification, (submit) => submit)

export {
  getValid,
  selectResetPassword,
  getFields,
  submitErr
};
