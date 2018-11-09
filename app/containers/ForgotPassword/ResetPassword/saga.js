import { takeEvery, takeLatest } from 'redux-saga';
import {
    put,
    select,
    fork,
    call,
    take,
    cancel,
    all
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import {
    isNull,
    isEmpty,
    omitBy,
    omit,
    isUndefined,
    forEach,
    remove
} from 'lodash';
import { browserHistory } from 'react-router';
import createValidator from '../../../utils/createValidator';
import API from '../../../utils/api';
import { SUBMIT, VALIDATE, SUBMITTED, GET_COMPANY } from './constants';

import {
    setProducts,
    submitError,
    setValid,
    setInvalid,
    validate,
    setSubmitting,
    setSubmitted,
    clearFormFields,
    setCompany
} from './actions';
import { getCompany } from './selectors';

const notificationOpts = {
    title: 'Data Fetched',
    message: 'Welcome to Aumet',
    position: 'tc',
    autoDismiss: 5
};

function* handleValidate(action) {
    const { validation, field } = action;
    if (Array.isArray(validation)) {
        yield validation.map((v) => call(handleValidate, {
            ...action,
            validation: v
        }));
        return;
    }

    const validator = yield call(createValidator, validation);
    const value = yield select((state) => state.toJS().ResetPassword.fields[field].value);

    try {
        const valid = yield call(validator.test, value);
        const error = validator.report(value);
        if (valid) {

            yield put(setValid(field, error));
        } else {
            yield put(submitError(error));
            yield put(setInvalid(field, error));
        }
    } catch (e) {
        // Async error
        console.log(e);
    }
}

function* handleSubmit(action) {
    const { validations, token } = action;
    const state = yield select((state) => state);
    const fieldsNotValidated = Object
        .keys(state.toJS().ResetPassword.fields)
        .reduce((notValidated, name) => {
            const field = state
                .toJS()
                .ResetPassword
                .fields[name];

            if (field.validated) {
                return notValidated;
            } else {
                return notValidated.concat(name);
            }
        }, []);
    if (fieldsNotValidated.length) {
        yield fieldsNotValidated.map((name) => put(validate(name, validations[name])));
    } else {
        const values = Object
            .keys(state.toJS().ResetPassword.fields)
            .reduce((vals, name) => {
                vals[name] = state
                    .toJS()
                    .ResetPassword
                    .fields[name]
                    .value;

                return vals;
            }, {});

        yield put(setSubmitting());
        yield put(setSubmitted(values, token));
    }
}

function* handleAfterSubmit(action) {
    const { values, token } = action;
    const payload = {
        token,
        newPassword: values.password,
        verifyPassword: values.cpassword
    };
    try {
        const result = yield call(API.common.resetPassword, payload);

        if (result && result.result.status === 1) {
            notificationOpts.title = 'Success';
            notificationOpts.message = 'Password updated successfully';
            yield put(Notifications.success(notificationOpts));
            yield put(push('/'));
            yield put(clearFormFields());
        } else {
            notificationOpts.title = 'Failure';
            notificationOpts.message = result.result.message;
            yield put(Notifications.error(notificationOpts));
        }
    } catch (err) {
        yield put(submitError(err));
    }
}

function* resetPasswordSaga() {
    yield fork(takeEvery, VALIDATE, handleValidate);
    const watchSUBMIT = yield takeLatest(SUBMIT, handleSubmit);
    const watcher = yield takeLatest(SUBMITTED, handleAfterSubmit);
    yield take(LOCATION_CHANGE);
    yield cancel(watcher);
    yield cancel(watchSUBMIT);
}

export default resetPasswordSaga;
