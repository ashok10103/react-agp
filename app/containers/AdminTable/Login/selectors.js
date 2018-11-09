import { createSelector } from 'reselect';


const selectAdminLogin = (state) => state.get('AdminLogin');


const getFields = () => createSelector(selectAdminLogin, (adminLoginState) => adminLoginState.get('fields').toJS());

export {

  getFields,
  
};
