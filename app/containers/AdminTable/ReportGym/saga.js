import { takeEvery, takeLatest } from "redux-saga";
import { put, select, fork, call, take, cancel, all } from "redux-saga/effects";
import { LOCATION_CHANGE } from "react-router-redux";
import { push } from "react-router-redux";
import Notifications from "react-notification-system-redux";
import { setCurrentUser } from "../../App/actions";
import {
  isNull,
  isEmpty,
  omitBy,
  omit,
  isUndefined,
  forEach,
  remove
} from "lodash";
import { browserHistory } from "react-router";
import createValidator from "../../../utils/createValidator";
import API from "../../../utils/api";

import { GET_COMPLAINT_GYMS } from "./constants";

import { setGymData } from "./actions";

function* handleGetComplaintGym(action) {
  try {
    const pageNo = action.pageNumber;
    const limit = pageNo * 10;
    const skip = (pageNo - 1) * 10;
    const res = yield call(API.admin.report, limit, skip);
    if (res.result.status == 1) {
      const data = res.result.reports;
      const count = res.result.count;
      yield put(setGymData(data, count));
    }
  } catch (e) {
    console.log(e);
  }
}

function* ReportGymSaga() {
  yield fork(takeEvery, GET_COMPLAINT_GYMS, handleGetComplaintGym);
}

export default ReportGymSaga;
