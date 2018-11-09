import { takeEvery, takeLatest } from "redux-saga";
import { put, select, fork, call, take, cancel } from "redux-saga/effects";
import { LOCATION_CHANGE, push } from "react-router-redux";
import Notifications from "react-notification-system-redux";

import API from "../../../utils/api";
import createValidator from "../../../utils/createValidator";

import { CHANGE_VALUE, SUBMIT, VALIDATE } from "./constants";

const notificationOpts = {
  message: "Welcome to Airgym",
  position: "tc",
  autoDismiss: 5
};
import { setValid, setInvalid, validate } from "./actions";

function* handleValidate(action) {
  const { validation, field, module } = action;
  if (Array.isArray(validation)) {
    yield validation.map(v =>
      call(handleValidate, {
        ...action,
        validation: v
      })
    );
    return;
  }

  const validator = yield call(createValidator, validation);
  const value = yield select(
    state => state.get("AddUsername").toJS()[module][field].value
  );
  try {
    const valid = yield call(validator.test, value);
    const error = validator.report(value);
    if (valid) {
      yield put(setValid(field, error, module));
    } else {
      yield put(setInvalid(field, error, module));
    }
  } catch (e) {
    // console.log(e);
  }
}

function* handleSubmit(action) {
  const { validations, value, module, userType } = action;
  const state = yield select(state => state);
  const emailId = state.get("AddUsername").toJS()["fields"]["email"].value;
  const payload = {
    emailId,
    userType: userType
  };
  try {
    const result = yield call(API.common.forgotPassword, payload);
    if (result && result.result.status === 1) {
      notificationOpts.title = "Success";
      notificationOpts.message =
        "An email has been send to you. Please check the mail to continue";
      yield put(Notifications.success(notificationOpts));
      yield put(push("/"));
      yield put(clearFormFields());
    } else {
      notificationOpts.title = "Failed";
      notificationOpts.message = result.result.message;
      yield put(Notifications.error(notificationOpts));
    }
  } catch (err) {
    yield put(submitError(err));
  }
}

function* AddUsernameSaga() {
  yield fork(takeEvery, VALIDATE, handleValidate);
  yield fork(takeLatest, SUBMIT, handleSubmit);
}

export default AddUsernameSaga;
