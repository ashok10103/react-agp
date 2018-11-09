import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../utils/api';
import { getUserId } from '../../utils/helper';

import createValidator from 'utils/createValidator';

import { LOAD_USER, GET_CURRNT_USER, GET_SETTINGS } from './constants';
import { setCurrentUser, setAppCompany, setSettings, setTrainerSettings } from './actions';

const notificationOpts = {
  title: '',
  message: '',
  position: 'tc',
  autoDismiss: 5,
};

function* getProfileData(action) {
  try {    
    const id = getUserId();
    const res = yield call(API.common.getUser, id);    
    if (res.result) {      
      yield put(setCurrentUser(res.result));
    }
  } catch (e) {
    notificationOpts.title = e.err;
    notificationOpts.message = e.message;
    yield put(Notifications.error(notificationOpts));
  }
}
function* fetchTrainerSettings(params) {
  const trainerSettings = yield call(API.common.trainerSettings)
  if (trainerSettings) {
    // yield call(handler);
    yield put(setTrainerSettings(trainerSettings.result));
  } else {
    notificationOpts.message = 'No values';
    yield put(Notifications.error(notificationOpts));
    // yield put(submitError(auth));
  } 
}
function* fetchGymSettings() {
  try {
    const trainer_settings = yield call(fetchTrainerSettings);
    const settings = yield call(API.common.getSettings);
    if (settings) {
      // yield call(handler);
      yield put(setSettings(settings.result));
    } else {
      notificationOpts.message = 'No values';
      yield put(Notifications.error(notificationOpts));
      // yield put(submitError(auth));
    }
  } catch (e) {
    console.log('e', e);
  }
}

export function* appSaga() {
  yield fork(takeEvery, GET_CURRNT_USER, getProfileData);
  yield fork(takeEvery, GET_SETTINGS, fetchGymSettings);
}

export default appSaga;
