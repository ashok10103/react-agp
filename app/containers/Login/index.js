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
  submit,
  setRememberMe,
  socialLogin,
  clearSubmit
} from "./actions";
import { getFields, getValid, submitErr, getSubmitting } from "./selectors";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import { getUserClass, getUserState } from "../../utils/helper";
import SocialButton from "./socialButton";
import AuthService from "../../utils/AuthService";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";

const auth = new AuthService();
const isLogged = () => auth.isLogged();
const validations = {
  email: "email",
  password: ["minLength:6"]
};
const notificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: "",
  message: "",
  position: "tc",
  autoDismiss: 5
};
function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keepLoggedIn: false,
      showModal: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showSignupScreen = this.showSignupScreen.bind(this);
    this.showForgotpassword = this.showForgotpassword.bind(this);
    this.loginSubmit = this.loginSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePass = this.validatePass.bind(this);
    this.handleFbLogin = this.handleFbLogin.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleSocialLoginFailure = this.handleSocialLoginFailure.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ showModal: nextProps.showModal });
  }

  handleChange(e, valid) {
    this.props.changeValue(e.target.name, e.target.value.trim());
    if (this.props.fields[e.target.name].errors.length) {
      this.props.validate(e.target.name, valid);
    }
  }

  validateEmail(e) {
    this.props.validate(e.target.name, validations.email);
  }

  validatePass(e) {
    this.props.validate(e.target.name, validations.password);
  }

  handleCheckbox(e) {
    this.props.setRememberMe(e.target.checked);
    this.setState({ keepLoggedIn: e.target.checked });
  }

  hideModal(e) {
    this.forceUpdate();
  }

  showSignupScreen(e) {
    this.props.hideLogin(e);
    this.props.history.push("/");
  }

  showForgotpassword(e) {
    this.props.hideLogin(e);
    this.props.showFp(e);
  }

  loginSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(
      validations,
      this.hideModal,
      "fields",
      this.props.match.params.userType.toUpperCase()
    );
  }

  handleFbLogin(user) {
    const params = {
      loginUserId: user.userID,
      loginToken: user.accessToken,
      loginType: "facebook",
      userType: this.props.match.params.userType.toUpperCase()
    };
    this.props.socialLogin(params);
  }
  handleGoogleLogin(user) {
    const params = {
      loginUserId: user.profileObj.googleId,
      loginToken: user.accessToken,
      loginType: "google",
      userType: this.props.match.params.userType.toUpperCase()
    };
    this.props.socialLogin(params);
  }

  handleSocialLoginFailure(err) {
    console.log(err);
  }

  componentDidMount() {
    const currentState = getUserState();
    if (currentState && isLogged()) {
      this.props.history.push(currentState);
    }
    this.props.clearSubmit()
    const ReactPixel = require("react-facebook-pixel").default;
    ReactPixel.init("189604221656692");
  }
  render() {
    const { onSubmit, fields, match } = this.props;

    return (
      <main className="p-login">
        <div className="c-login">
          <div className="logo-block">
            <img src={`/AirGym-${match.params.userType}-logo.png`} />
          </div>
          <div className="b-login">
            <h3 className="h-login text-center">Login to Continue</h3>
            <form
              className={`cstm_form form-${match.params.userType.toLowerCase()}s`}
              onSubmit={this.loginSubmit}
            >
              <ul className="list-unstyled">
                <li className="form-group clearfix">
                  <span className="input-icon">
                    <i className="fa fa-envelope" aria-hidden="true" />
                  </span>
                  <div
                    className={cx("", {
                      error: fields.email.errors.length > 0
                    })}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      id="email"
                      name="email"
                      value={fields.email.value.toLowerCase()}
                      onChange={e => this.handleChange(e, validations.email)}
                      onBlur={e => this.validateEmail(e)}
                    />
                    {fields.email &&
                      fields.email.errors.length > 0 && (
                        <span className="message">
                          {fields.email.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                        </span>
                      )}
                  </div>
                </li>
                <li className="form-group">
                  <span className="input-icon">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                  <div
                    className={cx("", {
                      error: fields.password.errors.length > 0
                    })}
                  >
                    <input
                      className="form-control"
                      placeholder="Password"
                      type="password"
                      name="password"
                      value={fields.password.value}
                      onChange={e => this.handleChange(e, validations.password)}
                      onBlur={e => this.validatePass(e)}
                    />
                    {fields.password &&
                      fields.password.errors.length > 0 && (
                        <span className="message">
                          {fields.password.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                        </span>
                      )}
                  </div>
                </li>
                <li className="form-group text-center">
                  <Link to={`/user/forgot/${match.params.userType}`} replace>
                    Forgot Password?
                  </Link>
                </li>
                <li className="form-group text-center">
                  <input
                    type="submit"
                    disabled={!fields.email.value || !fields.password.value}
                    className={`btn btn-login btn-${getUserClass(
                      match.params.userType
                    )}`}
                    value="login"
                  />
                </li>
                <li>
                  <ul className="social-logins clearfix list-unstyled">
                    <li>
                      <FacebookLogin
                        appId="1551158421677777"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.handleFbLogin}
                        cssClass="facebook-icon"
                        // icon="fa-facebook"
                        textButton="f"
                      />
                    </li>
                    <li>
                      <GoogleLogin
                        clientId="613404474035-ofc1680t5kvqnsnsdqmo2bgkg4k22dtp.apps.googleusercontent.com"
                        buttonText="g"
                        tag="icon"
                        type="icon"
                        className="google-icon"
                        onSuccess={this.handleGoogleLogin}
                        onFailure={this.handleSocialLoginFailure}
                      />
                    </li>
                  </ul>
                </li>
                <li className="form-group text-center mb-0" style={{padding:'10px'}}>
                  <p className="mb-0 form-note" >
                    Not Registered?{" "}
                    <Link to={`/register/${match.params.userType}`} replace>
                      <span
                        className={`text-${getUserClass(
                          match.params.userType
                        )}`}
                      >
                        Create an account
                      </span>
                    </Link>
                  </p>
                </li>
              </ul>
            </form>
          </div>
        </div>
      </main>
    );
  }
}
function mapDispatchToProps(dispatch, ownProps) {
  return {
    changeValue: (field, value) => {
      const Value = value;
      return dispatch(changeValue(field, Value, "fields"));
    },
    validate: (field, validation) =>
      dispatch(validate(field, validation, "fields")),
    setRememberMe: value => dispatch(setRememberMe(value)),
    onSubmit: (validations, handler, fields, userType) =>
      dispatch(submit(validations, handler, fields, userType)),
    socialLogin: values => dispatch(socialLogin(values)),
    clearSubmit: () => dispatch(clearSubmit())
  };
}

const mapStateToProps = createStructuredSelector({
  fields: getFields(),
  valid: getValid(),
  getError: submitErr(),
  submitting: getSubmitting()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "login", reducer });
const withSaga = injectSaga({ key: "login", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(Login);
