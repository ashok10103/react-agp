import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';
import { changeValue, validate, submit, getSettings, moveToNext } from './actions';
import { getFields, getValid, submitErr, getSubmitting, fetchSettings } from './selectors';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import ReactFlagsSelect from 'react-flags-select';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import 'react-flags-select/css/react-flags-select.css';

let countryData = require('../../../assets/country.json')

const validations = {
  name: ["empty:Name"],
  gymInfo: ["empty:Gym Information"],
  country: ["empty:Country"],
  phoneNumber:["empty:Phone number"]
};

class BasicDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      address: {},
      region: '' 

    };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.onNext = this.onNext.bind(this);
    this.selectRegion = this.selectRegion.bind(this);
  }
  handleOnChange({ target }) {
    this.props.changeValue(target.name, target.value, 'field1');
    this.props.validate(target.name, validations[target.name], 'field1')
  }
  onSelectFlag(code) {
    let countryName
    Object.keys(countryData).forEach(function (key) {
      if (countryData[key].value == code) {
        countryName = countryData[key].label
      }
    });

    this.props.changeValue('country', countryName, 'field1');
    this.props.validate('country', validations['country'], 'field1')
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
    this.props.validate('state', validations['state'], 'field1')
  }
  render() {

    const { countryCode } = this.props.fields.field1.country.value
    return (
      <form className="registration-section" action="gym-registration-step2.html">
        <div className="reg-box">
          <div className="line-seperation"></div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Gym name <span style={{color:'red'}}>*</span></label>
                <input className="form-control" name="name"
                  value={this.props.fields.field1.name.value}
                  placeholder="Airgym fitness club" type="text"
                  onChange={this.handleOnChange} />
                {this.props.fields.field1.name &&
                  this.props.fields.field1.name.errors.length > 0 && (
                    <span className="message" style={{color:'red',paddingTop:'10px'}}>
                      {this.props.fields.field1.name.errors.map(e => (
                        <span key={e}>{e}</span>
                      ))}
                    </span>
                  )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Gym Info <span style={{color:'red'}}>*</span></label>
                <input className="form-control" placeholder="Airgym fitness club" name="gymInfo" value={this.props.fields.field1.gymInfo.value} type="text" onChange={this.handleOnChange} />
                {this.props.fields.field1.gymInfo &&
                  this.props.fields.field1.gymInfo.errors.length > 0 && (
                    <span className="message" style={{color:'red',paddingTop:'10px'}}>
                      {this.props.fields.field1.gymInfo.errors.map(e => (
                        <span key={e}>{e}</span>
                      ))}
                    </span>
                  )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Country <span style={{color:'red'}}>*</span></label>
                <ReactFlagsSelect
                  searchable={true}
                  defaultCountry={this.props.fields.field1.country.value}
                  onSelect={(e) => this.onSelectFlag(e)}
                  className='form-control text-color'
                />
                {this.props.fields.field1.country &&
                  this.props.fields.field1.country.errors.length > 0 && (
                    <span className="message" style={{color:'red',paddingTop:'10px'}}>
                      {this.props.fields.field1.country.errors.map(e => (
                        <span key={e}>{e}</span>
                      ))}
                    </span>
                  )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>City </label>
                <input className="form-control" name="city" value={this.props.fields.field1.address.value.city} placeholder="California" type="text" onChange={this.handleAddressChange} />
              </div>
            </div>
          </div>
          <div className="row">
          <div className="col-md-6">
              <div className="form-group">
                <label>State </label>
                  <RegionDropdown
                      country={this.props.fields.field1.country&&this.props.fields.field1.country.value}
                      value={this.state.region}
                      onChange={(val) => this.selectRegion(val)} 
                      blankOptionLabel="Select a state"
                      classes='form-control text-color'/>
                {/* <input className="form-control" name="state" value={this.props.fields.field1.address.value.state} placeholder="Victoria" type="text" onChange={this.handleAddressChange} /> */}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Address line 1</label>
                <input className="form-control" name="addressLine1" value={this.props.fields.field1.address.value.addressLine1} placeholder="801 Garvey Ave" type="text" onChange={this.handleAddressChange} />
              </div>
            </div>
          </div>
          <div className="row">
          <div className="col-md-6">
              <div className="form-group">
                <label>Address line 2</label>
                <input
                  className="form-control"
                  name="addressLine2"
                  value={this.props.fields.field1.address.value.addressLine2}
                  placeholder="Alhambra CA" type="text"
                  onChange={this.handleAddressChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Zip code</label>
                <input className="form-control" name="zip" value={this.props.fields.field1.address.value.zip} placeholder="91803" type="number" min="0" onChange={this.handleAddressChange} />
              </div>
            </div>            
          </div>
          <div className="row">
          <div className="col-md-6">
              <div className="form-group">
                <label>Landmark</label>
                <input className="form-control" name="landmark" value={this.props.fields.field1.address.value.landmark} placeholder="Near to San Gabriel Valley" type="text" onChange={this.handleAddressChange} />
              </div>
            </div>
              
          <div className="col-md-6">
              <div className="form-group">
                <label>Phone Number <span style={{color:'red'}}>*</span></label>
                <input className="form-control" name="phoneNumber" value={this.props.fields.field1.phoneNumber.value} placeholder="+1805698847" type="number" onChange={this.handleOnChange} />
                {this.props.fields.field1.phoneNumber &&
                  this.props.fields.field1.phoneNumber.errors.length > 0 && (
                    <span className="message" style={{color:'red',paddingTop:'10px'}}>
                      {this.props.fields.field1.phoneNumber.errors.map(e => (
                        <span key={e}>{e}</span>
                      ))}
                    </span>
                  )}
              </div>
            </div>
            </div>
       
          
          <div className="form-group text-center">
            <input className="btn btn-next" value="Next" type="submit" onClick={this.onNext} />
          </div>
        </div>
      </form>
    );
  }
}
export default BasicDetails;
