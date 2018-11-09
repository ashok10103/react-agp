import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import Loader from 'halogen/ClipLoader';
import cx from 'classnames';
import { createStructuredSelector } from 'reselect';
import { getForgetFields, getValid, getSubmitting } from './selectors';
import { changeValue, validate, submit, clearFPForm } from './actions';

const validations = {
  email: 'email',
};

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      email: false,
    };
    this.hideModal = this.hideModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.back = this.back.bind(this);
    this.showSignupScreen = this.showSignupScreen.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.forgetPass = this.forgetPass.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({ showModal: nextProps.showModal });
  }

  closeModal(e){
    this.reset(e);    
  }

  hideModal(e){
    this.props.openRp(e);
    this.reset();
  }

  back(e){
    this.props.back(e);
    this.reset();
  }

  reset(e) {
    // this.setState({email: false});
    this.props.clearFormFields();
    this.props.hideFp(e);
  }

  showSignupScreen(e){
    this.props.hideFp(e);
    this.props.history.push('/');
  }

  handleInput(e, valid) {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    // this.setState({ [name]: value });
    this.props.changeValue(e.target.name, e.target.value);
    if (this.props.fields.email.errors.length) {
      this.props.validate(e.target.name, valid);
    }
  }

  validateEmail(e){
    this.props.validate(e.target.name, validations.email);
  }

  handleSubmit() {
    this.reset();
    this.hideModal();    
  }

  forgetPass(){
    if(validateEmail(this.state.email)){
      this.props.onSubmit(this.handleSubmit);
    }else{
      this.props.validate('email', validations.email);
      return false;
    }    
  }

  render() {
    const { onSubmit, fields, valid, submitting } = this.props;
    
    return (
      <Modal show={this.state.showModal} className="modal addPerson in fade vm">
        <div className="modal-header">
            <div className="left-back">
              <a onClick={(e) => this.back(e)}><i className="sprite-slick-prev-left"></i></a>
            </div>
            <button type="button" className="close" onClick={(e) => this.closeModal(e)}><i className="sprite-icon-close"></i></button>
            <h3 className="modal-title text-center font-medium">Forgot password?</h3>
        </div>
        <div className="modal-body">
            <div className="box-signupnext">
                {/* <form  className="cstm_form register-form b_0" onSubmit={false}> */}
                    <div className="forgot-pswdsect">
                        <div className="row">
                          <div className="col-md-12">
                            <label className="lbl">Your email</label>
                            <div className={cx("form-group message-wrp", { error: this.props.fields.email.errors.length > 0 })}>
                              <input
                                type="text"
                                className="form-control"
                                autoComplete="off"
                                placeholder="your email"
                                value={fields.email.value}
                                name="email"
                                onChange={(e) => this.handleInput(e, validations.email)}
                                onBlur={(e) => this.validateEmail(e)}
                              />
                              {this.props.fields.email && this.props.fields.email.errors.length > 0 && <span className="message">
                              {this.props.fields.email.errors.map((e) => <span key={e}>{e}</span>)}
                              </span>}
                            </div>
                          </div>
                        </div>

                        <div className="submit-wrp">
                            <button
                              type="button"
                              className="btn btn-signinwdth btn-primary"
                              disabled={fields.email.value == ''}
                              onClick={this.forgetPass}
                            >Reset Password { submitting && <Loader className="loader-button" color="#FFFFFF" size="20px" margin="4px" /> }
                            </button>
                            
                        </div>
                    </div>
                    <div className="account-exist">Don’t have an account? <a href="" onClick={(e)=>this.showSignupScreen(e)}>Sign up</a></div>
                {/* </form> */}
            </div>
        </div>
      </Modal>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {

    changeValue: (field, value) => {
      const Value = value;
      return dispatch(changeValue(field, Value, 'forgetPassword'));
    },
    validate: (field, validation) => dispatch(validate(field, validation, 'forgetPassword')),
    clearFormFields: ()=> { return dispatch(clearFPForm())},
    onSubmit: (handler) => dispatch(submit(validations, handler, 'forgetPassword')),
  };
}

const mapStateToProps = createStructuredSelector({
  fields: getForgetFields(),
  valid: getValid(),
  submitting: getSubmitting(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);
export default compose(
  withConnect,
)(ForgotPassword);
