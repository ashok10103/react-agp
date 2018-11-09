import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';
import { changeValue, validate, submit, getSettings } from './actions';
import { getFields, getValid, submitErr, getSubmitting, fetchSettings } from './selectors';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';

const validations = {
  maxMembers: ["empty:Max members"],
  gymType: ["empty:Gym Type"],
  amenities: ["empty:Amenities"],
  gymRules: ["empty:Gym Rules"],
};

class GymRules extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      gymType: [],
      amenities: [],
      gymRules: [],
    };
    this.handleDropDown = this.handleDropDown.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGymType = this.handleGymType.bind(this);
  }
  componentDidMount() {
    this.props.getSettings();
  }
  handleOnChange({ target }) {
    this.props.changeValue(target.name, target.value, 'field3');
    if (validations[target.name]) {
      this.props.validate(target.name, validations[target.name], 'field3')
    }
  }
  handleGymType({ target }) {
     const arrayValues = this.state[target.name];
    if (!arrayValues.includes(target.value)) {
      arrayValues.splice(0, 1, target.value);
      this.setState({ [target.name]: arrayValues });
      this.props.changeValue(target.name, arrayValues, "field3");
      this.props.validate(target.name, validations[target.name], 'field3')
    } else {
      const index = arrayValues.indexOf(target.value);
      if (index !== -1) arrayValues.splice(index, 1);
      this.setState({ [target.name]: arrayValues });
      this.props.changeValue(target.name, arrayValues, 'field3');
      this.props.validate(target.name, validations[target.name], 'field3')
    }
  }
  handleDropDown({ target }) {
    const arrayValues = this.state[target.name];
    if (!arrayValues.includes(target.value)) {
      arrayValues.push(target.value);
      this.setState({ [target.name]: arrayValues });
      this.props.changeValue(target.name, arrayValues, 'field3');
      this.props.validate(target.name, validations[target.name], 'field3')
    } else {
      const index = arrayValues.indexOf(target.value);
      if (index !== -1) arrayValues.splice(index, 1);
      this.setState({ [target.name]: arrayValues });
      this.props.changeValue(target.name, arrayValues, 'field3');
      this.props.validate(target.name, validations[target.name], 'field3')
    }
  }
  handleSubmit(e) {
    e.preventDefault()
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
      location.getCurrentPosition((position) => {
        this.props.onSubmit(validations, "field3", e, position.coords.latitude, position.coords.longitude);
      }, (error) => {
        console.log(error);
      })
    } else {
      console.log('here in no locatin');

    }
  }
  render() {
    const { rules, amenities, gymTypes } = this.props.settings;
    return (
      <form className="registration-section">
        <div className="reg-box">
          <div className="line-seperation"></div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Max members</label>
                <input className="form-control" min="1" value={this.props.fields.field3.maxMembers.value} placeholder="Enter max members count" name="maxMembers" onChange={this.handleOnChange} type="number" />
                {this.props.fields.field3.maxMembers &&
                  this.props.fields.field3.maxMembers.errors.length > 0 && (
                    <span className="message">
                      {this.props.fields.field3.maxMembers.errors.map(e => (
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
                <label>Gym Type</label>
                <div className="row">
                  {gymTypes && gymTypes.map((gymtype) => {
                    return <div className="col-md-6">
                      <label className="containercheck"> {gymtype.gymType}
                        <input type="checkbox"
                          checked={this.props.fields.field3.gymType.value && this.props.fields.field3.gymType.value.includes(gymtype._id) ? 'checked' : ''}
                          className="chcked-sect"
                          value={gymtype._id}
                          name='gymType'
                          onClick={this.handleDropDown}
                        />
                        <span className="checkmark green">
                          <div className="background-white"></div>
                        </span>
                      </label>
                    </div>
                  }
                  )}
                </div>
                {this.props.fields.field3.gymType &&
                  this.props.fields.field3.gymType.errors.length > 0 && (
                    <span className="message">
                      {this.props.fields.field3.gymType.errors.map(e => (
                        <span key={e}>{e}</span>
                      ))}
                    </span>
                  )}
              </div>
            </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Amenities</label>
                  <div className="row">
                    {amenities && amenities.map((amenity) => {
                      return <div className="col-md-6">
                        <label className="containercheck"> {amenity.name}
                          <input type="checkbox"
                            checked={this.props.fields.field3.amenities.value && this.props.fields.field3.amenities.value.includes(amenity._id) ? 'checked' : ''}
                            className="chcked-sect"
                            value={amenity._id}
                            name='amenities'
                            onClick={this.handleDropDown}
                          />                        <span className="checkmark green">
                            <div className="background-white"></div>
                          </span>
                        </label>
                      </div>
                    }
                    )}
                  </div>
                  {this.props.fields.field3.amenities &&
                    this.props.fields.field3.amenities.errors.length > 0 && (
                      <span className="message">
                        {this.props.fields.field3.amenities.errors.map(e => (
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
                <label>Gym Rules</label>
                <div className="row">
                {rules && rules.map((rule) => {
                  return <div className="col-md-6">
                    <label className="containercheck"> {rule.name}
                      <input type="checkbox"
                        checked={this.props.fields.field3.gymRules.value && this.props.fields.field3.gymRules.value.includes(rule._id) ? 'checked' : ''}
                        className="chcked-sect"
                        value={rule._id}
                        name='gymRules'
                        onClick={this.handleDropDown}
                      />
                      <span className="checkmark green">
                        <div className="background-white"></div>
                      </span>
                    </label>
                  </div>
                }
                )}
                </div>
              </div>
              {this.props.fields.field3.gymRules &&
                this.props.fields.field3.gymRules.errors.length > 0 && (
                  <span className="message">
                    {this.props.fields.field3.gymRules.errors.map(e => (
                      <span key={e}>{e}</span>
                    ))}
                  </span>
                )}
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label>Gym Details</label>
                <input className="form-control"
                  placeholder="Description"
                  value={this.props.fields.field3.description.value}
                  name="description" onChange={this.handleOnChange}
                  type="text" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group text-center">
              <input className="btn btn-next" value="Submit" type="submit" onClick={this.handleSubmit} />
            </div>
          </div>
        </div>
      </form>
    );
  }
}
export default GymRules;
