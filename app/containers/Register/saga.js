import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../utils/api';
import createValidator from '../../utils/createValidator';
import { setUser, userJWTData } from '../../utils/helper';

import {
  CHANGE_VALUE, SUBMIT, SUBMITTED, VALIDATE, REST_PASS, SOCIAL_SIGNUP,
} from './constants';

import {
  setValid,
  setInvalid,
  setSubmitting,
  setSubmitted,
  validate,
  submitSuccess,
  submitError,
  clearSubmit,
  socialSignup,
} from './actions';
import { load } from 'react-cookies';

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
  const value = yield select((state) => state.get('register').toJS()[module][field].value);
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
  const { validations, module } = action;
  const state = yield select((state) => state);
  const fieldsNotValidated = Object.keys(state.get('register').toJS()[module]).reduce((notValidated, name) => {
    const field = state.get('register').toJS()[module][name];

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
  const values = Object.keys(state.get('register').toJS()[module]).reduce((vals, name) => {
    vals[name] = state.get('register').toJS()[module][name].value;
    return vals;
  }, {});
  yield put(setSubmitting());
  yield put(setSubmitted(values, module));
}

function* getProfileData(id) {
  try {
    const res = yield call(API.common.profile, id);
    if (res.result.status == 'success') {
      yield put(setCurrentUser(res.result.user));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}

function* handleAfterSubmit(action) {
  const { values, module } = action;
  try {
    values.loginType = 'normal';
    const auth = yield call(API.auth.register, values);
    if (auth.result && auth.result.status === 1) {
      yield put(clearSubmit());
      // yield call(handler);
      const rememberMe = yield select((state) => state.get('register').toJS().rememberMe);
      if (rememberMe) {
        setUser(auth.result.token, auth.result.user._id, auth.result.user.userType, true);
      } else {
        setUser(auth.result.token, auth.result.user._id, auth.result.user.userType);
      }
      if (auth.result.user && auth.result.user.userType == 'OWNER') {
        yield put(push('/gyms/register'));
      }
      else if (auth.result.user && auth.result.user.userType == 'TRAINER') {
        yield put(push('/trainer/register'));
      } 
      else {
        yield put(push(`/search/member/${auth.result.user._id}`));
      }
      yield put(submitSuccess(auth));
    } else {
      notificationOpts.message = ((auth.result && auth.result.message) || 'Please fill all mandatory fields');
      yield put(Notifications.error(notificationOpts));
      yield put(submitError(auth));
    }
  } catch (e) {
    console.log('e', e);
  }
}

function* login(action) {
  const { field } = action;
  const value = yield select((state) => {
    return state.get('register').get('fields');
  });
}

function* handleSocialSignup(action) {
  try {
    const { values } = action;
    const auth = yield call(API.auth.register, values);
    if (auth.result && auth.result.status === 1) {
      setUser(auth.result.token, auth.result.user._id, auth.result.user.userType);

      yield put(clearSubmit());
      if (auth.result.user && auth.result.user.userType == 'OWNER') {
        yield put(push('/gyms/register'));
      } 
      else if (auth.result.user && auth.result.user.userType == 'TRAINER') {
        yield put(push('/trainer/register'));
      } 
      else {
        yield put(push(`/search/${auth.result.user.userType}/${auth.result.user._id}`));
      }
    } else {
      notificationOpts.message = ((auth.result && auth.result.message) || 'Please fill all mandatory fields');
      yield put(Notifications.error(notificationOpts));
      yield put(submitError(auth));
    }
  } catch (e) {
    console.log('e', e);
  }
}

function* RegisterSaga() {
  yield fork(takeEvery, CHANGE_VALUE, login);
  yield fork(takeEvery, VALIDATE, handleValidate);
  yield fork(takeEvery, SOCIAL_SIGNUP, handleSocialSignup);
  yield fork(takeEvery, SUBMITTED, handleAfterSubmit);
  const watcher = yield takeEvery(SUBMIT, handleSubmit);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default RegisterSaga;
