/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { Switch, Route, Redirect } from "react-router-dom";
import AuthService from "../../utils/AuthService";
import { getUserType, setUserState, getUserState } from "../../utils/helper";

import cx from "classnames";

import HomePage from "containers/HomePage/Loadable";
import Login from "containers/Login";
import Register from "containers/Register";
import GymDetail from "containers/Gyms/Details";
import GymList from "containers/Gyms/List";
import GymRegister from "containers/Gyms/Register";
import TrainerRegister from "containers/Trainer/Register";
import GymSchedule from "containers/Gyms/Schedule";
import GymBookingList from "containers/Gyms/Bookings/list";
import MyBookings from "containers/Bookings/MyBookings";
import BookSlot from "containers/Bookings/BookSlot";
import GymUpload from "containers/Gyms/UploadFile";
import FeaturePage from "containers/FeaturePage/Loadable";
import NotFoundPage from "containers/NotFoundPage/Loadable";
import Edit from "containers/Gyms/Edit";
import EditTrainer from "containers/Trainer/EditTrainer";
import TrainerDetail from "containers/Trainer/TrainerDetails";
import Search from "containers/Search";
import TrainerBookingList from "containers/Trainer/list";
import Header from "components/Header";
import Notifications from "components/Notifications";
import MyNotifications from "containers/Notifications/MyNotifications";
import Footer from "components/Footer";
import AppWrapper from "./AppWrapper";
import ResetPassword from "../ForgotPassword/ResetPassword";
import AddUsername from "../ForgotPassword/AddUsername";
import CreateAccount from "../CreateAccount";
import Policies from "components/TermsAndPolicies/Policies";
import TermsConditions from "components/TermsAndPolicies/TermsConditions";
import AdminLogin from "../AdminTable/Login";
import UsersList from "../AdminTable/UsersList";
import CopyRight from "../../components/CopyRight";
import Payment from "../../components/PaymentTermsOfService";
import About from "../../components/HomeIcons/About";
import Faq from "../../components/HomeIcons/Faq";
import Contact from "../../components/HomeIcons/Contact";
import ReportGym from "../AdminTable/ReportGym";
import VerifyUser from "../VerifyUser";
import UserDetails from "../AdminTable/UserDetails";
import Share from "../Share";

// const AppWrapper = styled.div``;
const auth = new AuthService();
const isLogged = () => auth.isLogged();
const userType = getUserType();

export default function App(props) {
  const { history } = props;
  return (
    <AppWrapper>
      <Notifications {...props} />
      {history &&
        !history.location.pathname.includes("/login") &&
        // !history.location.pathname.includes("/admin/list") &&
        !history.location.pathname.includes("/admin/login") &&
        !history.location.pathname.includes("/faq") &&
        !history.location.pathname.includes("/about") &&
        !history.location.pathname.includes("/contact") &&
        !history.location.pathname.includes("/copy_right") &&
        !history.location.pathname.includes("/terms_conditions") &&
        !history.location.pathname.includes("/privacy_policy") &&
        !history.location.pathname.includes("/terms/payments_terms") &&
        !history.location.pathname.includes("/weekschedule/:gymId") &&
        history.location.pathname !== "/" &&
        !history.location.pathname.includes("/register") &&
        !history.location.pathname.includes("/forgot") &&
        !history.location.pathname.includes("/verify/:token") &&
        !history.location.pathname.includes("/reset/") && <Header />}
      {/* {history && !history.location.pathname.includes('/login')
        && history.location.pathname !== '/'
        && !history.location.pathname.includes('/register')
        && !history.location.pathname.includes('/forgot/')
        && !history.location.pathname.includes('/reset/')
        && !history.location.pathname.includes('/privacy_policy')
        && !history.location.pathname.includes('/terms_conditions')

        // && !history.location.pathname.includes('/bankaccount')

        && <Header />}
      <Switch>

        && <Header />} */}
      <Switch>
        <Route path="/features" component={FeaturePage} />
        <Route path="/copy_right" component={CopyRight} />
        <Route path="/terms_conditions" component={TermsConditions} />
        <Route path="/privacy_policy" component={Policies} />
        <Route path="/terms/payments_terms" component={Payment} />
        <Route path="/verify/:token" component={VerifyUser} />
        <Route exact path="/weekschedule/:gymId" component={Share} />

        <Route
          exact
          path="/gyms/register"
          render={props => {
            return isLogged() ? (
              <GymRegister {...props} />
            ) : (
              <Redirect to="/" />
            );
          }}
        />
        <Route
          exact
          path="/reset/:token"
          render={props => {
            return <ResetPassword {...props} />;
          }}
        />
        <Route
          exact
          path="/gyms/upload/:gymId"
          render={props => {
            return isLogged() ? <GymUpload {...props} /> : <Redirect to="/" />;
          }}
        />

        <Route
          exact
          path="/gyms/schedule/:gymId"
          render={props => {
            return isLogged() ? (
              <GymSchedule {...props} />
            ) : (
              <Redirect to="/" />
            );
          }}
        />
        <Route
          exact
          path="/gyms/bookings/:gymId"
          render={props => {
            return isLogged() ? (
              <GymBookingList {...props} />
            ) : (
              <Redirect to="/" />
            );
          }}
        />
        <Route
          exact
          path="/gyms/:gymId"
          render={props => {
            return isLogged() ? <GymDetail {...props} /> : <Redirect to="/" />;
          }}
        />
        <Route exact path="/admin/list" component={UsersList} />
        <Route exact path="/about" component={About} />
        <Route exact path="/faq" component={Faq} />
        <Route exact path="/contact" component={Contact} />

        <Route exact path="/gyms/edit/:gymId" component={Edit} />
        <Route exact path="/admin/reports" component={ReportGym} />
        <Route exact path="/admin/user_details" component={UserDetails} />
        <Route exact path="/trainer/edit/:gymId" component={EditTrainer} />

        <Route
          exact
          path="/mybookings/:userId"
          render={props => {
            return isLogged() ? <MyBookings {...props} /> : <Redirect to="/" />;
          }}
        />

        <Route
          exact
          path="/notifications/:userId"
          render={props => {
            return isLogged() ? (
              <MyNotifications {...props} />
            ) : (
              <Redirect to="/" />
            );
          }}
        />

        <Route
          exact
          path="/trainer/register"
          render={props => {
            return isLogged() ? (
              <TrainerRegister {...props} />
            ) : (
              <Redirect to="/" />
            );
          }}
        />

        <Route
          exact
          path="/trainer/details/:trainerId"
          render={props => {
            return isLogged() ? (
              <TrainerDetail {...props} />
            ) : (
              <Redirect to="/" />
            );
          }}
        />

        <Route
          exact
          path="/search/:userType/:userId"
          render={props => {
            return isLogged() ? <Search {...props} /> : <Redirect to="/" />;
          }}
        />
        <Route
          exact
          path="/mybookings/:userId"
          render={props => {
            return isLogged() ? <MyBookings {...props} /> : <Redirect to="/" />;
          }}
        />
        <Route
          exact
          path="/book/:bookType/:id"
          render={props => {
            return isLogged() ? <BookSlot {...props} /> : <Redirect to="/" />;
          }}
        />
        <Route
          exact
          path="/getMembers/:trainerId"
          render={props => {
            return isLogged() ? (
              <TrainerBookingList {...props} />
            ) : (
              <Redirect to="/" />
            );
          }}
        />
        <Route
          exact
          path="/search/:userType/:userId"
          render={props => {
            return isLogged() ? <Search {...props} /> : <Redirect to="/" />;
          }}
        />
        <Route
          exact
          path="/gyms"
          render={() => {
            return isLogged() ? <GymList /> : <Redirect to="/" />;
          }}
        />
        <Route
          exact
          path="/trainer/register"
          render={props => {
            return isLogged() ? (
              <TrainerRegister {...props} />
            ) : (
              <Redirect to="/" />
            );
          }}
        />
        <Route path="/user/forgot/:userType" component={AddUsername} />
        <Route exact path="/admin/login" component={AdminLogin} />
        <Route
          exact
          // path="/:userId/reset:token"
          path="/:userId/hi"
          component={AddUsername}
        />

        <Route exact path="/create/account" component={CreateAccount} />

        <Route
          // component={Login}
          exact
          path="/login/:userType"
          render={props => {
            console.log(props);
            return <Login to="/" {...props} />;
          }}
        />
        <Route path="/register/:userType" component={Register} />
        <Route
          exact
          path="/"
          render={props => {
            console.log(props);
            return <HomePage to="/" {...props} />;
          }}
        />
        <Route path="" component={NotFoundPage} />
      </Switch>
      {history &&
        !history.location.pathname.includes("/login") &&
        history.location.pathname !== "/" &&
        !history.location.pathname.includes("/register") && <Footer />}
    </AppWrapper>
  );
}
