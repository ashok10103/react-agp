import { takeEvery, takeLatest } from "redux-saga";
import { put, select, fork, call, take, cancel } from "redux-saga/effects";
import { LOCATION_CHANGE, push } from "react-router-redux";
import Notifications from "react-notification-system-redux";
import API from "../../../utils/api";
import createValidator from "../../../utils/createValidator";
import { setUserState } from "../../../utils/helper";

import {
  CHANGE_VALUE,
  SUBMIT,
  SUBMITTED,
  VALIDATE,
  GET_SETTINGS,
  GYM_UPLOAD,
  GET_IMAGES,
  REMOVE_IMAGE
} from "./constants";

import {
  setValid,
  setInvalid,
  setSubmitting,
  setSubmitted,
  validate,
  submitSuccess,
  submitError,
  clearSubmit,
  setSettings,
  moveToNext,
  setImages
} from "./actions";

const notificationOpts = {
  message: "Welcome to Airgym",
  position: "tc",
  autoDismiss: 5
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
    state => state.get("GymRegister").toJS()["fields"][module][field].value
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
    state.get("GymRegister").toJS()["fields"][module]
  ).reduce((notValidated, name) => {
    const field = state.get("GymRegister").toJS()["fields"][module][name];

    if (field.validated) {
      return notValidated;
    } else {
      return notValidated.concat(name);
    }
  }, []);

  if (fieldsNotValidated.length) {
    yield fieldsNotValidated.map(name =>
      put(validate(name, validations[name], module))
    );
  } else {
    const values = Object.keys(
      state.get("GymRegister").toJS()["fields"][module]
    ).reduce((vals, name) => {
      vals[name] = state.get("GymRegister").toJS()["fields"][module][
        name
      ].value;
      return vals;
    }, {});
    if (parseInt(module.split("field")[1]) === 3) {
      yield call(createGyms, values, lat, long);
      // yield put(setSubmitted(values, module));
    } else {
      yield put(moveToNext("level", parseInt(module.split("field")[1]) + 1));
    }
  }
}

function* fetchGymSettings(data) {
  try {
    const settings = yield call(API.common.getSettings);
    if (settings) {
      // yield call(handler);
      yield put(setSettings(settings.result));
    } else {
      notificationOpts.message = "No values";
      yield put(Notifications.error(notificationOpts));
      // yield put(submitError(auth));
    }
  } catch (e) {
    console.log("e", e);
  }
}

function* getImagesGym(data) {
  try {
    const res = yield call(API.gyms.get, null, data.id);
    if (res.result.status == 1) {
      yield put(setImages(res.result.gym));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}

function* removeImagesGym(data) {
  try {
    const payload = {
      gymId: data.id,
      imageUrl: data.image
    };
    const res = yield call(API.gyms.removeImage, payload);
    if (res.result.status == 1) {
      // console.log(res.result);
      yield call(getImagesGym, { id: data.id });
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}

function* createGyms(data, lat, long) {
  try {
    const state = yield select(state => state);
    let params = {};
    const fields = state.get("GymRegister").toJS()["fields"];
    Object.keys(fields).forEach(key => {
      params = { ...params, ...fields[key] };
    });
    const values = Object.keys(params).reduce((vals, name) => {
      vals[name] = params[name].value;
      return vals;
    }, {});

    values.latitude = lat;
    values.longitude = long;
    values.currency = "USD";
    const response = yield call(API.gyms.createGym, values);

    if (response.result.status) {
      notificationOpts.message = "Gym created Successfully";
      setUserState(`/gyms/upload/${response.result.data._id}`);
      yield put(push(`/gyms/upload/${response.result.data._id}`));
      yield put(Notifications.success(notificationOpts));
    } else {
      notificationOpts.message = "Gym not created ";
      yield put(Notifications.error(notificationOpts));
    }
  } catch (e) {
    console.log("e", e);
  }
}

function* handleUpload(action) {
  try {
    const { id, file } = action;
    if (file) {
      const data = {
        file,
        gymId: id
      };
      const imageUpload = yield call(API.gyms.uploadGymImage, data);
      if (imageUpload && imageUpload.status === 1) {
        notificationOpts.message =
          (imageUpload && imageUpload.message) || "User details updated";
        yield put(Notifications.success(notificationOpts));
        yield call(getImagesGym, { id });
      } else {
        yield put(submitError(auth));
      }
    }
  } catch (e) {
    console.log("e", e);
  }
}

function* GymRegisterSaga() {
  yield fork(takeEvery, VALIDATE, handleValidate);
  yield fork(takeEvery, GET_SETTINGS, fetchGymSettings);
  yield fork(takeEvery, GYM_UPLOAD, handleUpload);
  yield fork(takeEvery, GET_IMAGES, getImagesGym);
  yield fork(takeLatest, SUBMIT, handleSubmit);
  yield fork(takeLatest, REMOVE_IMAGE, removeImagesGym);
}

export default GymRegisterSaga;
