/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { reducer as notifications } from 'react-notification-system-redux';
import globalReducer from 'containers/App/reducer';
import languageProviderReducer from 'containers/LanguageProvider/reducer';
import loginReducer from 'containers/Login/reducer';
import gymDetailReducer from 'containers/Gyms/Details/reducer';
import gymListReducer from 'containers/Gyms/List/reducer';
import registerReducer from 'containers/Register/reducer';
import gymRegisterReducer from 'containers/Gyms/Register/reducer';
import TrainerRegisterReducer from 'containers/Trainer/Register/reducer';
import TrainerEditReducer from 'containers/Trainer/EditTrainer/reducer';
import trainerDetailReducer from 'containers/Trainer/TrainerDetails/reducer';
import gymScheduleReducer from 'containers/Gyms/Schedule/reducer';
import gymEditReducer from 'containers/Gyms/Edit/reducer';
import bookingListReducer from 'containers/Bookings/MyBookings/reducer';
import notificationListReducer from 'containers/Notifications/MyNotifications/reducer';
import bookingSlotReducer from 'containers/Bookings/BookSlot/reducer';
import TrainerSlotReducer from 'containers/Trainer/list/reducer';
import GymUploadReducer from 'containers/Gyms/UploadFile/reducer';
import ResetPasswordReducer from 'containers/ForgotPassword/ResetPassword/reducer';
import AddUsernameReducer from 'containers/ForgotPassword/AddUsername/reducer';
import CreateAccountReducer from 'containers/CreateAccount/reducer';
import AdminLoginReducer from 'containers/AdminTable/Login/reducer';
import UsersListReducer from 'containers/AdminTable/UsersList/reducer';
import ReportGymReducer from './containers/AdminTable/ReportGym/reducer';
import VerifyUserReducer from './containers/VerifyUser/reducer';
import UserDetailsReducer from './containers/VerifyUser/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@5
 *
 */

// Initial routing state
const routeInitialState = fromJS({
  location: null,
});

/**
 * Merge route into the global application state
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE:
      return state.merge({
        location: action.payload,
      });
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers) {
  return combineReducers({
    route: routeReducer,
    global: globalReducer,
    login: loginReducer,
    register: registerReducer,
    gymDetail: gymDetailReducer,
    gymEdit:gymEditReducer,
    gymList: gymListReducer,
    gymSchedule: gymScheduleReducer,
    language: languageProviderReducer,
    GymRegister: gymRegisterReducer,
    TrainerRegister: TrainerRegisterReducer,
    TrainerEdit:TrainerEditReducer,
    TrainerDetail:trainerDetailReducer,
    BookingsList: bookingListReducer,
    NotificationList: notificationListReducer,
    Booking: bookingSlotReducer,
    TrainerBookings: TrainerSlotReducer,
    GymUpload: GymUploadReducer,
    ResetPassword:ResetPasswordReducer,
    AddUsername:AddUsernameReducer,
    CreateAccount:CreateAccountReducer,
    AdminLogin:AdminLoginReducer,
    UsersList:UsersListReducer,
    ReportGym:ReportGymReducer,
    VerifyUser:VerifyUserReducer,
    UserDetails:UserDetailsReducer,
    notifications,
    ...injectedReducers,
  });
}
