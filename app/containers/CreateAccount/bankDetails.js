import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

import { Link } from "react-router-dom";
import Gallery from "react-grid-gallery";
import { createStructuredSelector } from "reselect";
import cx from "classnames";
import BookingList from "components/BookingList";
import { getBookingsSlots } from "./selectors";
import { getBookings } from "./actions";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import { weekDays, getDate } from "utils/helper";
import reducer from "./reducer";
import saga from "./saga";
import { Modal, Button } from "react-bootstrap";

const days = weekDays();
const style = {
  zIndex: 1
};
const validations = {
  firstName: ["empty:First Name"],
  lastName: ["empty:Last Name"],
  dob: ["empty:dob"],
  postalCode: ["empty:Postal Code"],
  city: ["empty:city"],
  addressLine1: ["empty:Address Line1"],
  state: ["empty:State"],
  personalId: ["empty:PersonalId"],
  document: ["empty:Document Front Image"],
  document_back: ["empty:Document Back Image"]
  // businessName:  ["empty:Business Name"],
  // businessTaxId:  ["empty:Business Tax Id"],
};
class BankDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: "",
      file: "",
      verifyData: {
        firstName: "",
        lastName: "",
        dob: "",
        postalCode: "",
        city: "",
        addressLine1: "",
        state: "",
        personalId: "",
        businessName: "",
        businessTaxId: "",
        startDate: moment()
      },
      changedFields: []

    };
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitDocuments = this.submitDocuments.bind(this);
    this.getMaxDate = this.getMaxDate.bind(this);
  }
  handleChange(date) {
    const changedFields = this.state.changedFields;
    if(changedFields.indexOf('dob') === -1) {
      changedFields.push('dob')
      this.setState({changedFields})
    }
    this.setState({
      startDate: date
    });
    const formatDate = moment(date).format("YYYY-MM-DD");
    this.props.changeValue("dob", formatDate, "bank_fields");
    this.props.validate("dob", validations["dob"], "bank_fields");
  }
  handleImageUpload(e, documentType) {
    e.preventDefault();
    if (
      e.target.files[0].type === "image/jpeg" ||
      e.target.files[0].type === "image/png"
    ) {
      this.setState({ fileFormat: false });
      const reader = new FileReader();
      const imageFile = e.target.files[0];
      // this.props.onChange(e.target.name, imageFile);
      reader.onloadend = () => {
        this.setState({
          preview: reader.result,
          documentType,
          file: imageFile
        });
        const fileType = [
          {
            fileName: imageFile.name,
            fileType: imageFile.type
          }
        ];
      };
      reader.readAsDataURL(imageFile);
      // if (e.target.name === 'baseImage') {
      // 	this.props.onValidate(e.target.name, validations[e.target.name]);
      // }
      const changedFields = this.state.changedFields;
      if(changedFields.indexOf(documentType) === -1) {
        changedFields.push(documentType)
        this.setState({changedFields})
      }
      this.props.changeValue(documentType, imageFile, "bank_fields");
      this.props.validate(
        documentType,
        validations[documentType],
        "bank_fields"
      );
    } else {
      this.setState({ preview: "" });
    }
  }
  changeValue({ target }) {
    const changedFields = this.state.changedFields;
    if(changedFields.indexOf(target.name) === -1) {
      changedFields.push(target.name)
      this.setState({changedFields})
    }
    const bankInfo = this.state.verifyData;
    bankInfo[target.name] = target.value;

    this.setState({ verifyData: bankInfo });
    this.props.changeValue(target.name, target.value, "bank_fields");
    this.props.validate(target.name, validations[target.name], "bank_fields");
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(validations, this.submitDocuments, "bank_fields", this.state.changedFields);
  }
  submitDocuments() {
    this.props.addDocuments(this.closeModal, this.state.changedFields);
  }
  closeModal() {
    this.props.closeModal();
  }

  getMaxDate() {
    const date = new Date();
    const diff = moment(date).subtract(7, "years");    
    return new Date(diff);
  }
  getDob(date) {
    const dateValue = date ? date.split('-'): '';
    const newDate  = dateValue && dateValue.length ? `${dateValue[2]}-${dateValue[1]}-${dateValue[0]}`: ''   
    if (date) {
      return moment(date);
    }
    return moment();
  }
  render() {
    const { bankInfo, showAccount, verifyFields } = this.props;
    const { verifyData } = this.state;
    return (
      <Modal
        show={showAccount}
        className="modal fade paymentmodal"
        id="editProfile"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.closeModal}>
                &times;
              </button>
              <ul className="nav nav-tabs">
                {bankInfo && bankInfo.account_holder_type === "individual" ? (
                  <li className="active">
                    <a
                      className="tabttle"
                      data-toggle="tab"
                      href="#basicInfo"
                      aria-expanded="true"
                    >
                      Individual
                    </a>
                  </li>
                ) : (
                  <li className="">
                    <a
                      className="tabttle"
                      data-toggle="tab"
                      href="#others"
                      aria-expanded="false"
                    >
                      Business
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div className="modal-body">
              <div className="">
                <div className="tab-content">
                  <div id="basicInfo" className="tab-pane fade active in">
                    <form className="form-tb">
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group">
                            <input
                              className="form-control"
                              value={verifyFields.firstName.value}
                              disabled={
                                bankInfo.legalDetails &&
                                bankInfo.legalDetails.first_name
                                  ? true
                                  : false
                              }
                              placeholder="First name"
                              type="text"
                              name="firstName"
                              onChange={this.changeValue}
                            />
                          </div>
                          <span className="message" style={{color:'red',paddingTop:'10px'}}>
                            {verifyFields &&
                              verifyFields.firstName.errors.map(e => (
                                <span key={e}>{e}</span>
                              ))}
                          </span>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <input
                              className="form-control"
                              value={verifyFields.lastName.value}
                              placeholder="Last name"
                              disabled={
                                bankInfo.legalDetails &&
                                bankInfo.legalDetails.last_name
                                  ? true
                                  : false
                              }
                              type="text"
                              name="lastName"
                              onChange={this.changeValue}
                            />
                          </div>
                          {verifyFields &&
                            verifyFields.lastName.errors.map(e => (
                              <span key={e}>{e}</span>
                            ))}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group">
                            <span
                              className="form-control"
                              value=""
                              placeholder="Dob"
                              type="text"
                              name="dob"
                            >
                              <DatePicker
                                selected={this.getDob(verifyFields.dob.value)}
                                onSelect={this.handleChange}
                                onChange={this.handleChange}
                                peekNextMonth
                                showMonthDropdown
                                showYearDropdown
                                dateFormat="YYYY/MM/DD"
                                placeholderText="DOB"
                                // disabled={
                                //   bankInfo.legalDetails &&
                                //   bankInfo.legalDetails.dob.day &&
                                //   bankInfo.legalDetails.dob
                                //     ? true
                                //     : false
                                // }
                                // maxDate={this.getMaxDate}
                              />
                            </span>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <input
                              className="form-control"
                              value={verifyFields.postalCode.value}
                              placeholder="Postal code"
                              type="number"
                              name="postalCode"
                              onChange={this.changeValue}
                              disabled={
                                bankInfo.legalDetails &&
                                bankInfo.legalDetails.address.postal_code
                                  ? true
                                  : false
                              }
                            />
                          </div>
                          {verifyFields &&
                            verifyFields.postalCode.errors.map(e => (
                              <span key={e}>{e}</span>
                            ))}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group">
                            <input
                              className="form-control"
                              value={verifyFields.city.value}
                              placeholder="City"
                              type="text"
                              name="city"
                              required={true}
                              disabled={
                                bankInfo.legalDetails &&
                                bankInfo.legalDetails.address.city
                                  ? true
                                  : false
                              }
                              onChange={this.changeValue}
                            />
                          </div>
                          {verifyFields &&
                            verifyFields.city.errors.map(e => (
                              <span key={e}>{e}</span>
                            ))}
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <input
                              className="form-control"
                              value={verifyFields.addressLine1.value}
                              placeholder="Address line 1"
                              type="text"
                              name="addressLine1"
                              disabled={
                                bankInfo.legalDetails &&
                                bankInfo.legalDetails.address.line1
                                  ? true
                                  : false
                              }
                              onChange={this.changeValue}
                            />
                          </div>
                          {verifyFields &&
                            verifyFields.addressLine1.errors.map(e => (
                              <span key={e}>{e}</span>
                            ))}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group">                                                                                                                             
                            <input
                              className="form-control"
                              value={verifyFields.state.value}
                              disabled={
                                bankInfo.legalDetails &&
                                bankInfo.legalDetails.address.state
                                  ? true
                                  : false
                              }
                              placeholder="State"
                              name="state"
                              type="text"
                              onChange={this.changeValue}
                            />
                          </div>
                          {verifyFields &&
                            verifyFields.state.errors.map(e => (
                              <span key={e}>{e}</span>
                            ))}
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <input
                              className="form-control"
                              value={verifyFields.personalId.value || ""}
                              disabled={
                                bankInfo.legalDetails &&
                                bankInfo.legalDetails
                                  .personal_id_number_provided
                                  ? true
                                  : false
                              }
                              placeholder={bankInfo.legalDetails &&
                                bankInfo.legalDetails
                                  .personal_id_number_provided
                                  ? "********" :"Personal Id"}
                              name="personalId"
                              type="number"
                              onChange={this.changeValue}
                            />
                          </div>
                          {verifyFields &&
                            verifyFields.personalId.errors.map(e => (
                              <span key={e}>{e}</span>
                            ))}
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <div className="form-group">
                            {/* <input className="form-control" value="" placeholder="State" type="text" /> */}
                            <input
                              type="file"
                              name="document"
                              disabled={
                                bankInfo.legalDetails &&
                                bankInfo.legalDetails
                                  .verification.document
                                  ? true
                                  : false
                              }
                              placeholder="Add any identity proof document photo front side"
                              onChange={e =>
                                this.handleImageUpload(e, "document")
                              }
                              accept="image/*"
                            />
                            {/* {verifyFields &&
                          verifyFields.document.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))} */}
                            <label htmlFor="document">
                              Add any identity proof document photo front side
                            </label>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="form-group">
                            <input
                              type="file"
                              disabled={
                                bankInfo.legalDetails &&
                                bankInfo.legalDetails
                                  .verification.document_back
                                  ? true
                                  : false
                              }
                              name="document_back"
                              placeholder="Add any identity proof document photo back side"
                              onChange={e =>
                                this.handleImageUpload(e, "document_back")
                              }
                              accept="image/*"
                            />
                            <label htmlFor="document_back">
                              Add any identity proof document photo back side
                            </label>
                            {/* {verifyFields &&
                          verifyFields.document_back.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))} */}
                          </div>
                        </div>
                      </div>
                      {bankInfo &&
                        bankInfo.account_holder_type !== "individual" && (
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="form-group">
                                <input
                                  className="form-control"
                                  value={verifyData.businessName.value}
                                  placeholder="Business name"
                                  name="businessName"
                                  type="text"
                                />
                              </div>
                              {verifyFields &&
                                verifyFields.businessName.errors.map(e => (
                                  <span key={e}>{e}</span>
                                ))}
                            </div>
                            <div className="col-sm-6">
                              <div className="form-group">
                                <input
                                  className="form-control"
                                  value={verifyFields.businessTaxId.value}
                                  name="businessTaxId"
                                  placeholder="Business taxId"
                                  type="text"
                                />
                              </div>

                              {verifyFields &&
                                verifyFields.businessTaxId.errors.map(e => (
                                  <span key={e}>{e}</span>
                                ))}
                            </div>
                          </div>
                        )}
                      <div className="submit-wrp text-center loginadminbtn">
                        <input
                          className="btn btn-submit text-primary"
                          value="SAVE"
                          id="update"
                          type="button"
                          onClick={e => this.handleSubmit(e)}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default BankDetails;
