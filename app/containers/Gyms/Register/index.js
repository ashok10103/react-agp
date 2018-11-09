import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';
import { changeValue, validate, submit, getSettings } from './actions';
import { getFields, getValid, submitErr, getSubmitting, getLevels, fetchSettings } from './selectors';
import injectReducer from 'utils/injectReducer';
import { weekDays, setUserState } from 'utils/helper';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import BasicDetails from './basicDetails'
import GymRules from './gymRules'
import PaymentOptions from './paymentOptions';


const validations = {
  emailId: 'email',
  password: ['minLength:6'],
  phoneNumber: ['empty:Phone number'],
  firstName: ['empty:First Name'],
};
const notificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: '',
  message: '',
  position: 'tc',
  autoDismiss: 5
};
class gymRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keepLoggedIn: false,
    };
  }
  componentDidMount() {
    this.props.getSettings();
    setUserState('/gyms/register')
  }
  render() {
    const { onSubmit, fields, match, level } = this.props;

    return (
      <div className="contentarea content-registraion">
        <div className="container">
          <div className="registraion-process">
            <h3 className="reg-ttl">GYM REGISTRATION</h3>
            <ul className="progresssect">
              <li className={cx('', {
                active: level > 0,
              })}>
                <span className="step-no">1</span>
              </li>
              <li className={cx('', {
                active: level > 1,
              })}>
                <span className="step-no">2</span>
              </li>
              <li className={cx('', {
                active: level > 2,
              })}>
                <span className="step-no">3</span>
              </li>
            </ul>
          </div>
          {
            level == 1 ?
              <BasicDetails
                onSubmit={this.props.onSubmit}
                changeValue={this.props.changeValue}
                validate={this.props.validate}
                fields={this.props.fields}
                valid={this.props.valid}
                getError={this.props.getError}
                submitting={this.props.submitting}
                level={this.props.level}
                settings={this.props.settings}
              /> : ''
          }
          {
            level == 2 ?
              <PaymentOptions
                onSubmit={this.props.onSubmit}
                changeValue={this.props.changeValue}
                validate={this.props.validate}
                fields={this.props.fields}
                valid={this.props.valid}
                getError={this.props.getError}
                submitting={this.props.submitting}
                level={this.props.level}
                settings={this.props.settings}
              /> : ''
          }
          {
            level == 3 ?
              <GymRules
                onSubmit={this.props.onSubmit}
                changeValue={this.props.changeValue}
                validate={this.props.validate}
                fields={this.props.fields}
                valid={this.props.valid}
                getError={this.props.getError}
                submitting={this.props.submitting}
                level={this.props.level}
                settings={this.props.settings}
                getSettings = {this.props.getSettings}
              /> : ''
          }
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    changeValue: (field, value, module) => {
      const Value = value;
      return dispatch(changeValue(field, Value, module));
    },
    validate: (field, validation, module) =>
      dispatch(validate(field, validation, module)),
    setRememberMe: (value) => dispatch(setRememberMe(value)),
    onSubmit: (validations, fields, e, lat, lon) => {
      e.preventDefault();
      return dispatch(submit(validations, fields, lat, lon));
    },
    socialSignup: (fields) =>
      dispatch(socialSignup(fields)),
    getSettings: () => dispatch(getSettings()),
  };
}
const mapStateToProps = createStructuredSelector({
  fields: getFields(),
  getError: submitErr(),
  submitting: getSubmitting(),
  level: getLevels(),
  settings: fetchSettings(),
  valid: getValid(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'GymRegister', reducer });
const withSaga = injectSaga({ key: 'GymRegister', saga });

export default compose(withReducer, withSaga, withConnect)(gymRegister);
