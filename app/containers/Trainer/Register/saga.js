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
  GET_SETTINGS
} from "./constants";

import {
  setInvalid,
  setValid,
  validate,
  moveToNext,
  setTrainerSettings
} from "./actions";
const notificationOpts = {
  message: ""
};

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
    state => state.get("TrainerRegister").toJS()["fields"][module][field].value
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
  const { validations, module, lat, long } = action;
  const state = yield select(state => state);
  const fieldsNotValidated = Object.keys(
    state.get("TrainerRegister").toJS()["fields"][module]
  ).reduce((notValidated, name) => {
    const field = state.get("TrainerRegister").toJS()["fields"][module][name];

    if (field.validated) {
      return notValidated;
    } else {
      return notValidated.concat(name);
    }
  }, []);
  if (fieldsNotValidated.length) {
    console.log("here");

    yield fieldsNotValidated.map(name =>
      put(validate(name, validations[name], module))
    );
  } else {
    const values = Object.keys(
      state.get("TrainerRegister").toJS()["fields"][module]
    ).reduce((vals, name) => {
      vals[name] = state.get("TrainerRegister").toJS()["fields"][module][
        name
      ].value;
      return vals;
    }, {});
    if (parseInt(module.split("field")[1]) === 2) {
      yield call(createTrainer, values, lat, long);
    } else {
      yield put(moveToNext("level", parseInt(module.split("field")[1]) + 1));
    }
  }
}

function* createTrainer(data, lat, long) {
  try {
    const state = yield select(state => state);
    let params = {};
    const fields = state.get("TrainerRegister").toJS()["fields"];
    Object.keys(fields).forEach(key => {
      params = { ...params, ...fields[key] };
    });
    const values = Object.keys(params).reduce((vals, name) => {
      vals[name] = params[name].value;
      return vals;
    }, {});

    values.latitude = lat;
    values.longitude = long;
    const response = yield call(API.trainers.createTrainers, values);
    if (response.result.trainer) {
      notificationOpts.message = "Trainer created Successfully";
      setUserState(`/search/trainer/${response.result.trainer._id}`);
      yield put(push(`/search/trainer/${response.result.trainer._id}`));
      yield put(Notifications.success(notificationOpts));
    } else {
      notificationOpts.message = "Trainer not created ";
      yield put(Notifications.error(notificationOpts));
    }
  } catch (e) {
    // console.log('e', e);
  }
}

function* fetchTrainerSettings(params) {
  const trainerSettings = yield call(API.common.trainerSettings);
  if (trainerSettings) {
    // yield call(handler);
    yield put(setTrainerSettings(trainerSettings.result));
  } else {
    notificationOpts.message = "No values";
    yield put(Notifications.error(notificationOpts));
    // yield put(submitError(auth));
  }
}

function* TrainerRegisterSaga() {
  yield fork(takeEvery, VALIDATE, handleValidate);
  yield fork(takeLatest, SUBMIT, handleSubmit);
  yield fork(takeEvery, GET_SETTINGS, fetchTrainerSettings);
}

export default TrainerRegisterSaga;
