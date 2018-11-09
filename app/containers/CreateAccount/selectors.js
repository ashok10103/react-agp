import { createSelector } from 'reselect';



const selectAccount = (state) => state.get('CreateAccount');

const getFields = () => createSelector(
  selectAccount,
  (selectAccountState) => selectAccountState.get('fields').toJS()
);
const getVerificationDetails = () => createSelector(
  selectAccount,
  (selectBankInfoState) => selectBankInfoState.get('bank_fields').toJS()
);
const getHideModal = () => createSelector(
  selectAccount,
  (getHideModalState) => getHideModalState.get('hideModal')
);

const getAccountDetails = () => createSelector(
  selectAccount,
  (selectAccountState) => selectAccountState.get('account')
);
const getBankInfo = () => createSelector(
  selectAccount,
  (selectAccountState) => selectAccountState.get('bankInfo')
);

export {
  getFields,
  getHideModal,
  getAccountDetails,
  getBankInfo,
  getVerificationDetails
};
