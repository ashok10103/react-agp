import { createSelector } from 'reselect';

const selectAppContainer = (state) => state.containers.appReducer;

// Need to use .get, beucase reducer defaulState was created by using ImmutableJS
const selectApiData = (state) => selectAppContainer(state).get('apiData');

const selectRegister = (state) => state.get('register');
const selectNotification = (state) => state.get('notifications');

const getFields = () => createSelector(
  selectRegister,
  (registerState) => registerState.get('fields').toJS()
);

const getValid = () => createSelector(
  selectRegister,
  (registerState) => registerState.get('valid')
);

const getSubmitting = () => createSelector(
  selectRegister,
  (registerState) => registerState.get('submitting')
);

const submitErr = () => createSelector(
  selectNotification,
  (submit) => submit 
)

export {
  getValid,
  selectRegister,
  getFields,
  selectApiData,
  submitErr,
  getSubmitting,
};
