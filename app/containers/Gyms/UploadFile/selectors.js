import { createSelector } from 'reselect';

const selectAppContainer = (state) => state.containers.appReducer;

// Need to use .get, beucase reducer defaulState was created by using ImmutableJS
const selectApiData = (state) => selectAppContainer(state).get('apiData');

const selectRegister = (state) => state.get('GymUpload');
const selectNotification = (state) => state.get('notifications');

const getLevels = () => createSelector(
  selectRegister,
  (registerState) => registerState.get('level')
);

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

const fetchSettings = () => createSelector(
  selectRegister,
  (registerState) => registerState.get('settings')
);
const fetchImages = () => createSelector(
  selectRegister,
  (registerState) => registerState.get('images')
);

export {
  getValid,
  selectRegister,
  getFields,
  selectApiData,
  submitErr,
  getSubmitting,
  fetchSettings,
  getLevels,
  fetchImages
};
