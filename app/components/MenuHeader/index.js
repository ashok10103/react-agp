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
import logo from '../../assets/images/homepage-logo.png'

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

class MenuHeader extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      showProfile: false,
      open: false,
      showAccount: false,
      tab: 1
    };
    this.showActiveTab = this.showActiveTab.bind(this);
  }
  showActiveTab(tab) {
    this.setState({ tab });
  }
  render() {
    const { user } = this.props;
    const { open, showAccount, tab } = this.state;
    
    return (
      <header
        className={cx("p-header", {
          "gradient-primary newhdr-inner": this.props.type === "inner",
          newhdr: this.props.type === "front"
        })}
      >
        <div className="container-fluid containr-new">
          <a href="" className="header-logo">
            <img src={logo} alt="" style={{padding:'10px'}} />
          </a>
          <nav className="header-nav pull-right">
            <button className="nav-trigger hidden-sm hidden-md hidden-lg">
              <i className="fa fa-bars" aria-hidden="true" />
            </button>
            <ul className="list-unstyled clearfix hidden-xs">
              <li onClick={e => this.showActiveTab(1)}>
                <Link className={cx({ 'active': tab === 1 })} to={`/`} replace>
                  Home
                </Link>
              </li>

              <li onClick={e => this.showActiveTab(2)}>
                <Link
                  className={cx({ 'active': tab === 2 })}
                  to={`/about`}
                  replace
                >
                  ABOUT
                </Link>
              </li>
              <li onClick={e => this.showActiveTab(3)}>
                <Link className={cx({ 'active': tab === 3 })} to={`/faq`} replace>
                  Faq
                </Link>
              </li>
              <li
                onClick={e => this.showActiveTab(4)}
              >
                <Link
                  className={cx({ 'active': tab === 4 })}
                  to={`/contact`}
                  replace
                >
                  Contact
                </Link>
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
)(MenuHeader);
