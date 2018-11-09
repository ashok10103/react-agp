import { createSelector } from 'reselect';

// Need to use .get, beucase reducer defaulState was created by using
// ImmutableJS

const selectAdminUser = (state) => state.get('UsersList');
const selectGlobalData = (state) => state.get('global');

const getUsersList = () => createSelector(
  selectAdminUser,
   (adminUserState) =>adminUserState.get('users')
  )

  const getBlocked = () => createSelector(
    selectAdminUser,
     (blockedState) =>blockedState.get('blocked')
    )
    const getPageNumber = () => createSelector(
      selectAdminUser,
      (searchState) => searchState.get('pageNumber')
    );

    const getCount = () => createSelector(
      selectAdminUser,
      (searchState) => searchState.get('count')
    );

    const getUserDetails = () => createSelector(
      selectAdminUser,
      (searchState) => searchState.get('userProfile').toJS()
    );

    const getTrainerDetails = () => createSelector(
      selectAdminUser,
      (searchState) => searchState.get('trainerProfile').toJS()
    );

    const getGymDetails = () => createSelector(
      selectAdminUser,
      (searchState) => searchState.get('gymProfile').toJS()
    );

    const getTrainerSettings = () => createSelector(
      selectGlobalData,
      (registerState) => registerState.get('trainerSettings')
    );

    const getSettings = () => createSelector(
      selectGlobalData,
      (registerState) => registerState.get('settings')
    );

    const getDisplay = () => createSelector(
      selectAdminUser,
      (displayState) => displayState.get('display')
    );
    

export {
  getUsersList,
  getBlocked,
  getPageNumber,
  getCount,
  getUserDetails,
  getTrainerDetails,
  getGymDetails ,
  getTrainerSettings,
  getSettings,
  getDisplay

  
};
