import { createSelector } from 'reselect';

const selectTrainerEdit = (state) => state.get('TrainerEdit');
const selectTrainerSettings = (state) => state.get('global');

const getTrainerFields = () => createSelector(
  selectTrainerEdit,
  (editState) => editState.get('fields').toJS()

);

const fetchTrainerSettings = () => createSelector(
  selectTrainerSettings,
  (settingsState) => settingsState.get('trainerSettings')
);

export {
    getTrainerFields, fetchTrainerSettings,
};


