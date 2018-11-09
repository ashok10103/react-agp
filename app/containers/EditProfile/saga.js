import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../utils/api';
import createValidator from '../../utils/createValidator';
import { setUser, userJWTData } from '../../utils/helper';


import {
  UPDATE_USER,VALIDATE,GET_USER_DATA
} from './constants';

import {
  setValid,
  setInvalid,
  setSubmitting,
  setSubmitted,
  validate,
  submitSuccess,
  submitError,
  setUserDetails,
  clearSubmit,
  socialSignup,
} from './actions';

import {
  setCurrentUser
} from '../App/actions'
import { load } from 'react-cookies';

const notificationOpts = {
  message: 'Welcome to Airgym',
  position: 'tc',
  autoDismiss: 5,
};

function* handleValidate(action) {
  const { validation, field } = action;
  if (Array.isArray(validation)) {
    yield validation.map((v) => call(handleValidate, {
      ...action,
      validation: v,
    }));
    return;
  }
  const validator = yield call(createValidator, validation);
  const value = yield select((state) => state.get('EditProfile').toJS()['fields'][field].value);
  try {
    const valid = yield call(validator.test, value);
    const error = validator.report(value);
    if (valid) {
      yield put(setValid(field, error));
    } else {
      yield put(setInvalid(field, error));
    }
  } catch (e) {
    // console.log(e);
  }
}


function* getProfileData(id) {  
  try {
    const res = yield call(API.common.getUser, id);    
    if (res.result) {
      yield put(setCurrentUser(res.result));
      yield put(setUserDetails(res.result));
    }
  } catch (e) {
    console.log(e);
  }
}

function* handleUpdateUser(action) {
  try {
    const { user, id, file, handler,validations } = action;

    const state = yield select((state) => state);
  const fieldsNotValidated = Object.keys(state.get('EditProfile').toJS()['fields']).reduce((notValidated, name) => {
    const field = state.get('EditProfile').toJS()['fields'][name];

    if (field.validated) {

      return notValidated;
    } else {
      return notValidated.concat(name);
    }
  }, []);
  if (fieldsNotValidated.length) {


    yield fieldsNotValidated.map(
      (name) => put(validate(name, validations[name])));
  } else {

    const values = Object.keys(state.get('EditProfile').toJS()['fields']).reduce((vals, name) => {
      vals[name] = state.get('EditProfile').toJS()['fields'][name].value;
      return vals;
    }, {});
    const response = yield call(API.common.updateUser, values, id); 
    if(file) {      
      const data = {
        file,
        userId: id,
      }
      const imageUpload = yield call(API.common.imageUpload, data);  
    }
 
    
    
    if (response.result && response.result.status === 1) {
      notificationOpts.message = ((response.result && response.result.message) || 'Updated user profile successfully'); 
      yield put(Notifications.success(notificationOpts));
      yield call(getProfileData, id)
      yield call(handler);
    } else {

      yield put(submitError(auth));
   
     }
  }

   
  } catch (e) {
    console.log('e', e);
  }
}

function* editProfileData(action) {
  const { id } = action;
  try {
    yield call(getProfileData, id)
  } catch (e) {
    notificationOpts.title = e.err;
    notificationOpts.message = e.message;
    yield put(Notifications.error(notificationOpts));
  }
}


function* RegisterSaga() {
  yield fork(takeEvery, UPDATE_USER, handleUpdateUser);
  yield fork(takeEvery, VALIDATE, handleValidate);
  yield fork(takeEvery, GET_USER_DATA, editProfileData);
}

export default RegisterSaga;
