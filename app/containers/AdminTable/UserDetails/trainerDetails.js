import React, { Component } from "react";
import { Button } from "react-bootstrap";
import DeleteModal from "components/Modal";

let name;
export default class TrainerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editt: this.props.edit
    };
    this.editState = this.editState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleDropDown = this.handleDropDown.bind(this);
  }
  handleDropDown({ target }) {
    const arrayValues = this.props.trainerProfile[target.name].value;
    if (!arrayValues.includes(target.value)) {
      arrayValues.push(target.value);
      this.props.sendUserData("trainer", target.name, arrayValues);
    } else {
      const index = arrayValues.indexOf(target.value);
      if (index !== -1) arrayValues.splice(index, 1);

      this.props.sendUserData("trainer", target.name, arrayValues);
    }
  }
  handleChange({ target }) {
    this.props.sendUserData("trainer", target.name, target.value);
  }
  handlePhoneChange({ target }) {
    this.props.sendUserData("user", target.name, target.value);
  }
  editState() {
    this.setState({ editt: !this.state.editt });
  }
  render() {
    const { trainerProfile, userProfile, trainerSettings } = this.props;
    const trainer_types = trainerSettings && trainerSettings.trainer_types;
    const certificates = trainerSettings && trainerSettings.certificates;

    return (
      <div>
        {this.props.display && this.props.display ? (
          <form action="">
            <h3 className="sc-box-ttl">Trainer Profile</h3>
            <div className="sc-box shadow">
              <div className="gym-profile">
                <div className="col img-wrp">
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
                <div className="col dtl-wrp">
                  <h3>{userProfile && userProfile.name.value.toUpperCase()}</h3>

                  {trainer_types &&
                    trainer_types.map(t => {
                      return (
                        <p className="text-primary">
                          {trainerProfile &&
                          trainerProfile.trainerType.value.includes(t._id)
                            ? t.trainerType
                            : ""}
                        </p>
                      );
                    })}

                  <p>
                    {" "}
                    {trainerProfile &&
                      trainerProfile.address.value.addressLine1}{" "}
                    {"  "}{" "}
                    {trainerProfile &&
                      trainerProfile.address.value.addressLine2}{" "}
                    {"  "}
                    {trainerProfile && trainerProfile.address.value.city} {"  "}{" "}
                    {trainerProfile && trainerProfile.address.value.state}
                  </p>
                  <p>{trainerProfile && trainerProfile.trainerInfo.value}</p>

                  <div className="col opt-col">
                    <a className="edit">
                      <i
                        onClick={() => this.props.editt("editttTrainer")}
                        className="fa fa-edit"
                      />
                    </a>
                  </div>
                </div>
              </div>
              <div className="ad-user-profile gym-dtls row">
                <div className="col col-md-3">
                  <h4>Email</h4>
                  <p>{userProfile && userProfile.emailId.value}</p>
                </div>
                <div className="col  col-md-3">
                  <h4>Phone Number</h4>

                  {this.props.edit || this.props.editInside ? (
                    <div className="form-group">
                      <input
                        type="text"
                        name="phoneNumber"
                        className="form-control"
                        onChange={this.handlePhoneChange}
                        value={userProfile && userProfile.phoneNumber.value}
                        placeholder="Phone Number"
                      />
                    </div>
                  ) : (
                    <p>
                      {(userProfile && userProfile.phoneNumber.value) || "Nil"}
                    </p>
                  )}
                </div>

                <div className="col col-md-3">
                  <h4>Trainer Info</h4>
                  {this.props.edit || this.props.editInside ? (
                    <div className="form-group">
                      <input
                        type="text"
                        name="trainerInfo"
                        className="form-control"
                        onChange={this.handleChange}
                        value={
                          trainerProfile && trainerProfile.trainerInfo.value
                        }
                        placeholder="Trainer Info"
                      />
                    </div>
                  ) : (
                    <p>{trainerProfile && trainerProfile.trainerInfo.value}</p>
                  )}
                </div>
              </div>
              <div className="ad-user-profile gym-dtls row">
                <div className="col  col-md-6">
                  <h4>Trainer Type</h4>
                  {this.props.edit || this.props.editInside ? (
                    <div className="form-group">
                      {trainer_types &&
                        trainer_types.map(trainer_type => {
                          return (
                            <div key={trainer_type._id}>
                              <label className="containercheck">
                                {" "}
                                {trainer_type.trainerType}
                                <input
                                  type="checkbox"
                                  checked={
                                    trainerProfile &&
                                    trainerProfile.trainerType.value.includes(
                                      trainer_type._id
                                    )
                                      ? "checked"
                                      : ""
                                  }
                                  className="chcked-sect"
                                  value={trainer_type._id}
                                  name="trainerType"
                                  onClick={this.handleDropDown}
                                />
                                <span className="checkmark blue">
                                  <div className="background-white" />
                                </span>
                              </label>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    trainer_types &&
                    trainer_types.map(t => {
                      return (
                        <p>
                          {" "}
                          {trainerProfile &&
                          trainerProfile.trainerType.value.includes(t._id)
                            ? t.trainerType
                            : ""}
                        </p>
                      );
                    })
                  )}
                </div>
                <div className="col  col-md-6">
                  <h4>Certifications</h4>
                  {this.props.edit || this.props.editInside ? (
                    <div className="form-group">
                      {certificates &&
                        certificates.map(certificate => {
                          return (
                            <div key={certificate._id}>
                              <label className="containercheck">
                                {" "}
                                {certificate.name}
                                <input
                                  type="checkbox"
                                  checked={
                                    trainerProfile &&
                                    trainerProfile.certificates.value.includes(
                                      certificate._id
                                    )
                                      ? "checked"
                                      : ""
                                  }
                                  className="chcked-sect"
                                  value={certificate._id}
                                  name="certificates"
                                  onClick={this.handleDropDown}
                                />
                                <span className="checkmark blue">
                                  <div className="background-white" />
                                </span>
                              </label>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    certificates &&
                    certificates.map(t => {
                      return (
                        <p>
                          {" "}
                          {trainerProfile &&
                          trainerProfile.certificates.value.includes(t._id)
                            ? t.name
                            : ""}
                        </p>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </form>
        ) : (
          ""
        )}
      </div>
    );
  }
}
