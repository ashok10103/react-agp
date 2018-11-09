import React, { Component } from "react";
import { Button } from "react-bootstrap";
import DeleteModal from "components/Modal";

let name;
export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editt: this.props.edit
    };
    this.editState = this.editState.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange({ target }) {
    this.props.sendUserData("user", target.name, target.value);
  }
  editState() {
    this.setState({ editt: !this.state.editt });
  }
  render() {
    const { userProfile } = this.props;

    return (
      <div>
        <form action="">
          <h3 className="sc-box-ttl">User Profile</h3>
          <div className="sc-box shadow ad-user-profile">
            <div className="col">
              <span className="user-img">
                <img
                  src={
                    (userProfile && userProfile.profileImageUrl.value) ||
                    "/avatar-default.png"
                  }
                  alt=""
                />
              </span>
            </div>
            <div className="col">
              <h4>First Name</h4>
              {this.props.edit || this.props.editInside ? (
                <div className="form-group">
                  <input
                    id="edit"
                    name="firstName"
                    type="text"
                    className="form-control"
                    value={userProfile && userProfile.firstName.value}
                    placeholder="First name"
                    onChange={this.handleChange}
                  />
                </div>
              ) : (
                <p>
                  {userProfile && userProfile.firstName.value} {"  "}
                </p>
              )}
            </div>
            <div className="col">
              <h4>Last Name</h4>
              {this.props.edit || this.props.editInside ? (
                <div className="form-group">
                  <input
                    id="edit"
                    name="lastName"
                    type="text"
                    className="form-control"
                    value={userProfile && userProfile.lastName.value}
                    placeholder="Last name"
                    onChange={this.handleChange}
                  />
                </div>
              ) : (
                <p>
                  {userProfile &&
                    userProfile.lastName &&
                    userProfile.lastName.value}{" "}
                </p>
              )}
            </div>
            <div className="col">
              <h4>Email</h4>
              <p>{userProfile && userProfile.emailId.value}</p>
            </div>
            <div className="col">
              <h4>Phone No</h4>

              {this.props.edit || this.props.editInside ? (
                <div className="form-group">
                  <input
                    type="text"
                    name="phoneNumber"
                    className="form-control"
                    value={userProfile && userProfile.phoneNumber.value}
                    onChange={this.handleChange}
                    placeholder="Phone number"
                  />
                </div>
              ) : (
                <p>{(userProfile && userProfile.phoneNumber.value) || "Nil"}</p>
              )}
            </div>
            <div className="col opt-col">
              <a className="edit">
                <i
                  onClick={() => this.props.editt("editttUser")}
                  className="fa fa-edit"
                />
              </a>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
