import { createSelector } from 'reselect';


const selectAdminLogin = (state) => state.get('ReportGym');


const getGymData = () => createSelector(selectAdminLogin, (adminLoginState) => adminLoginState.get('data'));
const getCount = () => createSelector(selectAdminLogin, (adminLoginState) => adminLoginState.get('count'));

export {

  getGymData,getCount
  
};
