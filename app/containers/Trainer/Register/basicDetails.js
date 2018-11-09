import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import ReactFlagsSelect from "react-flags-select";
import "react-flags-select/css/react-flags-select.css";
let countryData = require("../../../assets/country.json");
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

const validations = {
  trainerInfo: ["empty:Trainer Info"],
  country: ["empty:Country"],
  trainerType: ["empty:Trainer type"],
  certificates: ["empty:Certificates"]
};

class BasicDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      address: {},
      region:''
    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.onNext = this.onNext.bind(this);
    this.selectRegion = this.selectRegion.bind(this);
  }
  handleOnChange({ target }) {
    return (
      this.props.changeValue(target.name, target.value, "field1"),
      this.props.validate(target.name, validations[target.name], "field1")
    );
  }
  onSelectFlag(code) {
    let countryName;
    Object.keys(countryData).forEach(function(key) {
      if (countryData[key].value == code) {
        return (countryName = countryData[key].label);
      }
    });

    this.props.changeValue("country", countryName, "field1");
    this.props.validate("country", validations["country"], "field1");
  }
  onNext(e) {
    this.props.onSubmit(validations, "field1", e);
  }
  handleAddressChange({ target }) {
    const address = this.state.address;
    address[target.name] = target.value;
    address['state'] = this.state.region;
    this.props.changeValue('address', address, 'field1');
  }

  selectRegion (val) {
    this.setState({ region: val });
    this.props.changeValue('state', this.state.region, 'field1');
  
  }
  render() {
    return (
      <form
        className="registration-section trainer"
        action="trainer-registration2.html"
      >
        <div className="reg-box">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Trainer Info</label>
                <textarea
                  cols="30"
                  rows="3"
                  name="trainerInfo"
                  value={this.props.fields.field1.trainerInfo.value}
                  placeholder="Type here"
                  className="form-control"
                  onChange={this.handleOnChange}
                />
                <span className="message">
                  {this.props.fields.field1.trainerInfo.errors.map(e => (
                    <span key={e}>{e}</span>
                  ))}
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Address Line 1</label>
                <input
                  className="form-control"
                  name="addressLine1"
                  value={this.props.fields.field1.address.value.addressLine1}
                  placeholder="Type Here"
                  type="text"
                  onChange={this.handleAddressChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Address Line 2</label>
                <input
                  className="form-control"
                  name="addressLine2"
                  value={this.props.fields.field1.address.value.addressLine2}
                  placeholder="Type here"
                  type="text"
                  onChange={this.handleAddressChange}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
              <label>Country</label>
                <ReactFlagsSelect
                  searchable={true}
                  defaultCountry={this.props.fields.field1.country.value}
                  onSelect={e => this.onSelectFlag(e)}
                  className="form-control"
                />
                <span className="message">
                  {this.props.fields.field1.country.errors.map(e => (
                    <span key={e}>{e}</span>
                  ))}
                </span>                
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>State</label>
                <RegionDropdown
                  country={
                    this.props.fields.field1.country &&
                    this.props.fields.field1.country.value
                  }
                  value={this.state.region}
                  onChange={val => this.selectRegion(val)}
                  blankOptionLabel="Select a state"
                  classes="form-control text-color"
                />               
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
              <label>City</label>
                <input
                  className="form-control"
                  name="city"
                  value={this.props.fields.field1.address.value.city}
                  placeholder="Type here"
                  type="text"
                  onChange={this.handleAddressChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
              <label>Zip code</label>
                <input
                  className="form-control"
                  name="zip"
                  value={this.props.fields.field1.address.value.zip}
                  placeholder="Type here"
                  type="number"
                  min="0"
                  onChange={this.handleAddressChange}
                />
             
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">

               <label>Landmark</label>
                <input
                  className="form-control"
                  name="landmark"
                  value={this.props.fields.field1.address.value.landmark}
                  placeholder="Type here"
                  type="text"
                  onChange={this.handleAddressChange}
                />
             
              </div>
            </div>
          </div>
          <div className="form-group text-center">
            <input
              className="btn btn-next"
              type="submit"
              onClick={this.onNext}
            />
          </div>
        </div>
      </form>
    );
  }
}
export default BasicDetails;
