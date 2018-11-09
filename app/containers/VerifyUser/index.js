import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";
import { sendToken } from "./actions";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import { getUserType, setUserState, getUserState } from "../../utils/helper";

const userType = getUserType();
class VerifyUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.sendToken(this.props.match.params.token);
  }
  render() {
    return (
      <main className="p-login">
        <div className="c-login">
          <div className="logo-block">
            {/* <img src={`/AirGym-${match.params.userType}-logo.png`} /> */}
          </div>
          <div className="b-login border">
            <h2 className=" text-center">
              {" "}
              <i className="fa fa-user-circle-o fa-userr" aria-hidden="true" />
            </h2>
            <h2 className="h-login text-center blue-color">
              User Verification
            </h2>

            <p className="text-center h4 blue-color">
              {" "}
              Your account has been verified !
            </p>
            <p className="text-center h5 blue-color">
              Please login to continue.....{" "}
            </p>
            <p className="text-center h3 ">
              {userType == "OWNER" ? (
                <Link to={"/gyms/register"}> Login</Link>
              ) : (
                ""
              )}

              {userType == "TRAINER" ? (
                <Link to={"/trainer/register"}> Login</Link>
              ) : (
                ""
              )}
            </p>
          </div>
        </div>
      </main>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    sendToken: value => {
      return dispatch(sendToken(value));
    }
  };
}
const mapStateToProps = createStructuredSelector({

});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);


const withReducer = injectReducer({ key: "VerifyUser", reducer });
const withSaga = injectSaga({ key: "VerifyUser", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(VerifyUser);
