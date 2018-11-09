import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";
import { updateUser, validate, changeValue, getUserData } from "./actions";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import { getFieldsEdit } from "./selectors";

import {
  getUserclassName,
  setUserState,
  getUserType,
  getUserClass
} from "../../utils/helper";
import FacebookLogin from "react-facebook-login";
import { GoogleLogin } from "react-google-login";

const userType = getUserType();

const validations = {
  emailId: "email",
  password: ["Min Length:6"],
  phoneNumber: ["empty:Phone number"],
  firstName: ["empty:First Name"]
};
const notificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: "",
  message: "",
  position: "tc",
  autoDismiss: 5
};
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      readOnly: true,
      preview: null,
      file: ""
    };
    this.updateUser = this.updateUser.bind(this);
    this.makeEdit = this.makeEdit.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.changeValueLast = this.changeValueLast.bind(this);
  }
  componentDidMount() {
    const user = this.props.user;
    this.props.getUserData(this.props.user._id);
    this.setState({ user });
  }
  updateUser() {
    this.props.updateUser(
      this.state.user,
      this.props.user._id,
      this.state.file,
      this.props.toggleModal,
      validations
    );
  }
  changeValueLast(e) {
    e.preventDefault();
    const user = this.state.user;
    user[e.target.name] = e.target.value.trim();
    this.setState({ user });
    this.props.changeValue(e.target.name, e.target.value);
  }

  changeValue(e) {
    e.preventDefault();
    const user = this.state.user;
    user[e.target.name] = e.target.value.trim();
    this.setState({ user });
    this.props.changeValue(e.target.name, e.target.value);
    this.props.validate(e.target.name, validations[e.target.name]);
  }
  makeEdit() {
    this.setState({ readOnly: false });
  }
  handleImageUpload(e) {
    e.preventDefault();
    if (
      e.target.files[0].type === "image/jpeg" ||
      e.target.files[0].type === "image/png"
    ) {
      this.setState({ fileFormat: false });
      const reader = new FileReader();
      const imageFile = e.target.files[0];
      // this.props.onChange(e.target.name, imageFile);
      reader.onloadend = () => {
        this.setState({ preview: reader.result, file: imageFile });
        const fileType = [
          {
            fileName: imageFile.name,
            fileType: imageFile.type
          }
        ];
      };
      reader.readAsDataURL(imageFile);
      // if (e.target.name === 'baseImage') {
      // 	this.props.onValidate(e.target.name, validations[e.target.name]);
      // }
    } else {
      this.setState({ preview: "" });
    }
  }
  render() {
    const { showProfile, toggleModal, edit } = this.props;
    const { user, editable } = this.state;
    const profileImgStyle = {
      width:'90px',
      height:'90px',
      borderRadius:'50%',
      margin:0,
      backgroundSize:'cover',
      objectFit: 'cover',
      objectPosition: 'center left',
      transform:'rotate(90deg)'
    }
    return (
      <Modal
        show={showProfile}
        className="modal fade editProfile"
        id="editProfile"
      >
        <div
          className={cx("modal-header", {
            "gradient-gym": user.userType == "OWNER",
            "gradient-member": user.userType == "MEMBER",
            "gradient-trainer": user.userType == "TRAINER"
          })}
        >
          <button type="button" className="close" onClick={toggleModal} >
            &times;
          </button>
          <h4 className="modal-title">&nbsp;</h4>
        </div>
        <div className="modal-body">
          <div className="user-img">
            {this.state.preview ? 
              <img src={this.state.preview} alt="" style={profileImgStyle} />
             : user.profileImageUrl ?
              <img src={user.profileImageUrl } alt="" style={profileImgStyle}/>
            : <img src="/avatar-default.png" alt="" />}
            {!this.state.readOnly ? (
              <span
                href="javascript:void(0);"
                className="edit-photo "
                title="Change Photo"
              >
                <span>+</span>
                <input
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  onChange={e => this.handleImageUpload(e)}
                />
              </span>
            ) : (
              ""
            )}
          </div>
          <form className="cstm_form">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="First Name"> First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={edit.firstName.value}
                    readOnly={this.state.readOnly}
                    onChange={this.changeValue}
                  />
                  {edit.firstName &&
                    edit.firstName.errors.length > 0 && (
                      <span className="message">
                        {edit.firstName.errors &&
                          edit.firstName.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                      </span>
                    )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={edit.lastName.value}
                    readOnly={this.state.readOnly}
                    onChange={this.changeValueLast}
                  />
                  {edit.lastName &&
                    edit.lastName.errors.length > 0 && (
                      <span className="message">
                        {edit.lastName.errors &&
                          edit.lastName.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                      </span>
                    )}
                </div>
              </div>
            </div>
            <div className="form-group">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="emailId"
                    value={edit.emailId.value}
                    readOnly={this.state.readOnly}
                    onChange={this.changeValue}
                  />
                  {edit.emailId &&
                    edit.emailId.errors.length > 0 && (
                      <span className="message">
                        {edit.emailId.errors &&
                          edit.emailId.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                      </span>
                    )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phoneNumber"
                    value={edit.phoneNumber.value}
                    readOnly={this.state.readOnly}
                    onChange={this.changeValue}
                  />
                  {edit.phoneNumber &&
                    edit.phoneNumber.errors.length > 0 && (
                      <span className="message">
                        {edit.phoneNumber.errors &&
                          edit.phoneNumber.errors.map(e => (
                            <span key={e}>{e}</span>
                          ))}
                      </span>
                    )}
                </div>
              </div>
            </div>
            {user &&
              user.userType !== "OWNER" && (
                <div className="form-group">
                  <label htmlFor="">Credits</label>
                  <input
                    type="text"
                    className="form-control"
                    name="Credits"
                    value={edit.credits.value}
                    readOnly={true}
                    // onChange={this.changeValue}
                  />
                </div>
              )}

            <div className="submit-wrp">
              <input
                type="submit"
                className="btn btn-primary btn-submit hide"
                value="Update"
                id="update"
              />
              {this.state.readOnly ? (
                <button
                  type="button"
                  className={`btn btn-${getUserClass(
                    user && user.userType ? user.userType.toLowerCase() : ""
                  )} btn-submit`}
                  id="edit"
                  onClick={this.makeEdit}
                >
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-submit"
                  id="edit"
                  onClick={this.updateUser}
                >
                  Update
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    updateUser: (user, id, file, handler, validations) =>
      dispatch(updateUser(user, id, file, handler, validations)),
    getUserData: id => dispatch(getUserData(id)),
    validate: (field, validation) => dispatch(validate(field, validation)),
    changeValue: (field, value) => {
      return dispatch(changeValue(field, value));
    }
  };
}
const mapStateToProps = createStructuredSelector({
  edit: getFieldsEdit()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "EditProfile", reducer });
const withSaga = injectSaga({ key: "EditProfile", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(EditProfile);
