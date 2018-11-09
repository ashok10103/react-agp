import { takeEvery, takeLatest } from "redux-saga";
import { put, select, fork, call, take, cancel } from "redux-saga/effects";
import { LOCATION_CHANGE, push } from "react-router-redux";

import API from "../../../utils/api";
import createValidator from "../../../utils/createValidator";
import { setUserState } from "../../../utils/helper";
import Notifications from "react-notification-system-redux";
import {
  SET_VALID,
  SET_INVALID,
  SUBMIT,
  VALIDATE,
  GET_SETTINGS,
  GET_API_TO_EDIT
} from "./constants";

import {
  setInvalid,
  setValid,
  validate,
  setTrainerSettings,
  setTrainerEdit
} from "./actions";
const notificationOpts = {
  message: ""
};

function* handleValidate(action) {
  const { validation, field } = action;
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
    state => state.get("TrainerEdit").toJS()["fields"][field].value
  );
  try {
    const valid = yield call(validator.test, value);
    const error = validator.report(value);
    if (valid) {
      yield put(setValid(field, error));
    } else {
      yield put(setInvalid(field, error));
    }
  } catch (e) {
    // console.log(e);
  }
}

function* handleSubmit(action) {
  const { validations, field, id } = action;
  const state = yield select(state => state);
  const fieldsNotValidated = Object.keys(
    state.get("TrainerEdit").toJS()["fields"]
  ).reduce((notValidated, name) => {
    const field = state.get("TrainerEdit").toJS()["fields"][name];

    if (field.validated) {
      return notValidated;
    } else {
      return notValidated.concat(name);
    }
  }, []);

  if (fieldsNotValidated.length) {
    yield fieldsNotValidated.map(name =>
      put(validate(name, validations[name]))
    );
  } else {
    const values = Object.keys(
      state.get("TrainerEdit").toJS()["fields"]
    ).reduce((vals, name) => {
      vals[name] = state.get("TrainerEdit").toJS()["fields"][name].value;
      return vals;
    }, {});

    const settings = yield call(API.trainers.editTrainer, values, id);
    if (settings) {
      notificationOpts.message = "Updated details successfully!";
      yield put(Notifications.success(notificationOpts));
      yield call(editTrainerData, { id: id });
    } else {
      notificationOpts.message = "No values";
      yield put(Notifications.error(notificationOpts));
    }
  }
}

function* editTrainerData(action) {
  const { id } = action;
  try {
    const res = yield call(API.trainers.get, null, id);
    if (res.result) {
      const data = res.result;
      yield put(setTrainerEdit(data));
    }
  } catch (e) {
    notificationOpts.title = e.err;
    notificationOpts.message = e.message;
    yield put(Notifications.error(notificationOpts));
  }
}

function* TrainerEditSaga() {
  yield fork(takeEvery, VALIDATE, handleValidate);
  yield fork(takeLatest, SUBMIT, handleSubmit);
  yield fork(takeEvery, GET_API_TO_EDIT, editTrainerData);
}

export default TrainerEditSaga;
