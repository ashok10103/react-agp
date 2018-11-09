



import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../../utils/api';



import {
  GET_GYM_DETAIL, SEND_STAR,SEND_REPORT,
  GET_RATING_LIST
} from './constants';

import {
  setGymDetail,reviewDetail
} from './actions';



const notificationOpts = {
  message: '',

};



function* getGymData(data, id) {
  try {    
    const res = yield call(API.gyms.get, data.data, data.id);
    if (res.result.status == 1) {
      yield put(setGymDetail(res.result.gym));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}

function* sendReviewListSaga(action) {
  try {
    const pageNo = action.pageNo
    const limit = pageNo * 10;
    const skip = (pageNo - 1) * 10;

   
    const res = yield call(API.gyms.reviewlist,action.gymId,limit,skip);
    if (res.result.status == 1) {
      yield put(reviewDetail(res.result.data,res.result.count));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}


function* sendReportSaga(action) {
  try {
    const state = yield select((state) => state);
    const field = state.get('gymDetail').toJS()['report']
    const res = yield call(API.gyms.report,field);
    if (res.result.status == 1) {
     
    notificationOpts.message =" Added your report successfully";
    yield put(Notifications.success(notificationOpts));
    yield call(action.handler)
     
    }
  } catch (e) {
    notificationOpts.title = e.err;
    notificationOpts.message = e.message;
    yield put(Notifications.error(notificationOpts));
  }
}




function* sendNewStarData(action) {
  const data = { gymId: action.id, rating: action.newRate,comment:action.feedback }

  try {
    const res = yield call(API.gyms.createStarRating, data);
    if (res.result.status == 1) {
      notificationOpts.message = "Successfully added your rating";
      yield put(Notifications.success(notificationOpts));
    }
  } catch (e) {
    // notificationOpt s.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}

function* GymListSaga() {
  yield fork(takeEvery, GET_GYM_DETAIL, getGymData);
  yield fork(takeEvery, SEND_STAR, sendNewStarData);
  yield fork(takeEvery, SEND_REPORT, sendReportSaga);
  yield fork(takeEvery, GET_RATING_LIST, sendReviewListSaga);

  
}

export default GymListSaga;
