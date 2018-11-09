import { createSelector } from 'reselect';

const selectTrainerRegister = (state) => state.get('TrainerRegister');

const getLevels = () => createSelector(
    selectTrainerRegister,
  (registerState) => registerState.get('level')
);

const getFields = () => createSelector(
  selectTrainerRegister,
  (registerState) => registerState.get('fields').toJS()
);

const getValid = () => createSelector(
    selectTrainerRegister,
  (registerState) => registerState.get('valid')
);

const fetchSettings = () => createSelector(
  selectTrainerRegister,
  (settingsState) => settingsState.get('trainerSettings')
);

export {
  getValid,
  selectTrainerRegister,
  getFields,
  fetchSettings,
  getLevels,

};
