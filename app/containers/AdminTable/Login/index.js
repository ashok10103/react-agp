import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";
import {
  changeValue,
  validate,
  submit
  // clearFPForm
  // , setRememberMe, socialSignup
} from "./actions";
import {
  getFields
  //  getValid,
  // submitErr, getSubmitting
} from "./selectors";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";

const validations = {
  emailId: "email",
  password: ["empty:Password"]
};
const notificationOpts = {
  title: "",
  message: "",
  position: "tc",
  autoDismiss: 5
};
function validateEmail(emailId) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(emailId.toLowerCase());
}

class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailId: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange({ target }) {
    this.props.changeValue(target.name, target.value);

    if (this.props.fields[target.name].errors.length) {
      this.props.validate(target.name, validations[target.name]);
    }
  }

  validateEmail({ target }) {
    return this.props.validate(target.name, validations[target.name]);
  }
  handleSubmit() {
    const emailId = this.props.fields.emailId.value;
    const validEmail = validateEmail(emailId);
    if (validEmail) {
      const emailId = this.props.fields.emailId.value;
      const password = this.props.fields.password.value;
      return this.props.onSubmit(emailId, password);
    } else {
      this.props.validate("emailId", validations.email);
      this.props.validate("password", validations.password);
      return false;
    }
  }

  render() {
    return (
      <main className="adminlogin">
        <div className="c-login">
          <div className="left-content">
            <h1 className="admin-ttl">Admin Login</h1>
          </div>
        </div>
        <div className="adminright">
          <div className="logo-sect">
            <img src="/logo.png" alt="AirGym" />
          </div>
          <form className="form-arealogin">
            <h1 className="admin-ttl-rght">Admin Login</h1>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                type="text"
                autoComplete="off"
                placeholder="Email"
                value="yiyii"
                name="emailId"
                value={this.props.fields.emailId.value.toLowerCase()}
                onChange={this.handleChange}
                onBlur={e => this.validateEmail(e)}
              />
              {this.props.fields.emailId &&
                this.props.fields.emailId.errors.length > 0 && (
                  <span className="message">
                    {this.props.fields.emailId.errors.map(e => (
                      <span key={e}>{e}</span>
                    ))}
                  </span>
                )}
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                autoComplete="off"
                placeholder="password"
                name="password"
                value={this.props.fields.password.value}
                onChange={this.handleChange}
                onBlur={e => this.validateEmail(e)}
              />
              {this.props.fields.password &&
                this.props.fields.password.errors.length > 0 && (
                  <span className="message">
                    {this.props.fields.password.errors.map(e => (
                      <span key={e}>{e}</span>
                    ))}
                  </span>
                )}
            </div>
            <div className="submit-wrp mar-70 loginadminbtn">
              <button
                type="button"
                className="btn btn-submit text-primary"
                disabled={
                  this.props.fields.emailId.value &&
                  this.props.fields.password.value == ""
                }
                onClick={this.handleSubmit}
              >
                Login
              </button>
            </div>
          </form>
          <p className="copyrght">© 2018 All rights reserved</p>
        </div>
      </main>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    changeValue: (field, value) => {
      const Value = value;
      return dispatch(changeValue(field, Value, "fields"));
    },
    validate: (field, validation) =>
      dispatch(validate(field, validation, "fields")),

    onSubmit: (email, password) =>
      dispatch(submit(validations, email, password, "fields"))
  };
}
const mapStateToProps = createStructuredSelector({
  fields: getFields()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "AdminLogin", reducer });
const withSaga = injectSaga({ key: "AdminLogin", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(AdminLogin);
