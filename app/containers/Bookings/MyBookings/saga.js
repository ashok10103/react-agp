import { takeEvery, takeLatest } from "redux-saga";
import { put, select, fork, call, take, cancel } from "redux-saga/effects";
import { LOCATION_CHANGE, push } from "react-router-redux";
import Notifications from "react-notification-system-redux";
import API from "../../../utils/api";
import { getUserId } from "../../../utils/helper";

import { GET_BOOKINGS, GET_ALL_BOOKINGS, DELETE_BOOKINGS } from "./constants";

import { setBookings } from "./actions";
import { setCurrentUser } from "../../App/actions";
const notificationOpts = {
  message: "Welcome to Airgym",
  position: "tc",
  autoDismiss: 5
};
function* getBookings(action) {
  try {
    const { day, id } = action;
    const res = yield call(API.bookings.getBookingsAday, {
      userId: id,
      date: day
    });

    if (res.result) {
      yield put(setBookings(res.result));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}

function* getProfileData(id) {
  try {
    const res = yield call(API.common.getUser, id);
    if (res.result) {
      yield put(setCurrentUser(res.result));
    }
  } catch (e) {
    console.log(e);
  }
}

function* deleteBookings(action) {
  try {
    const { id, uId, day, clear } = action;
    const userId = getUserId();
    const res = yield call(API.bookings.cancelBookings, { bookingId: id });
    if (clear == true) {
      if (res.result.status == 1) {
        notificationOpts.message = 'Cancelled slots successfully';
        yield put(Notifications.success(notificationOpts));
        yield call(getProfileData, userId);
        yield call(getAllBookings, { id: uId });
      }
    } else {
      if (res.result.status == 1) {
        notificationOpts.message = 'Cancelled slots successfully';
        yield call(getProfileData, userId);
        yield put(Notifications.success(notificationOpts));
        yield call(getBookings, { day, id: userId });
      }
    }
  } catch (e) {}
}

function* getAllBookings(action) {
  try {
    const { id } = action;
    const res = yield call(API.bookings.getAllBookings, { userId: id });
    if (res.result) {
      yield put(setBookings(res.result.result));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}

function* BookingsListSaga() {
  yield fork(takeEvery, GET_BOOKINGS, getBookings);
  yield fork(takeEvery, GET_ALL_BOOKINGS, getAllBookings);
  yield fork(takeEvery, DELETE_BOOKINGS, deleteBookings);
}

export default BookingsListSaga;
