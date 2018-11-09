import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../../utils/api';


import {
  GET_TRAINER_DETAIL, SEND_STAR
} from './constants';

import {
  setTrainerDetail,
} from './actions';
const notificationOpts = {
  message: '',

};

function* getGymData(action) {
  try {
    const res = yield call(API.trainers.get, action.data, action.id);
    if (res.result) {
      yield put(setTrainerDetail(res.result));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}




function* sendNewStarData(action) {
  const data = { trainerId: action.id, rating: action.newRate }
  try {
    const res = yield call(API.gyms.createStarRating, data);
    if (res.result.status == 1) {
      notificationOpts.message = "Successfully added your rating";
      yield put(Notifications.success(notificationOpts));
      yield call(getGymData, { id: action.id })
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}


function* GymListSaga() {
  yield fork(takeEvery, GET_TRAINER_DETAIL, getGymData);
  yield fork(takeEvery, SEND_STAR, sendNewStarData);
}

export default GymListSaga;
