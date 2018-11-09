import { takeEvery, takeLatest } from "redux-saga";
import { put, select, fork, call, take, cancel } from "redux-saga/effects";
import { LOCATION_CHANGE, push } from "react-router-redux";
import Notifications from "react-notification-system-redux";
import API from "../../utils/api";
import createValidator from "../../utils/createValidator";
import { setUser, userJWTData } from "../../utils/helper";

import { GET_SHARE_DATA } from "./constants";

import { getShareData, setData } from "./actions";

import { setCurrentUser } from "../App/actions";
import { load } from "react-cookies";

const notificationOpts = {
  message: "Welcome to Airgym",
  position: "tc",
  autoDismiss: 5
};

function* handleShare(action) {
  const { id } = action;
  try {
    const res = yield call(API.common.getShare, id);
    if (res.result) {
      yield put(
        setData(res.result.gym, res.result.maxCount, res.result.schedules)
      );
    }
  } catch (e) {
    notificationOpts.title = e.err;
    notificationOpts.message = e.message;
    yield put(Notifications.error(notificationOpts));
  }
}

function* RegisterSaga() {
  yield fork(takeEvery, GET_SHARE_DATA, handleShare);
}

export default RegisterSaga;
