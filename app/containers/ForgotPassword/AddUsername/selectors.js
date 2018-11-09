import { createSelector } from 'reselect';

const selectUsername = (state) => state.get('AddUsername');
const getFields = () => createSelector(
    selectUsername,
  (selectUsernameState) => selectUsernameState.get('fields').toJS()
);

export {
  getFields,
};
