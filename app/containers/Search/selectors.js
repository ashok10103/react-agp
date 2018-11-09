import { createSelector } from 'reselect';

const selectAppContainer = (state) => state.containers.appReducer;

// Need to use .get, beucase reducer defaulState was created by using ImmutableJS
const selectApiData = (state) => selectAppContainer(state).get('apiData');
const selectGlobalData = (state) => state.get('global');


const selectRegister = (state) => state.get('register');
const selectNotification = (state) => state.get('notifications');
const selectSearch = (state) => state.get('search');


const getSettings = () => createSelector(
  selectGlobalData,
  (registerState) => registerState.get('settings')
);

const getTrainerSettings = () => createSelector(
  selectGlobalData,
  (registerState) => registerState.get('trainerSettings')
);

const fetchGyms = () => createSelector(
  selectSearch,
  (searchState) => searchState.get('gyms')
);

const fetchTrainers = () => createSelector(
  selectSearch,
  (searchState) => searchState.get('trainers')
);

const fetchFilters = () => createSelector(
  selectSearch,
  (searchState) => searchState.get('filters')
);


const getCount = () => createSelector(
  selectSearch,
  (searchState) => searchState.get('count')
);

const getPageNumber = () => createSelector(
  selectSearch,
  (searchState) => searchState.get('pageNumber')
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
  selectApiData,
  submitErr,
  getSubmitting,
  getSettings,
  getTrainerSettings,
  fetchGyms,
  fetchTrainers,
  fetchFilters,
  getCount,
  getPageNumber
};
