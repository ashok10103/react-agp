/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";

import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import {
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError
} from "containers/App/selectors";
import H2 from "components/H2";
import ReposList from "components/ReposList";
import AtPrefix from "./AtPrefix";
import CenteredSection from "./CenteredSection";
import Form from "./Form";
import Input from "./Input";
import Section from "./Section";
import messages from "./messages";
import { loadRepos, getSettings } from "../App/actions";
import { changeUsername } from "./actions";
import AuthService from "../../utils/AuthService";
import MenuHeader from "components/MenuHeader";
// import { makeSelectUsername } from "./selectors";
import { makeSelectCurrentUser } from "../App/selectors";

import reducer from "./reducer";
import saga from "containers/App/saga";
import { Link } from "react-router-dom";
import {
  removeUser,
  getUserState,
  getUserId,
  getUserType
} from "../../utils/helper";
const auth = new AuthService();
const isLogged = () => auth.isLogged();

// import TermsAndConditions from "../../components/Terms and policies/TermsAndConditions";
// import Policies from "../../components/Terms and policies/Policies";
import CopyRight from "../../components/CopyRight";

export class HomePage extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    // if (this.props.username && this.props.username.trim().length > 0) {
    // this.props.onSubmitForm();
    this.props.getSettings();
    // }
    const currentState = getUserState();
    if (currentState && isLogged()) {
      this.props.history.push(currentState);
    }

    console.log("userId", getUserId());

    // if(this.props.user) {
    //   const currentState  = getUserState()
    //   if(currentState) {
    //     this.props.history.push(currentState);
    //   } else {
    //     const state =this.props.user.userType=== 'OWNER' ? '/gyms/register' : '/gyms'
    //     this.props.history.push(state);
    //   }
    // } else {
    //   this.props.history.push('/');

    // }
  }
  componentWillUnMount() {
    localStorage.removeItem("logCount");
  }
  render() {
    const { loading, error, repos } = this.props;
    const reposListProps = {
      loading,
      error,
      repos
    };

    return (
      <main className="p-login">
        <MenuHeader type="front" />
        <div className="c-login user-signup">
          <div className="logo-block">
            <img src="AirGym-logo.png" alt="AirGym" />
          </div>
          <div className="b-usersignup">
            <ul className="row list-unstyled text-center">
              <li className="col-sm-4">
                <span className="img-wrp">
                  <img src="AirGym-owner-logo.png" alt="" />
                </span>
                <span className="btn-wrp">
                  <Link to={`/register/owner`}>
                    <span className="btn btn-primary">
                      AirGym Owner Sign Up
                    </span>
                  </Link>
                </span>
                <p className="already">
                  Already have an account?{" "}
                  <Link to={`/login/owner`}>Login</Link>
                </p>
              </li>
              <li className="col-sm-4">
                <span className="img-wrp">
                  <img src="AirGym-member-logo.png" alt="" />
                </span>
                <span className="btn-wrp">
                  <Link to="/register/member">
                    <span className="btn btn-secondary">
                      AirGym Member Sign Up
                    </span>
                  </Link>
                </span>
                <p className="already">
                  Already have an account?{" "}
                  <Link to={`/login/member`}>
                    <span className="text-secondary">Login</span>
                  </Link>
                </p>
              </li>
              <li className="col-sm-4">
                <span className="img-wrp">
                  <img src="AirGym-trainer-logo.png" alt="" />
                </span>
                <span className="btn-wrp">
                  <Link to="/register/trainer">
                    <span className="btn btn-additional">
                      AirGym Trainer Sign Up
                    </span>
                  </Link>
                </span>
                <p className="already">
                  Already have an account?{" "}
                  <Link to={`/login/trainer`}>
                    <span className="text-additional">Login</span>
                  </Link>
                </p>
              </li>
            </ul>
          </div>
          <div className="termsbar" style={{fontSize:'15px'}}>
            <p>
              {" "}
              <Link to={`/terms_conditions`}>
                <p className="text-center">Terms And Conditions</p>
              </Link>
            </p>
            <p className="text-center">
              <Link to={`/privacy_policy`}>
                &nbsp;&nbsp;&nbsp;&nbsp;Privacy Policies
              </Link>

              <Link to={`/terms/payments_terms`}>
                &nbsp;&nbsp;&nbsp;&nbsp; Payment Terms and Conditions
              </Link>
            </p>
            <Link to={`/copy_right`}>
              <p className="text-center">
                <a>&copy; 2018. All rights reserved </a>
              </p>
            </Link>
          </div>
        </div>
      </main>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
    onSubmitForm: evt => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(loadRepos());
    },
    getSettings: () => dispatch(getSettings())
  };
}

const mapStateToProps = createStructuredSelector({
  repos: makeSelectRepos(),
  // username: makeSelectUsername(),
  user: makeSelectCurrentUser(),
  loading: makeSelectLoading(),
  error: makeSelectError()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "appSaga", reducer });
const withSaga = injectSaga({ key: "appSaga", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(HomePage);
