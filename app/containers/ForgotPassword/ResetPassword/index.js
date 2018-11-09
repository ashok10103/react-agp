import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";
import { changeValue, validate, submit } from "./actions";
// import { getFields, getValid, submitErr, getSubmitting } from './selectors';
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import { getUserClass } from "../../../utils/helper";
import { getFields, getValid } from "./selectors";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {}

  componentWillUnmount() {
    localStorage.removeItem("code");
    localStorage.removeItem("trackerId");
  }

  validations = {
    password: ["required", "minLength:6"],
    cpassword: [
      "required",
      "minLength:6",
      `isMatchPassword: ${this.props.fields.password.value}`
    ]
  };

  handleBlur(e) {
    if (e.target.name === "cpassword") {
      this.props.validate(e.target.name, [
        "required",
        "minLength:6",
        `isMatchPassword: ${this.props.fields.password.value}`
      ]);
    } else {
      this.props.validate(e.target.name, this.validations[e.target.name]);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.validations, this.props.match.params.token);
  }

  handleChange(e, valid) {
    e.preventDefault();
    this.props.changeValue(e.target.name, e.target.value);

    if (e.target.name === "password") {
      if (this.props.fields["cpassword"].value !== "") {
        this.props.validate("cpassword", [
          "required",
          "minLength:6",
          `isMatchPassword: ${e.target.value}`
        ]);
      }
      this.props.validate("password", this.validations["password"]);
    } else if (e.target.name === "cpassword") {
      this.props.validate("cpassword", [
        "required",
        "minLength:6",
        `isMatchPassword: ${this.props.fields.password.value}`
      ]);
      this.props.validate("password", this.validations["password"]);
    }
  }

  render() {
    const { fields, valid } = this.props;

    return (
      <div className="contentarea content-registraion">
        <div className="container">
          <div className="registraion-process">
            <h3 className="reg-ttl">Password reset!</h3>
          </div>

          <form className="registration-section">
            <div className="reg-box">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="lbl">Enter new password</label>
                    <div className={cx("form-group message-wrp")}>
                      <input
                        id="password"
                        name="password"
                        className="form-control"
                        required
                        type="password"
                        placeholder="eg. X8df!90EO"
                        value={fields.password.value}
                        onChange={e =>
                          this.handleChange(e, this.validations.password)
                        }
                        onBlur={this.handleBlur}
                      />
                      {fields.password &&
                        fields.password.errors && (
                          <span className="field-error">
                            {fields.password.errors.map(e => (
                              <span key={e}>{e}</span>
                            ))}
                          </span>
                        )}
                    </div>

                    <label className="lbl">Confirm password</label>
                    <div className={cx("form-group message-wrp")}>
                      <input
                        id="cpassword"
                        name="cpassword"
                        className="form-control"
                        required
                        type="password"
                        placeholder="eg. X8df!90EO"
                        value={fields.cpassword.value}
                        onChange={e =>
                          this.handleChange(e, this.validations.cpassword)
                        }
                        onBlur={this.handleBlur}
                      />
                      {fields.cpassword &&
                        fields.cpassword.errors && (
                          <span className="field-error">
                            {fields.cpassword.errors.map(e => (
                              <span key={e}>{e}</span>
                            ))}
                          </span>
                        )}
                    </div>

                    <div className="submit-wrp">
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={!valid}
                        onClick={this.handleSubmit}
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
    onSubmit: (validations, token) => dispatch(submit(validations, token)),
    changeValue: (event, value) => dispatch(changeValue(event, value)),
    validate: (field, validation) => {
      dispatch(validate(field, validation));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  fields: getFields(),
  valid: getValid()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "ResetPassword", reducer });
const withSaga = injectSaga({ key: "ResetPassword", saga });

export default compose(
  withConnect,
  withReducer,
  withSaga
)(ResetPassword);
