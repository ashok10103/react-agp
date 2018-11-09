import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";
import {
  closeModal,
  changeValue,
  validate,
  submit,
  setToken,
  getBankDetails,
  submitDocuments,
  clearCurrentAccount
} from "./actions";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import {
  getFields,
  getHideModal,
  getAccountDetails,
  getBankInfo,
  getVerificationDetails
} from "./selectors";
// import { getUserclassName, setUserState, getUserType } from '../../utils/helper';
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";
import Notifications from "react-notification-system-redux";
import { CardForm, BankForm, PaymentMethods } from "react-payment";
import BankDetails from "./bankDetails";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import ReactFlagsSelect from "react-flags-select";
import "react-flags-select/css/react-flags-select.css";
import config from "../../utils/config/development";

let countryData = require("../../assets/country.json");
// const userType = getUserType();

const validations = {
  acNumber: ["empty:Account number"],
  routingNumber: ["empty:Routing number"],
  country: ["empty:country"],
  currency: ["empty:currency"],
  acName: ["empty:Account Holder Name"],
  acType: ["empty:Account Holder Type"]
};
// const notificationOpts = {
// 	// uid: 'once-please', // you can specify your own uid if required
// 	title: '',
// 	message: '',
// 	position: 'tc',
// 	autoDismiss: 5
// };
let loadedStripe = false;
const currencyOptions = [
  { value: "USD", label: "United States Dollars" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "British Pound" }
];
const notificationOpts = {
  message: "Welcome to Airgym",
  position: "tc",
  autoDismiss: 5
};
class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      readOnly: true,
      preview: null,
      file: "",
      showProfile: true,
      showVerify: false
    };

    // this.updateUser = this.updateUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleCurrencyOnChange = this.handleCurrencyOnChange.bind(this);
    this.getCurrentCurrency = this.getCurrentCurrency.bind(this);
    this.getStripeToken = this.getStripeToken.bind(this);
    this.closeModalPopup = this.closeModalPopup.bind(this);
    this.manageModal = this.manageModal.bind(this);
  }

  componentDidMount() {
    let stripe = Stripe(config.stripeKey);
    this.props.getBankDetails();
  }

  handleCurrencyOnChange({ value }) {
    this.props.changeValue("currency", value, "fields");
    this.props.validate("currency", validations["currency"], "fields");
  }

  handleOnChange({ target }) {
    return (
      this.props.changeValue(target.name, target.value, "fields"),
      this.props.validate(target.name, validations[target.name], "fields")
    );
  }

  handleSubmit() {
    this.props.onSubmit(validations, this.getStripeToken, "fields");
  }
  getStripeToken() {
    const stripe = Stripe(config.stripeKey);
    const values = this.props.fields;
    stripe
      .createToken("bank_account", {
        country: values.country.value,
        currency: values.currency.value,
        account_holder_name: values.acName.value,
        account_holder_type: values.acType.value,
        routing_number: values.routingNumber.value,
        account_number: values.acNumber.value
      })
      .then(token => {
        if (token && token.token) {
          this.props.setToken(token.token);
        } else {
          notificationOpts.message = token.error
            ? token.error.code
            : "Please check the values";
          this.props.getNotifications(notificationOpts);
        }
      })
      .catch(e => {});
  }
  getCurrentCurrency() {
    return this.props.fields.currency &&
      this.props.fields.currency.value &&
      this.props.fields.currency.value.length
      ? this.props.fields.currency.value
      : null;
  }

  onSelectFlag(code) {
    let countryName;
    this.props.changeValue("country", code, "fields");
    this.props.validate("country", validations["country"], "fields");
  }
  editAccount() {
    this.props.clearCurrentAccount()
  }
  manageModal() {
    this.setState({ showVerify: !this.state.showVerify });
  }
  closeModalPopup() {
    this.props.toggleModalAccount();
  }
  render() {
    const { fields, showAccount, toggleModalAccount, bankInfo } = this.props;
    const { user } = this.state;

    return (
      <div className="modal-window">
        <Modal
          show={showAccount}
          // className="modal fade modal-padding editProfile"
          className={cx("modal fade modal-padding editProfile", {
            "manage-create-popup": this.state.showVerify
          })}
          id="editProfile1"
        >
          {/* <BankDetails /> */}
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="create-account-close"
                  onClick={this.closeModalPopup}
                >
                  &times;
                </button>
                {!bankInfo.verificationStatus && (
                  <div className="varify-section">
                    {/* <div className="varify-not">
                      <i className="icon sprite-exclamation" />
                    </div> */}
                    <h4 className="vaifyttl text-primary">
                      Add Your Account Details
                    </h4>
                  </div>
                )}
                {bankInfo.verificationStatus === "not verified" && (
                  <div className="varify-section">
                    <div className="varify-not">
                      <i className="icon sprite-exclamation" />
                    </div>
                    <h4 className="vaifyttl text-additional">Not Verified</h4>
                  </div>
                )}
                {bankInfo.verificationStatus === "verified" && (
                  <div className="varify-section">
                    <div className="varify">
                      <i className="icon sprite-right" />
                    </div>
                    <h4 className="vaifyttl text-primary">Verified</h4>
                  </div>
                )}
              </div>
              <div className="modal-body">
                <form className="cstm_form">
                  <div className="row formrow">
                    <div className="col-sm-4">
                      <h4 className="accountdetls">
                        Account Holder Name <span className="hyphen">-</span>
                      </h4>
                    </div>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        name="acName"
                        value={fields.acName.value}
                        onChange={this.handleOnChange}
                        readOnly={bankInfo.verificationStatus}
                      />
                      <span className="message">
                        {fields &&
                          fields.acName.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                      </span>
                    </div>
                  </div>
                  <div className="row formrow">
                    <div className="col-sm-4">
                      <h4 className="accountdetls">
                        Account Number <span className="hyphen">-</span>
                      </h4>
                    </div>
                    <div className="col-sm-8">
                      <input
                        type=""
                        className="form-control"
                        name="acNumber"
                        value={fields.acNumber.value}
                        onChange={this.handleOnChange}
                        readOnly={bankInfo.verificationStatus}
                      />
                      <span className="message">
                        {fields &&
                          fields.acNumber.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                      </span>
                    </div>
                  </div>
                  <div className="row formrow">
                    <div className="col-sm-4">
                      <h4 className="accountdetls">
                        Routing Number <span className="hyphen">-</span>
                      </h4>
                    </div>
                    <div className="col-sm-8">
                      <input
                        type="number"
                        className="form-control"
                        name="routingNumber"
                        value={fields.routingNumber.value}
                        onChange={this.handleOnChange}
                        readOnly={bankInfo.verificationStatus}

                      />
                      <span className="message">
                        {fields &&
                          fields.routingNumber.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                      </span>
                    </div>
                  </div>
                  <div className="row formrow">
                    <div className="col-sm-4">
                      <h4 className="accountdetls">
                        Country <span className="hyphen">-</span>
                      </h4>
                    </div>
                    <div className="col-sm-8">
                      <ReactFlagsSelect
                        searchable={true}
                        disabled={bankInfo.verificationStatus}
                        value={fields.country.value}
                        countries={["US", "GB", "FR", "DE", "IT", "NG"]}
                        defaultCountry={fields.country.value || 'US' }
                        onSelect={e => this.onSelectFlag(e)}
                        className="form-control"
                      />
                      <span className="message">
                        {fields &&
                          fields.country.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                      </span>
                    </div>
                  </div>
                  <div className="row formrow">
                    <div className="col-sm-4">
                      <h4 className="accountdetls">
                        Currency <span className="hyphen">-</span>
                      </h4>
                    </div>
                    <div className="col-sm-8">
                      <Dropdown
                        options={currencyOptions}
                        placeholder="Select an option"
                        value={this.getCurrentCurrency()}
                        disabled={bankInfo.verificationStatus}
                        onChange={this.handleCurrencyOnChange}
                      />
                      <span className="message">
                        {fields &&
                          fields.currency.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                      </span>
                    </div>
                  </div>
                  <div className="row formrow">
                    <div className="col-sm-4">
                      <h4 className="accountdetls">
                        AccountHolder Type <span className="hyphen">-</span>
                      </h4>
                    </div>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        name="acType"
                        value={fields.acType.value}
                        onChange={this.handleOnChange}
                        readOnly={bankInfo.verificationStatus}
                      />
                      <span className="message">
                        {fields &&
                          fields.acType.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                      </span>
                    </div>
                  </div>
                  <div className="row formrow">
                    <div className="submit-wrp col-md-12 ">
                      {/* <input type="submit" className="btn btn-submit text-primary" value="Verify" id="update" /> */}
                      {!fields.acNumber.value ||
                        (!bankInfo.account_holder_type && (
                          <button
                            type="button"
                            style={{ margin: "auto !important" }}
                            onClick={() => this.handleSubmit()}
                            className="btn btn-primary btn-submit text-primary"
                            id="edit"
                          >
                            Create Bank Account
                          </button>
                        ))}
                      {fields.acNumber.value &&
                        bankInfo.verificationStatus === "verified" && (
                          <button
                            type="button"
                            style={{ margin: "auto !important" }}
                            onClick={() => this.editAccount()}
                            className="btn btn-primary btn-submit"
                            id="edit"
                          >
                            Change Account
                          </button>
                        )}
                      {fields.acNumber.value &&
                        bankInfo &&
                        bankInfo.remainingFields && bankInfo.remainingFields.length ?
                        // bankInfo.verificationStatus !== "verified" && (
                          (<button
                            type="button"
                            style={{ margin: "auto !important" }}
                            onClick={e => this.manageModal(e)}
                            className="btn btn-primary btn-submit"
                            id="edit"
                          >
                            Verify
                          </button>
                        ): ''}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Modal>
        <BankDetails
          showAccount={this.state.showVerify}
          bankInfo={this.props.bankInfo}
          closeModal={this.manageModal}
          changeValue={this.props.changeValue}
          validate={this.props.validate}
          verifyFields={this.props.verifyFields}
          onSubmit={this.props.onSubmit}
          addDocuments={this.props.addDocuments}
          //  {...this.props}
        />
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    closeModal: () => dispatch(closeModal()),
    changeValue: (field, value, module) => {
      const Value = value;
      return dispatch(changeValue(field, Value, module));
    },
    validate: (field, validation, module) =>
      dispatch(validate(field, validation, module)),
    onSubmit: (validations, handler, module, changedFields) => {
      return dispatch(submit(validations, handler, module, changedFields));
    },
    setToken: token => {
      return dispatch(setToken(token));
    },
    getBankDetails: () => {
      return dispatch(getBankDetails());
    },
    addDocuments:(handler, changedFields) => {
      return dispatch(submitDocuments(handler, changedFields));
    },
    getNotifications: notificationOpts => {
      return dispatch(Notifications.error(notificationOpts));
    },
    clearCurrentAccount: () => {
      return dispatch(clearCurrentAccount());
    }
  };
}
const mapStateToProps = createStructuredSelector({
  fields: getFields(),
  verifyFields: getVerificationDetails(),
  Account: getAccountDetails(),
  bankInfo: getBankInfo()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "CreateAccount", reducer });
const withSaga = injectSaga({ key: "CreateAccount", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(CreateAccount);
