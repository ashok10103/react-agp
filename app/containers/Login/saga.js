import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../utils/api';
import createValidator from '../../utils/createValidator';
import { setUser, userJWTData } from '../../utils/helper';

import {
  CHANGE_VALUE, SUBMIT, SUBMITTED, VALIDATE, REST_PASS, SOCIAL_LOGIN,
} from './constants';

import {
  setCurrentUser,
} from '../App/actions';

import {
  setValid,
  setInvalid,
  setSubmitting,
  setSubmitted,
  validate,
  submitSuccess,
  submitError,
  clearSubmit,
} from './actions';

const notificationOpts = {
  message: 'Welcome to Airgym',
  position: 'tc',
  autoDismiss: 5,
};

function* handleValidate(action) {
  const { validation, field, module } = action;
  if (Array.isArray(validation)) {
    yield validation.map((v) => call(handleValidate, {
      ...action,
      validation: v,
    }));
    return;
  }

  const validator = yield call(createValidator, validation);
  const value = yield select((state) => state.get('login').toJS()[module][field].value);
  try {
    const valid = yield call(validator.test, value);
    const error = validator.report(value);
    if (valid) {
      yield put(setValid(field, error, module));
    } else {
      yield put(setInvalid(field, error, module));
    }
  } catch (e) {
    // console.log(e);
  }
}

function* handleSubmit(action) {
  const { validations, handler, module, userType } = action;
  const state = yield select((state) => state);
  const fieldsNotValidated = Object.keys(state.get('login').toJS()[module]).reduce((notValidated, name) => {
    const field = state.get('login').toJS()[module][name];

    if (field.validated) {
      return notValidated;
    } else {
      return notValidated.concat(name);
    }
  }, []);
  if (fieldsNotValidated.length) {
    yield fieldsNotValidated.map(
      (name) => put(validate(name, validations[name], module)));
  }
  const values = Object.keys(state.get('login').toJS()[module]).reduce((vals, name) => {
    vals[name] = state.get('login').toJS()[module][name].value;
    return vals;
  }, {});
  yield put(setSubmitting());
  yield put(setSubmitted(values, handler, module, userType));
}

function* getProfileData(id) {
  try {
    const res = yield call(API.common.profile, id);
    if (res.result.status == 'success') {
      yield put(push('/gyms'));
      yield put(setCurrentUser(res.result.user));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}

function* handleAfterSubmit(action) {
  const { handler, values, module, userType } = action;
  try {
    if (module === 'forgetPassword') {
      values.email = btoa(values.email);
      const auth = yield call(API.auth.forgotPassword, values.email);
      if (auth.result && auth.result.status === 'success' && auth.result.forgotPasswordTrackerId) {
        localStorage.setItem('pass_tracker_id', auth.result.forgotPasswordTrackerId);
        notificationOpts.title = "Reset code sent";
        notificationOpts.message = "We have sent an email with verification code.";
        yield put(Notifications.success(notificationOpts));
        yield call(handler);
      } else {
        // notificationOpts.title = 'Could not send email';
        notificationOpts.message = 'The provided email id does not exists.';
        yield put(Notifications.error(notificationOpts));
        yield put(submitError(auth));
      }
    } else {
      values.emailId = values.email;
      values.userType = userType;
      const auth = yield call(API.auth.login, values);
      if (auth.result && auth.result.status === 1) {
        if (auth.result && auth.result.status) {
          const rememberMe = yield select((state) => state.get('login').toJS().rememberMe);
          if (rememberMe) {
            setUser(auth.result.token, auth.result.user._id, auth.result.user.userType, true);
          } else {
            setUser(auth.result.token, auth.result.user._id, auth.result.user.userType);
          }
          yield put(setCurrentUser(auth.result.user));
          yield put(submitSuccess(auth));
          yield put(clearSubmit());
          if (auth.result.user && auth.result.user.userType === 'OWNER') {
            if (auth.result.user.gymId) {
              yield put(push(`/gyms/bookings/${auth.result.user.gymId}`));
            } else {
              yield put(push('/gyms/register'));
            }
          } else {
            yield put(push(`/search/${auth.result.user.userType}/${auth.result.user._id}`));
          }
        }
      } else {
        notificationOpts.message = 'Invalid Email or Password';
        yield put(Notifications.error(notificationOpts));
        yield put(submitError(auth));
      }
    }
  } catch (e) {
    console.log('e', e);
  }
}

function* login(action) {
  const { field } = action;
  const value = yield select((state) => {
    return state.get('login').get('fields');
  });
}
function* handleSocialLogin(action) {
  const { values } = action;
  const auth = yield call(API.auth.socialLogin, values);
  if (auth.result && auth.result.status === 1) {
    setUser(auth.result.token, auth.result.user._id, auth.result.user.userType);
    yield put(setCurrentUser(auth.result.user));
    if (auth.result.user && auth.result.user.userType === 'OWNER') {
      if (auth.result.user.gymId) {
        yield put(push(`/gyms/bookings/${auth.result.user.gymId}`));
      } else {
        yield put(push('/gyms/register'));
      }
    } else {
      yield put(push(`/search/${auth.result.user.userType}/${auth.result.user._id}`));
    }
  } else {
    notificationOpts.message = 'Invalid Email or Password';
    yield put(Notifications.error(notificationOpts));
    yield put(submitError(auth));
  }
}
function* resetPassword(action) {
  const { data, cb, cb2 } = action;
  try {
    const res = yield call(API.auth.resetPassword, data);
    console.log('Res', res);
    if (res.result.status == 'success') {
      yield call(cb);
    } else if (res.result.statusCode == 403) {
      yield call(cb2);
      // notificationOpts.title = 'Reset password failed';
      notificationOpts.message = 'You have entered wrong code or exceeded maximum number of attempts.';
      yield put(Notifications.error(notificationOpts));
    }
  } catch (e) {
    yield call(cb2);
    // notificationOpts.title = 'Reset password failed';
    notificationOpts.message = 'Something went wrong!, please try again.';
    yield put(Notifications.error(notificationOpts));
  }
}

function* LoginSaga() {
  yield fork(takeEvery, CHANGE_VALUE, login);
  yield fork(takeEvery, VALIDATE, handleValidate);
  yield fork(takeEvery, SUBMITTED, handleAfterSubmit);
  yield fork(takeEvery, REST_PASS, resetPassword);
  yield fork(takeEvery, SOCIAL_LOGIN, handleSocialLogin);
  const watcher = yield takeEvery(SUBMIT, handleSubmit);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default LoginSaga;
