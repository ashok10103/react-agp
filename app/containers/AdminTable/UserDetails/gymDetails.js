import React, { Component } from "react";
import { Button } from "react-bootstrap";
import DeleteModal from "components/Modal";
import StarRatings from "react-star-ratings";

export default class GymDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editt: this.props.edit
    };
    this.editState = this.editState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleDropDownSingle = this.handleDropDownSingle.bind(this);
    this.handleDropDown = this.handleDropDown.bind(this);
  }
  handleChange({ target }) {
    this.props.sendUserData("gym", target.name, target.value);
  }
  handlePhoneChange({ target }) {
    this.props.sendUserData("user", target.name, target.value);
  }
  editState() {
    this.setState({ editt: !this.state.editt });
  }

  handleDropDownSingle({ target }) {
    const arrayValues = this.props.gymProfile.payment.value;
    if (!arrayValues.includes(target.value)) {
      arrayValues.splice(0, 1, target.value);
      this.setState({ [target.name]: arrayValues });
      this.props.sendUserData("gym", "payment", arrayValues);
    } else {
      const index = arrayValues.indexOf(target.value);
      if (index !== -1) arrayValues.splice(index, 1);
      this.setState({ [target.name]: arrayValues });
      this.props.sendUserData("gym", "payment", arrayValues);
    }
  }
  handleDropDown({ target }) {
    const arrayValues = this.props.gymProfile[target.name].value;
    if (!arrayValues.includes(target.value)) {
      arrayValues.push(target.value);
      this.props.sendUserData("gym", target.name, arrayValues);
    } else {
      const index = arrayValues.indexOf(target.value);
      if (index !== -1) arrayValues.splice(index, 1);
      this.props.sendUserData("gym", target.name, arrayValues);
    }
  }
  generateOptions = paymentsTypes => {
    const options = [];
    if (paymentsTypes) {
      paymentsTypes.map((paymentType, index) => {
        options.push({ id: paymentType._id, label: paymentType.method });
      });
    }
    return options;
  };

  render() {
    const { gymProfile, userProfile } = this.props;
    const paymentsTypes =
      this.props.settings && this.props.settings.paymentsTypes;
    const gymAccessTypes =
      this.props.settings && this.props.settings.gymAccessTypes;
    const rules = this.props.settings && this.props.settings.rules;
    const amenities = this.props.settings && this.props.settings.amenities;
    const gymTypes = this.props.settings && this.props.settings.gymTypes;

    return (
      <div>
        {this.props.display && this.props.display ? (
          <form action="">
            <h3 className="sc-box-ttl">GYM Profile</h3>
            <div className="sc-box shadow">
              <div className="gym-profile">
                <div className="col img-wrp">
                  <span className="user-img">
                    <img
                      src={
                        (gymProfile && gymProfile.gymImageUrl.value) ||
                        "/avatar-default.png"
                      }
                      alt=""
                    />
                  </span>
                </div>
                <div className="col dtl-wrp">
                  <div className="clearfix">
                    <div className="pull-left">
                      <h3>
                        {(gymProfile &&
                          gymProfile.gymName.value &&
                          gymProfile.gymName.value.toUpperCase()) ||
                          ""}
                      </h3>
                    </div>
                    <div className="pull-left">
                      <span className="star-rating">
                        <span className="">
                          <StarRatings
                            starRatedColor="#f9c00a"
                            rating={
                              gymProfile && gymProfile.rating.value
                                ? gymProfile.rating.value
                                : 0
                            }
                            starDimension="15px"
                            starSpacing="2px"
                          />
                        </span>
                        <span className="text">
                          (
                          {gymProfile && gymProfile.rating.value
                            ? gymProfile.rating.value
                            : "0"}
                          ){" "}
                        </span>
                      </span>
                    </div>
                  </div>
                  {gymTypes &&
                    gymTypes.map(gymtype => {
                      return (
                        <p className="text-primary">
                          {gymProfile &&
                          gymProfile.gymType.value.includes(gymtype._id)
                            ? gymtype.gymType
                            : ""}
                        </p>
                      );
                    })}
                  <p>
                    {" "}
                    {gymProfile &&
                      gymProfile.address.value.addressLine1 &&
                      gymProfile.address.value.addressLine1}{" "}
                    {"  "}{" "}
                    {gymProfile &&
                      gymProfile.address.value.addressLine2 &&
                      gymProfile.address.value.addressLine2}{" "}
                    {"  "}
                    {gymProfile &&
                      gymProfile.address.value.city &&
                      gymProfile.address.value.city}{" "}
                    {"  "}{" "}
                    {gymProfile &&
                      gymProfile.address.value.state &&
                      gymProfile.address.value.state}
                  </p>
                  <p>
                    {gymProfile &&
                      gymProfile.description &&
                      gymProfile.description.value}
                  </p>
                  <div className="col opt-col">
                    <a className="edit">
                      <i
                        onClick={() => this.props.editt("editttGym")}
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
                        name="phoneNumber"
                        type="text"
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
                <div className="col  col-md-3">
                  <h4>Owner Info</h4>
                  {this.props.edit || this.props.editInside ? (
                    <div className="form-group">
                      <input
                        type="text"
                        name="ownerInfo"
                        className="form-control"
                        onChange={this.handleChange}
                        value={gymProfile && gymProfile.ownerInfo.value}
                        placeholder="Trainer Owner Info"
                      />
                    </div>
                  ) : (
                    <p>{gymProfile && gymProfile.ownerInfo.value}</p>
                  )}
                </div>

                <div className="col col-md-3">
                  <h4>Payment</h4>

                  {this.props.edit || this.props.editInside ? (
                    <div className="form-group">
                      {paymentsTypes &&
                        paymentsTypes.map(paymentType => {
                          return (
                            <div className="" key={paymentType._id}>
                              <label className="containercheck">
                                {" "}
                                {paymentType.method}
                                <input
                                  type="checkbox"
                                  checked={
                                    gymProfile &&
                                    gymProfile.payment.value.length &&
                                    gymProfile.payment.value.includes(
                                      paymentType._id
                                    )
                                      ? "checked"
                                      : ""
                                  }
                                  className="chcked-sect"
                                  value={paymentType._id}
                                  nname="payment"
                                  onClick={this.handleDropDownSingle}
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
                    paymentsTypes &&
                    paymentsTypes.map(paymentType => {
                      return (
                        <p>
                          {" "}
                          {gymProfile &&
                          gymProfile.payment.value.includes(paymentType._id)
                            ? paymentType.method
                            : ""}
                        </p>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="ad-user-profile gym-dtls row">
                <div className="col  col-md-3">
                  <h4>Guest Access</h4>
                  {this.props.edit || this.props.editInside ? (
                    <div className="form-group">
                      {gymAccessTypes &&
                        gymAccessTypes.map(gymAccessType => {
                          return (
                            <div className="" key={gymAccessType._id}>
                              <label className="containercheck">
                                {" "}
                                {gymAccessType.name}
                                <input
                                  type="checkbox"
                                  checked={
                                    gymProfile &&
                                    gymProfile.guestAccess.value.includes(
                                      gymAccessType._id
                                    )
                                      ? "checked"
                                      : ""
                                  }
                                  className="chcked-sect"
                                  value={gymAccessType._id}
                                  name="guestAccess"
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
                    gymAccessTypes &&
                    gymAccessTypes.map(gymAccessType => {
                      return (
                        <p>
                          {" "}
                          {gymProfile &&
                          gymProfile.guestAccess.value.includes(
                            gymAccessType._id
                          )
                            ? gymAccessType.name
                            : ""}
                        </p>
                      );
                    })
                  )}
                </div>
                <div className="col  col-md-3">
                  <h4>Amenities</h4>
                  {this.props.edit || this.props.editInside ? (
                    <div className="form-group">
                      {amenities &&
                        amenities.map(amenity => {
                          return (
                            <div className="" key={amenity._id}>
                              <label className="containercheck">
                                {" "}
                                {amenity.name}
                                <input
                                  type="checkbox"
                                  checked={
                                    gymProfile &&
                                    gymProfile.ameneties.value.includes(
                                      amenity._id
                                    )
                                      ? "checked"
                                      : ""
                                  }
                                  className="chcked-sect"
                                  value={amenity._id}
                                  onClick={this.handleDropDown}
                                  name="ameneties"
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
                    amenities &&
                    amenities.map(amenity => {
                      return (
                        <p>
                          {" "}
                          {gymProfile &&
                          gymProfile.ameneties.value.includes(amenity._id)
                            ? amenity.name
                            : ""}
                        </p>
                      );
                    })
                  )}
                </div>
                <div className="col  col-md-3">
                  <h4>Gym Rules</h4>
                  {this.props.edit || this.props.editInside ? (
                    <div className="form-group">
                      {rules &&
                        rules.map(rule => {
                          return (
                            <div className="" key={rule._id}>
                              <label className="containercheck">
                                {" "}
                                {rule.name}
                                <input
                                  type="checkbox"
                                  checked={
                                    gymProfile &&
                                    gymProfile.gymRules.value.includes(rule._id)
                                      ? "checked"
                                      : ""
                                  }
                                  className="chcked-sect"
                                  value={rule._id}
                                  onClick={this.handleDropDown}
                                  name="gymRules"
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
                    rules &&
                    rules.map(rule => {
                      return (
                        <p>
                          {" "}
                          {gymProfile &&
                          gymProfile.gymRules.value.includes(rule._id)
                            ? rule.name
                            : ""}
                        </p>
                      );
                    })
                  )}
                </div>

                <div className="col  col-md-3">
                  <h4>Gym Types</h4>
                  {this.props.edit || this.props.editInside ? (
                    <div className="form-group">
                      {gymTypes &&
                        gymTypes.map(gymtype => {
                          return (
                            <div className="" key={gymtype._id}>
                              <label className="containercheck">
                                {" "}
                                {gymtype.gymType}
                                <input
                                  type="checkbox"
                                  checked={
                                    gymTypes &&
                                    gymProfile.gymType.value.includes(
                                      gymtype._id
                                    )
                                      ? "checked"
                                      : ""
                                  }
                                  className="chcked-sect"
                                  value={gymtype._id}
                                  onClick={this.handleDropDown}
                                  name="gymType"
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
                    gymTypes &&
                    gymTypes.map(gymtype => {
                      return (
                        <p>
                          {" "}
                          {gymProfile &&
                          gymProfile.gymType.value.includes(gymtype._id)
                            ? gymtype.gymType
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
