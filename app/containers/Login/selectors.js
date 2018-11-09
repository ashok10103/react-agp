import { createSelector } from 'reselect';

const selectAppContainer = (state) => state.containers.appReducer;

// Need to use .get, beucase reducer defaulState was created by using ImmutableJS
const selectApiData = (state) => selectAppContainer(state).get('apiData');

const selectLogin = (state) => state.get('login');
const selectNotification = (state) => state.get('notifications');

const getFields = () => createSelector(
  selectLogin,
  (loginState) => loginState.get('fields').toJS()
);

const getForgetFields = () => createSelector(
  selectLogin,
  (loginState) => loginState.get('forgetPassword').toJS()
);

const getValid = () => createSelector(
  selectLogin,
  (loginState) => loginState.get('valid')
);

const getSubmitting = () => createSelector(
  selectLogin,
  (loginState) => loginState.get('submitting')
);

const submitErr = () => createSelector(
  selectNotification,
  (submit) => submit 
)

export {
  getValid,
  selectLogin,
  getFields,
  selectApiData,
  submitErr,
  getForgetFields,
  getSubmitting,
};
