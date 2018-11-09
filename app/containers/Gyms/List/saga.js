import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../../utils/api';


import {
  GET_GYM_LIST,
} from './constants';

import {
  setGymList,
} from './actions';

function* getGymData(data) {
  try {    
    const res = yield call(API.gyms.list, data.data);
    if (res.result.status == 1) {
      yield put(setGymList(res.result.data));
    }
  } catch (e) {
  
  }
}

function* GymListSaga() {
  yield fork(takeEvery, GET_GYM_LIST, getGymData);
}

export default GymListSaga;
