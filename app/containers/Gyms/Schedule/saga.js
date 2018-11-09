import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../../utils/api';


import {
  GET_GYM_DETAIL,
  SAVE_SCHEDULE,
  GET_SCHEDULE
} from './constants';

import {
  saveSchedule, setSchedule,
} from './actions';
const notificationOpts = {
  message: 'Welcome to Airgym',
  position: 'tc',
  autoDismiss: 5,
};
function* getSchedules(action) {
  try {
    const { id } = action
    const res = yield call(API.gyms.fetchTimeSlots, { gymId: id });

    if (res.result.status == 1) {
      yield put(setSchedule(res.result.result));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}

function* saveScheduleGym(action) {
  try {
    const { id } = action;
    const state = yield select((state) => state);
    const data = state.get('gymSchedule').toJS()['schedules'];
    const params = {
      timeSlots: data,
      gymId: id
    }

    const res = yield call(API.gyms.addSchedule, params);
    if (res.result.status) {
      // yield put(setGymDetail(res.result.gym));
      notificationOpts.message = 'Added schedule successfully'
      yield put(Notifications.success(notificationOpts));
    }
  } catch (e) {
    console.log(e);

    notificationOpts.title = e.err;
    notificationOpts.message = 'Couldnt add schedules';
    yield put(Notifications.error(notificationOpts));
  }
}


function* GymScheduleSaga() {
  // yield fork(takeEvery, GET_GYM_DETAIL, getGymData);
  yield fork(takeEvery, SAVE_SCHEDULE, saveScheduleGym);
  yield fork(takeEvery, GET_SCHEDULE, getSchedules);
}

export default GymScheduleSaga;
