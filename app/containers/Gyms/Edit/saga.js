import { put, select, fork, call, take, cancel } from 'redux-saga/effects';

import { takeEvery, takeLatest } from 'redux-saga';
import createValidator from '../../../utils/createValidator';
import Notifications from 'react-notification-system-redux';
import API from '../../../utils/api';
import {
  GET_API_TO_EDIT, VALIDATE, SUBMIT, GET_SETTINGS, GYM_UPLOAD, REMOVE_IMAGE
} from './constants';
import {
  setGymEdit, setValid,
  setInvalid, validate, setSettings,
} from './actions';

const notificationOpts = {
  message: '',

};

function* handleValidate(action) {
  const { validation, field } = action;
  if (Array.isArray(validation)) {
    yield validation.map((v) => call(handleValidate, {
      ...action,
      validation: v,
    }));
    return;
  }
  const validator = yield call(createValidator, validation);
  const value = yield select((state) => state.get('gymEdit').toJS()['fields'][field].value);
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
  const state = yield select((state) => state);
  const fieldsNotValidated = Object.keys(state.get('gymEdit').toJS()['fields']).reduce((notValidated, name) => {
    const field = state.get('gymEdit').toJS()['fields'][name];


    if (field.validated) {

      return notValidated;
    } else {
      return notValidated.concat(name);
    }
  }, []);
  if (fieldsNotValidated.length) {


    yield fieldsNotValidated.map(
      (name) => put(validate(name, validations[name])));
  } else {

    const values = Object.keys(state.get('gymEdit').toJS()['fields']).reduce((vals, name) => {
      vals[name] = state.get('gymEdit').toJS()['fields'][name].value;
      return vals;
    }, {});
    const settings = yield call(API.gyms.editGym, values, id);
    if (settings) {
      notificationOpts.message = 'Successfully updated details !';
      yield put(Notifications.success(notificationOpts));
      yield call(editGymData, { id: id });
    } else {
      notificationOpts.message = 'No values';
      yield put(Notifications.error(notificationOpts));

    }
  }

}
function* handleSettings(action) {
  try {
    const settings = yield call(API.common.getSettings);

    if (settings) {
      yield put(setSettings(settings.result));
    } else {
      notificationOpts.message = 'No values';
      yield put(Notifications.error(notificationOpts));

    }
  } catch (e) {
    console.log('e', e);
  }
}


function* handleUpload(action) {
  try {
    const { id, file } = action;
    if (file) {
      const data = {
        file,
        gymId: id,
      }
      const imageUpload = yield call(API.gyms.uploadGymImage, data);
      if (imageUpload && imageUpload.status === 1) {
        notificationOpts.message = ((imageUpload && imageUpload.message) || 'image uploaded successfully');
        yield put(Notifications.success(notificationOpts));
        yield call(editGymData, { id: id });
      } else {

        // yield put(submitError(auth));
      }
    }

  } catch (e) {
    // console.log('e', e);
  }
}

function* removeImagesGym(data) {
  try {
    const payload = {
      gymId: data.id,
      imageUrl: data.image
    }
    const res = yield call(API.gyms.removeImage, payload);
    if (res.result.status == 1) {
      yield call(editGymData, { id: payload.gymId });
      notificationOpts.message = ('image deleted successfully');
      yield put(Notifications.success(notificationOpts));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}


function* editGymData(action) {
  const { id } = action;
  try {
    const res = yield call(API.gyms.get, null, id);
    if (res.result.status == 1) {
      const data = res.result.gym;
      yield put(setGymEdit(data));
    }
  } catch (e) {
    notificationOpts.title = e.err;
    notificationOpts.message = e.message;
    yield put(Notifications.error(notificationOpts));
  }
}

function* GymEditSaga() {
  yield fork(takeEvery, GET_API_TO_EDIT, editGymData);
  yield fork(takeEvery, VALIDATE, handleValidate);
  yield fork(takeLatest, SUBMIT, handleSubmit);
  yield fork(takeLatest, GET_SETTINGS, handleSettings);
  yield fork(takeEvery, GYM_UPLOAD, handleUpload);
  yield fork(takeLatest, REMOVE_IMAGE, removeImagesGym);

}

export default GymEditSaga;
