import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../../utils/api';
import { GET_NOTIFICATIONS } from './constants';

import {
  setNotifications
} from './actions';


function* getNotifications(action) {
  console.log('res...,called.')
    try {        
      const {id} = action

      const res = yield call(API.notifications.getAllNotifications, {toUserId: id});
      
      if (res.result) {
        yield put(setNotifications(res.result));
      }
    } catch (e) {
      // notificationOpts.title = e.err;
      // notificationOpts.message = e.message;
      // yield put(Notifications.error(notificationOpts));
    }
  }

function* NotificationListSaga() {
    yield fork(takeEvery, GET_NOTIFICATIONS, getNotifications);
}

export default NotificationListSaga;
