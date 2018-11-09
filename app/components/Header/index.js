import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import injectSaga from "../../utils/injectSaga";
import { createStructuredSelector } from "reselect";
import cx from "classnames";
import saga from "../../containers/App/saga";
import EditProfile from "../../containers/EditProfile";
import CreateAccount from "../../containers/CreateAccount";
import { Link } from "react-router-dom";
import {
  removeUser,
  getUserState,
  getUserId,
  getUserType
} from "../../utils/helper";
import {
  setUserLocation,
  getCurrentUser,
  getSettings
} from "containers/App/actions";
import { makeSelectCurrentUser } from "containers/App/selectors";

class Header extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      showProfile: false,
      open: false,
      showAccount: false
    };
    this.logOut = this.logOut.bind(this);
    this.loadProfile = this.loadProfile.bind(this);
    this.loadAccount = this.loadAccount.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  componentDidMount() {
    const count = localStorage.getItem("logCount");
    if (count !== 1) {
      this.props.getCurrentUser();
      this.props.getSettings();
    }
  }

  componentWillUnMount() {
    localStorage.removeItem("logCount");
  }
  logOut() {
    removeUser();
    this.props.history.push("/");
  }
  loadProfile() {
    this.setState({ showProfile: !this.state.showProfile });
  }
  loadAccount() {
    this.setState({ showAccount: !this.state.showAccount });
  }
  toggleMenu(e) {
    e.preventDefault();
    this.setState({ open: !this.state.open });
  }
  render() {
    const { user } = this.props;
    const { open, showAccount } = this.state;

    return (
      <header className={cx("p-header gradient-primary",{'db-header': user.userType ==='ADMIN'})} id={user.userType === "ADMIN"?"admin-header":"" }>
        {this.state.showProfile ? (
          <EditProfile
            showProfile={this.state.showProfile}
            user={this.props.user}
            toggleModal={this.loadProfile}
          />
        ) : (
          <div />
        )}
        {user.userType === "OWNER" && showAccount ? (
          <CreateAccount
            user={this.props.user}
            showAccount={this.state.showAccount}
            toggleModalAccount={this.loadAccount}
          />
        ) : (
          <div />
        )}

        <div className="container-fluid container-inner">
          <a href="" className="header-logo">
            <img
              src={`/AirGym-${
                user.userType ? user.userType.toLowerCase() : ""
              }-logo.png`}
              alt=""
            />
          </a>
          <nav className="header-nav pull-right">
            <button
              className="nav-trigger hidden-sm hidden-md hidden-lg"
              onClick={this.toggleMenu}
            >
              <i className="fa fa-bars" aria-hidden="true" />
            </button>
            <ul
              className={cx("list-unstyled clearfix hidden-xs", {
                "menu-open": open
              })}
            >
              {user.userType === "OWNER"
                ? [
                    <li>
                      <Link to={`/gyms/schedule/${user.gymId}`} replace>
                        {/* <span className={`text-${getUserClass(match.params.userType)}`}> */}
                        Schedule
                        {/* </span> */}
                      </Link>
                    </li>,
                    <li>
                      <Link to={`/gyms/${user.gymId}`} replace>
                        Gym Profile
                      </Link>
                    </li>,
                    <li>
                      <Link to={`/gyms/bookings/${user.gymId}`} replace>
                        Bookings
                      </Link>
                    </li>,
                    <li>
                      <Link to={`/notifications/${user._id}`} replace>
                        {/* <span className={`text-${getUserClass(match.params.userType)}`}> */}
                        Notifications
                        {/* </span> */}
                      </Link>
                    </li>
                  ]
                : user.userType === "MEMBER"
                  ? [
                      <li>
                        <Link to={`/mybookings/${user._id}`} replace>
                          My Bookings
                        </Link>
                      </li>,
                      <li>
                        <Link
                          to={`/search/${user.userType &&
                            user.userType.toLowerCase()}/${user._id}`}
                          replace
                        >
                          Find Gyms
                        </Link>
                      </li>,
                      <li>
                        <Link to={`/notifications/${user._id}`} replace>
                          {/* <span className={`text-${getUserClass(match.params.userType)}`}> */}
                          Notifications
                          {/* </span> */}
                        </Link>
                      </li>
                    ]
                  : user.userType === "TRAINER"
                    ? [
                        <li>
                          <Link to={`/mybookings/${user._id}`} replace>
                            My Bookings
                          </Link>
                        </li>,
                        <li>
                          <Link
                            to={`/trainer/details/${user.trainerId}`}
                            replace
                          >
                            Trainer Profile
                          </Link>
                        </li>,
                        <li>
                          <Link to={`/getMembers/${user.trainerId}`} replace>
                            Who Booked Me
                          </Link>
                        </li>,
                        <li>
                          <Link
                            to={`/search/${user.userType.toLowerCase()}/${
                              user._id
                            }`}
                            replace
                          >
                            Find Gyms
                          </Link>
                        </li>,
                        <li>
                          <Link to={`/notifications/${user._id}`} replace>
                            {/* <span className={`text-${getUserClass(match.params.userType)}`}> */}
                            Notifications
                            {/* </span> */}
                          </Link>
                        </li>
                      ]
                    : user.userType === "ADMIN"
                      ? [
                          <li >
                            <Link to={`/admin/list`} replace>
                              Users List
                            </Link>
                          </li>,
                          <li>
                            <Link
                              to={`/admin/reports`}
                              replace
                            >
                              Reports{" "}
                            </Link>
                          </li>
                        ]
                      : [
                          <li>
                            <Link to={`/mybookings/${user._id}`} replace>
                              My Bookings
                            </Link>
                          </li>,
                          <li>
                            <Link
                              to={`/search/${user.userType &&
                                user.userType.toLowerCase()}/${user._id}`}
                              replace
                            >
                              Find Gyms
                            </Link>
                          </li>,
                          <li>
                            <Link to={`/notifications/${user._id}`} replace>
                              {/* <span className={`text-${getUserClass(match.params.userType)}`}> */}
                              Notifications
                              {/* </span> */}
                            </Link>
                          </li>
                        ]}

              <li className="user-area ">
                <a className="user-tp">
                { user.profileImageUrl ?
                  <img
                    src={user.profileImageUrl}
                    alt={user.firstName}
                    style={{backgroundSize:'cover',objectFit:'cover',objectPosition:'left center',transform:'rotate(90deg)'}}
                  />:<img src="/avatar-default.png"/>}
                  <span>My Profile</span>
                  <i className="fa fa-caret-down" aria-hidden="true" />
                </a>
                <ul className="user-dropdown">
                  <li>
                  {user.userType !== "ADMIN"&& <a onClick={this.loadProfile}>My Profile</a>}
                  </li>
                  {user.userType === "OWNER" ? (
                    <li>
                      <a onClick={this.loadAccount}>Bank Account</a>
                    </li>
                  ) : (
                    ""
                  )}
                  <li>
                    <a onClick={this.logOut}>Log Out</a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  user: makeSelectCurrentUser()
});

function mapDispatchToProps(dispatch) {
  return {
    setUserLocation: userId => dispatch(setUserLocation(userId)),
    getCurrentUser: () => dispatch(getCurrentUser()),
    getSettings: () => dispatch(getSettings())
  };
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withSaga = injectSaga({ key: "appSaga", saga });

export default compose(
  withRouter,
  withConnect,
  withSaga
)(Header);
