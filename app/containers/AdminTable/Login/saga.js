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
import { setUser, userJWTData } from "../../../utils/helper";
import API from "../../../utils/api";

import { SUBMIT, VALIDATE } from "./constants";

import { setValid, setInvalid, validate } from "./actions";

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
    state => state.toJS().AdminLogin.fields[field].value
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
    console.log(e);
  }
}

function* handleSubmit(action) {
  const { validations, token } = action;
  const state = yield select(state => state);
  const fieldsNotValidated = Object.keys(state.toJS().AdminLogin.fields).reduce(
    (notValidated, name) => {
      const field = state.toJS().AdminLogin.fields[name];
      if (field.validated) {
        return notValidated;
      } else {
        return notValidated.concat(name);
      }
    },
    []
  );
  if (fieldsNotValidated.length) {
    yield fieldsNotValidated.map(name =>
      put(validate(name, validations[name]))
    );
  } else {
    const values = Object.keys(state.toJS().AdminLogin.fields).reduce(
      (vals, name) => {
        vals[name] = state.toJS().AdminLogin.fields[name].value;

        return vals;
      },
      {}
    );
    values["userType"] = "ADMIN";
    const auth = yield call(API.auth.login, values);
    if (auth.result.status == 1) {
      setUser(
        auth.result.token,
        auth.result.user._id,
        auth.result.user.userType,
        true
      );
      return yield put(push(`/admin/list`));
    }
  }
}

function* adminLoginSaga() {
  yield fork(takeEvery, VALIDATE, handleValidate);
  yield fork(takeEvery, SUBMIT, handleSubmit);
}

export default adminLoginSaga;
