import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";
import { changeValue, validate, submit, clearFPForm } from "./actions";
import { getFields } from "./selectors";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";

const validations = {
  email: "email"
};
const notificationOpts = {
  title: "",
  message: "",
  position: "tc",
  autoDismiss: 5
};
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

class AddUsername extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reset = this.reset.bind(this);
  }
  handleChange({ target }) {
    this.props.changeValue(target.name, target.value);

    if (this.props.fields[target.name].errors.length) {
      this.props.validate(target.name, validations[target.name]);
    }
  }

  reset(e) {
    return this.props.clearFormFields();
  }

  handleSubmit() {
    return this.reset();
  }

  validateEmail({ target }) {
    return this.props.validate(target.name, validations[target.name]);
  }
  forgetPass() {
    const email = this.props.fields.email.value;
    const validEmail = validateEmail(email);
    if (validEmail) {
      const value = this.props.fields.email.value;
      return this.props.onSubmit(
        validations,
        value,
        this.props.match.params.userType.toUpperCase()
      );
    } else {
      this.props.validate("email", validations.email);
      return false;
    }
  }

  render() {
    const { fields } = this.props;
    return (
      <div className="contentarea content-registraion">
        <div className="container">
          <div className="registraion-process">
            <h3 className="reg-ttl">Forgot password?</h3>
          </div>
          <form className="registration-section">
            <div className="reg-box">
              <div className="line-seperation" />
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="lbl">Enter the email address associated with your Airgym account</label>
                    <div className={cx("form-group message-wrp")}>
                      <input
                        type="text"
                        className="form-control"
                        autoComplete="off"
                        placeholder="Email"
                        name="email"
                        value={this.props.fields.email.value.toLowerCase()}
                        onChange={this.handleChange}
                        onBlur={e => this.validateEmail(e)}
                      />
                      {this.props.fields.email &&
                        this.props.fields.email.errors.length > 0 && (
                          <span className="message"  style={{color:'red',paddingTop:'10px'}}>
                            {this.props.fields.email.errors.map(e => (
                              <span key={e}>{e}</span>
                            ))}
                          </span>
                        )}
                    </div>
                    <div className="submit-wrp">
                      <button
                        type="button"
                        className="btn btn-signinwdth btn-primary"
                        disabled={fields.email.value == ""}
                        onClick={this.forgetPass}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
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

    onSubmit: (validations, value, userType) =>
      dispatch(submit(validations, value, userType, "fields")),
    clearFormFields: () => dispatch(clearFPForm())
  };
}
const mapStateToProps = createStructuredSelector({
  fields: getFields()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "AddUsername", reducer });
const withSaga = injectSaga({ key: "AddUsername", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(AddUsername);
