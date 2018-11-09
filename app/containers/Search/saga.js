import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../utils/api';
import createValidator from '../../utils/createValidator';
import { setUser, userJWTData, getMeters } from '../../utils/helper';


import {
  GET_GYMS,
  GET_TRAINERS,
  SET_GYMS,
} from './constants';

import {
  setGyms,
  setTrainers,
  setTotalCount,
  setPageNumber
} from './actions';

import {
  setCurrentUser
} from '../App/actions'

const notificationOpts = {
  message: 'Welcome to Airgym',
  position: 'tc',
  autoDismiss: 5,
};

function* getGymsList({ data, limit, loadMore }) {

  try {
    const payload = yield select((state) => {
      return state.get('search').get('filters');
    });
    const pageNumber = yield select((state) => {
      return state.get('search').get('pageNumber');
    });
    const count = yield select((state) => {
      return state.get('search').get('count');
    });
    payload.limit = pageNumber * 10;
    payload.offset = (pageNumber - 1) * 10;
    const distance = payload.distanceValue
    const params = payload;
    params.distance = getMeters(distance);    
    const res = yield call(API.gyms.list, params);

    if (res.result && res.result.status) {
      let morePage = true
      if(pageNumber ===1 ) {
        morePage = false
      }
      yield put(setGyms(res.result.data, morePage));
      yield put(setPageNumber(pageNumber + 1))

      yield put(setTotalCount(res.result.count))
    }
  } catch (e) {
    console.log(e);
  }
}

function* getTrainersList({ data, limit, loadMore }) {
  try {
    const payload = yield select((state) => {
      return state.get('search').get('filters');
    });
    const pageNumber = yield select((state) => {
      return state.get('search').get('pageNumber');
    });
    const count = yield select((state) => {
      return state.get('search').get('count');
    });
    payload.limit = pageNumber * 10;
    payload.offset = (pageNumber - 1) * 10;
    const distance = payload.distanceValue
    const params = payload;
    params.distance = getMeters(distance);    
    const res = yield call(API.trainers.list, params);
    if (res.result && res.result.status) {
      let morePage = true
      yield put(setTrainers(res.result.data, morePage));
      yield put(setTotalCount(res.result.count))
      yield put(setPageNumber(pageNumber + 1))
    }
  } catch (e) {
    console.log(e);
  }
}

function* RegisterSaga() {
  yield fork(takeLatest, GET_GYMS, getGymsList);
  yield fork(takeLatest, GET_TRAINERS, getTrainersList);
}

export default RegisterSaga;
