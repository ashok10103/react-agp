import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';
import { changeValue, validate, submit, setRememberMe, socialSignup } from './actions';
import { getFields, getValid, submitErr, getSubmitting } from './selectors';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { getUserClass, getUserState } from '../../utils/helper';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import AuthService from "../../utils/AuthService";



const auth = new AuthService();
const isLogged = () => auth.isLogged();
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
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keepLoggedIn: false,
      allow:false,
      showPassward:true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.registerSubmit = this.registerSubmit.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.handleSocialRegisterFailure = this.handleSocialRegisterFailure.bind(this);
    this.handleGoogleSignup = this.handleGoogleSignup.bind(this);
    this.handleFbSignup = this.handleFbSignup.bind(this);
    this.validatePass = this.validatePass.bind(this);
    this.allowSubmit = this.allowSubmit.bind(this);

  }

  handleChange(e, valid) {
    e.preventDefault();
    this.props.changeValue(e.target.name, e.target.value.trim());
    if (this.props.fields[e.target.name].errors.length > 0 && valid) {
      this.props.validate(e.target.name, valid);
    }
  }

  allowSubmit() {  
    this.setState({allow:!this.state.allow})   
  }
  
  validateFields(e, valid) {
    this.props.validate(e.target.name, valid);
  }

  validatePass(e) {
    this.props.validate(e.target.name, validations.password);
  }

  registerSubmit(e) {
    e.preventDefault();
    this.props.changeValue('userType', this.props.match.params.userType.toUpperCase());
    this.props.onSubmit(validations, 'fields');
  }
  handleFbSignup(user) {
    const params = {
      loginUserId: user.userID,
      loginToken: user.accessToken,
      userType: this.props.match.params.userType.toUpperCase(),
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1],
      emailId: user.email,
      loginType: 'facebook'
    };
    this.props.socialSignup(params);
  }
  handleGoogleSignup(user) {
    const params = {
      loginUserId: user.profileObj.googleId,
      loginToken: user.accessToken,
      userType: this.props.match.params.userType.toUpperCase(),
      firstName: user.profileObj.familyName,
      lastName: user.profileObj.givenName,
      emailId: user.profileObj.email,
      loginType: 'google',
    };
    this.props.socialSignup(params);
  }

  handleSocialRegisterFailure(err) {
    console.log(err)
  }

  showPasswordHandler=()=> {
    var passField = document.getElementById("pass-field");
    if (passField.type === "password") {
      passField.type = "text";
      this.setState({showPassward:!this.state.showPassward})
    } else {
      passField.type = "password";
      this.setState({showPassward:!this.state.showPassward})

    }
}

cpassHandler = () =>{
  var passField = document.getElementById("pass-field")
  var cpassField = document.getElementById("cpass-field")  
  var cpassError = document.getElementById("cpass-error")

  if (passField.value != cpassField.value){
    cpassError.style.display = "block"
      cpassError.innerHTML = "Passwords didn't match"
      // document.getElementById("signup-button").disabled = true  
  }
  else{
    cpassError.style.display = "none"
    // document.getElementById("signup-button").disabled = false
  }
}

  componentDidMount() {
    const currentState = getUserState();
    if (currentState && isLogged()) {
      this.props.history.push(currentState);
    }
  }
  render() {
    const { onSubmit, fields, match } = this.props;
    const{allow}=this.state
    
    return (
      <main className="p-login">
        <div className="c-login">
          <div className="logo-block">
            <img src={`/AirGym-${match.params.userType}-logo.png`} />
          </div>
          <div className="b-login">
            <h3 className="h-login text-center">Create an Account</h3>

            <form className={`cstm_form form-${match.params.userType.toLowerCase()}s`} onSubmit={this.registerSubmit} >
              <ul className="list-unstyled">
                <li className="form-group clearfix">
                  <span className="input-icon">
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </span>
                  <div
                    className={cx('', {
                      error: fields.firstName.errors.length > 0,
                    })}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="First name"
                      name="firstName"
                      value={fields.firstName.value}
                      onChange={e => this.handleChange(e, validations.firstName)}
                      onBlur={e => this.validateFields(e, validations.firstName)}
                    />
                    {fields.firstName &&
                      fields.firstName.errors.length > 0 && (
                        <span className="message">
                          {fields.firstName.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                        </span>
                      )}
                  </div>
                </li>
                <li className="form-group clearfix">
                  <span className="input-icon">
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    name="lastName"
                    value={fields.lastName.value}
                    onChange={e => this.handleChange(e)}
                  />
                </li>
                <li className="form-group clearfix">
                  <span className="input-icon">
                    <i className="fa fa-envelope" aria-hidden="true" />
                  </span>
                  <div
                    className={cx('', {
                      error: fields.emailId.errors.length > 0,
                    })}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      id="email"
                      name="emailId"
                      value={fields.emailId.value.toLowerCase()}
                      onChange={e => this.handleChange(e, validations.emailId)}
                      onBlur={e => this.validateFields(e, validations.emailId)}
                    />
                    {fields.emailId &&
                      fields.emailId.errors.length > 0 && (
                        <span className="message">
                          {fields.emailId.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                        </span>
                      )}
                  </div>
                </li>
                <li className="form-group clearfix">
                  <span className="input-icon">
                    <i className="fa fa-phone" aria-hidden="true"></i>
                  </span>
                  <input
                    type="number" min="0"
                    className="form-control"
                    placeholder="Phone number"
                    name="phoneNumber"
                    value={fields.phoneNumber.value}
                    onChange={e => this.handleChange(e, validations.phoneNumber)}
                    onBlur={e => this.validateFields(e, validations.phoneNumber)}
                  />
                  {fields.phoneNumber &&
                    fields.phoneNumber.errors.length > 0 && (
                      <span className="message">
                        {fields.phoneNumber.errors.map(e => (
                          <span key={e}>{e}</span>
                        ))}
                      </span>
                    )}
                </li>
                <li className="form-group">
                  <span className="input-icon">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                  <div
                    className={cx('field-wrp message-wrp', {
                      error: fields.password.errors.length > 0,
                    })}
                  >
                    <input
                      className="form-control"
                      id="pass-field"
                      placeholder="Password"
                      type="password"
                      name="password"
                      value={fields.password.value}
                      onChange={e => this.handleChange(e, validations.password)}
                      onBlur={e => this.validatePass(e)}
                    />
                    <div onClick={this.showPasswordHandler}>
                    {this.state.showPassward ?
                    <i className="fa fa-eye"
                    style={{position:'absolute',top:'12px',right:'15px'}}
                    />
                    :
                    <i className="fa fa-eye-slash" 
                    style={{position:'absolute',top:'12px',right:'15px'}} 
                    />
                    }  
                    </div>
                    <div>
                    </div> 
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
             
                 <li className="form-group">
                  <span className="input-icon">
                    <i className="fa fa-lock" aria-hidden="true" />
                  </span>
                  <div
                    className={cx('field-wrp message-wrp', {
                      error: fields.password.errors.length > 0,
                    })}
                  >
                    <input
                      className="form-control" 
                      placeholder="Confirm password"
                      id="cpass-field"
                      type="text"
                      name="cpass"                      
                      onChange ={this.cpassHandler}                   
                    />     
                    <p id = "cpass-error"></p>

                  </div>

                </li> 
                <div> 
                <input type="checkbox"
                        className="chcked-sect"
                        checked={this.state.allow ? 'checked' : ''}
												onClick={this.allowSubmit}
										/><span style={{paddingLeft:'20px'}}>I agree to the  <Link to={`/terms_conditions`}>
                    terms and conditions
                    </Link></span>
                    </div>
                <li className="form-group text-center" style={{padding:'20px'}}>
                  <input
                    type="submit"
                    disabled={!fields.emailId.value || !fields.password.value ||this.state.allow!=true}
                    className={`btn btn-login btn-${getUserClass(match.params.userType)}`}
                    value="Sign Up"
                    id="signup-button"
                  />
                </li>
                <li className="form-group text-center">
                  <ul className="social-logins clearfix list-unstyled">
                    <li>
                      <FacebookLogin
                        appId="1551158421677777"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={this.handleFbSignup}
                        cssClass="facebook-icon"
                        // icon="fa-facebook"
                        textButton="f"
                      />
                    </li>
                    <li>
                      <GoogleLogin
                        clientId="613404474035-ofc1680t5kvqnsnsdqmo2bgkg4k22dtp.apps.googleusercontent.com"
                        buttonText="g"
                        tag='icon'
                        type='icon'
                        className='google-icon'
                        onSuccess={this.handleGoogleSignup}
                        onFailure={this.handleSocialRegisterFailure}
                      />
                    </li>
                  </ul>
                </li>
                <li className="form-group text-center mb-0">
                  <p className="mb-0 form-note">
                    Already have an account?{' '}
                    <Link to={`/login/${match.params.userType}`} replace>
                      <span className={`text-${getUserClass(match.params.userType)}`}>
                        Login
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
function mapDispatchToProps(dispatch) {
  return {
    changeValue: (field, value) => {
      const Value = value;
      return dispatch(changeValue(field, Value, 'fields'));
    },
    validate: (field, validation) =>
      dispatch(validate(field, validation, 'fields')),
    setRememberMe: (value) => dispatch(setRememberMe(value)),
    onSubmit: (validations, fields) =>
      dispatch(submit(validations, fields)),
    socialSignup: (fields) =>
      dispatch(socialSignup(fields)),
  };
}
const mapStateToProps = createStructuredSelector({
  fields: getFields(),
  valid: getValid(),
  getError: submitErr(),
  submitting: getSubmitting(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'register', reducer });
const withSaga = injectSaga({ key: 'register', saga });

export default compose(withReducer, withSaga, withConnect)(Register);
