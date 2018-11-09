import { takeEvery, takeLatest } from "redux-saga";
import { put, select, fork, call, take, cancel, all } from "redux-saga/effects";
import { LOCATION_CHANGE } from "react-router-redux";
import { push } from "react-router-redux";
import Notifications from "react-notification-system-redux";

import { SEND_TOKEN } from "./constants";

import { setMessage } from "./actions";

import { browserHistory } from "react-router";
import createValidator from "../../utils/createValidator";
import { setUser, userJWTData } from "../../utils/helper";
import API from "../../utils/api";

function* handleSubmit(action) {
  const { value } = action;
  const res = yield call(API.auth.verify, value);
}

function* adminLoginSaga() {
  yield fork(takeEvery, SEND_TOKEN, handleSubmit);
}

export default adminLoginSaga;
