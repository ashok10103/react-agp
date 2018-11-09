

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
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';


const validations = {
  guestAccessType: ["empty:Gym access Type"],
  cost: ["empty:Cost"],
  currency: ["empty:Currency"],
  paymentType: ["empty:Payment Type"],
};
const currencyOptions = [
  { value: 'USD', label: 'United States Dollars' },
  { value: 'EUR', label: 'Euro' },
  { value: 'GBP', label: 'British Pound' },

]
class PaymentOptions extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paymentType: [],
      guestAccessType: [],
    };
    this.handleDropDown = this.handleDropDown.bind(this);
    this.handleDropDownPayment = this.handleDropDownPayment.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleCurrencyOnChange = this.handleCurrencyOnChange.bind(this);
    this.onNext = this.onNext.bind(this);
  }

  componentDidMount() {
    // this.props.getSettings();
  }
  handleOnChange({ target }) {
    this.props.changeValue(target.name, target.value, "field2");
    this.props.validate(target.name, validations[target.name], 'field2')
  }
  handleCurrencyOnChange({ value }) {
    this.props.changeValue('currency', value, "field2");
    this.props.validate('currency', validations['currency'], 'field2')
  }
  onNext(e) {
    // this.props.moveToNext('level', 3);
    this.props.onSubmit(validations, "field2", e);
  }
  handleDropDown({ target }) {
    const arrayValues = this.state[target.name];
    if (!arrayValues.includes(target.value)) {
      arrayValues.push(target.value);
      this.setState({ [target.name]: arrayValues });
      this.props.changeValue(target.name, arrayValues, "field2");
      this.props.validate(target.name, validations[target.name], 'field2')
    } else {
      const index = arrayValues.indexOf(target.value);
      if (index !== -1) arrayValues.splice(index, 1);
      this.setState({ [target.name]: arrayValues });
      this.props.changeValue(target.name, arrayValues, "field2");
      this.props.validate(target.name, validations[target.name], 'field2')
    }
  }
  getCurrentCurrency() {
    return this.props.fields.field2.currency && this.props.fields.field2.currency.value &&
      this.props.fields.field2.currency.value.length
      ? this.props.fields.field2.currency.value :
      null
    // currencyOptions.find(()=>   this.props.fields.field2.currency.value )

  }

  handleDropDownPayment({ target }) {
    const arrayValues = this.state[target.name];
    if (!arrayValues.includes(target.value)) {
      arrayValues.splice(0, 1, target.value);
      this.setState({ [target.name]: arrayValues });
      this.props.changeValue(target.name, arrayValues, "field2");
      this.props.validate(target.name, validations[target.name], 'field2')
    } else {
      const index = arrayValues.indexOf(target.value);
      if (index !== -1) arrayValues.splice(index, 1);
      this.setState({ [target.name]: arrayValues });
      this.props.changeValue(target.name, arrayValues, "field2");
      this.props.validate(target.name, validations[target.name], 'field2')
    }
  }

  render() {
    const { paymentsTypes, gymAccessTypes } = this.props.settings;

    return (
      <form className="registration-section" action="gym-registration-step3.html">
        <div className="reg-box">
          <div className="line-seperation"></div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Rate per hour</label>
                <input className="form-control"
                  value={this.props.fields.field2.cost.value}
                  placeholder="Enter your rate per hour"
                  name="cost" type="number"
                  min="1"
                  onChange={this.handleOnChange}
                />
                {this.props.fields.field2.cost &&
                  this.props.fields.field2.cost.errors.length > 0 && (
                    <span className="message">
                      {this.props.fields.field2.cost.errors.map(e => (
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
                <label> Currency</label>
                <Dropdown
                  options={currencyOptions}
                  placeholder="Select an option"
                  value={this.getCurrentCurrency()}
                  onChange={this.handleCurrencyOnChange}
                  
                />
                {this.props.fields.field2.currency &&
                  this.props.fields.field2.currency.errors.length > 0 && (
                    <span className="message">
                      {this.props.fields.field2.currency.errors.map(e => (
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
                <label>Payment Options</label>
                <div className="row">
                  {paymentsTypes && paymentsTypes.map((paymentType) => {
                    return <div className="col-sm-4">
                      <label className="containercheck"> {paymentType.method}
                        <input type="checkbox"
                          checked={this.props.fields.field2.paymentType.value && this.props.fields.field2.paymentType.value.includes(paymentType._id) ? 'checked' : ''}
                          className="chcked-sect"
                          value={paymentType._id}
                          name='paymentType'
                          onClick={this.handleDropDownPayment}
                        />
                        <span className="checkmark green">
                          <div className="background-white"></div>
                        </span>
                      </label>
                    </div>
                  }
                  )}

                </div>
                {this.props.fields.field2.paymentType &&
                  this.props.fields.field2.paymentType.errors.length > 0 && (
                    <span className="message">
                      {this.props.fields.field2.paymentType.errors.map(e => (
                        <span key={e}>{e}</span>
                      ))}
                    </span>
                  )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Gym access</label>
                <div className="row">
                  {gymAccessTypes && gymAccessTypes.map((gymAccessType) => {
                    return <div className="col-sm-4">
                      <label className="containercheck"> {gymAccessType.name}
                        <input type="checkbox"
                          checked={this.props.fields.field2.guestAccessType.value && this.props.fields.field2.guestAccessType.value.includes(gymAccessType._id) ? 'checked' : ''}
                          className="chcked-sect"
                          value={gymAccessType._id}
                          name='guestAccessType'
                          onClick={this.handleDropDown}
                        />                        <span className="checkmark green">
                          <div className="background-white"></div>
                        </span>
                      </label>
                    </div>
                  }
                  )}
                </div>
                {this.props.fields.field2.guestAccessType &&
                  this.props.fields.field2.guestAccessType.errors.length > 0 && (
                    <span className="message">
                      {this.props.fields.field2.guestAccessType.errors.map(e => (
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
export default PaymentOptions;
