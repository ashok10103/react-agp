import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../../../utils/api';


import {
  GET_BOOKINGS
} from './constants';

import {
  setBookings
} from './actions';

function* getBookings(action) {
  try {        
    const {day, id} = action
    const res = yield call(API.bookings.getOwnerBookings, {gymId: id, date:day});
    
    if (res.result) {
      yield put(setBookings(res.result));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}

function* GymBookingsListSaga() {
  yield fork(takeEvery, GET_BOOKINGS, getBookings);
}

export default GymBookingsListSaga;
