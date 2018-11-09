import { takeEvery, takeLatest } from "redux-saga";
import { put, select, fork, call, take, cancel } from "redux-saga/effects";
import { LOCATION_CHANGE, push } from "react-router-redux";
import Notifications from "react-notification-system-redux";
import moment from "moment";
import API from "../../utils/api";
import config from "../../utils/config/development";
import createValidator from "../../utils/createValidator";

import {
  VALIDATE,
  SUBMIT,
  GET_BANK_DETAILS,
  CREATE_ACCOUNT,
  GET_ACCOUNT,
  SUBMIT_DOCUMENT
} from "./constants";

import {
  setValid,
  setInvalid,
  validate,
  setBankDetails,
  setToken,
  submitDocuments,
  setUploadDocument
} from "./actions";

const notificationOpts = {
  message: "Welcome to Airgym",
  position: "tc",
  autoDismiss: 5
};

function* handleSubmit(action) {
  try {
    const { validations, handler, module } = action;
    const state = yield select(state => state);
    const fieldsNotValidated = Object.keys(
      state.get("CreateAccount").toJS()[module]
    ).reduce((notValidated, name) => {
      const field = state.get("CreateAccount").toJS()[module][name];

      if (field.validated) {
        return notValidated;
      } else {
        return notValidated.concat(name);
      }
    }, []);
    if (fieldsNotValidated.length) {
      yield fieldsNotValidated.map(name => {
        return put(validate(name, validations[name], module));
      });
    } else {
      yield call(handler);
    }
  } catch (e) {
    console.log(e);
  }
}

async function* getStripeToken(action) {
  const { values } = action;
  const stripe = Stripe(config.stripeKey);
  const token = await getStripeTokenApi(values);
  if (token) {
    yield put(setToken(token.token));
  }
}

function* addAccountDetails(action) {
  const { token } = action;
  try {
    const res = yield call(API.account.addBankAccount, { token: token.id });
    if (res.result) {
      notificationOpts.message = "Account Details added successfully";
      yield put(Notifications.success(notificationOpts));
      yield call(getBankDetails);
    }
  } catch (e) {
    console.log(e);
  }
}

function getStripeTokenApi(values) {
  const stripe = Stripe(config.stripeKey);
  return new Promise((resolve, reject) => {
    return stripe
      .createToken("bank_account", {
        country: values.country,
        currency: values.currency,
        account_holder_name: values.acName,
        account_holder_type: values.acType,
        routing_number: values.routingNumber,
        account_number: values.acNumber
      })
      .then(token => {
        resolve(token);
      });
  });
}
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
    state => state.get("CreateAccount").toJS()[module][field].value
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

function* getBankDetails() {
  try {
    const res = yield call(API.account.getBankDetails);
    if (res.result && res.result.data) {
      yield put(setBankDetails(res.result.data));
    }
  } catch (e) {
    console.log(e);
  }
}

function* submitDocumentsSaga(action) {
  try {
    const { handle, changedFields, handler } = action;
    console.log(changedFields);

    let imageUpload1;
    let imageUpload2;

    const state = yield select(state => state);
    const values = Object.keys(
      state.get("CreateAccount").toJS()["bank_fields"]
    ).reduce((vals, name) => {
      vals[name] = state.get("CreateAccount").toJS()["bank_fields"][name].value;
      return vals;
    }, {});
    values.type = values.businessTaxId ? "company" : "individual";

   Object.keys(values).forEach(key => {     
      if (changedFields.indexOf(key) === -1 && key !== 'type' ) delete values[key];
    });
    if (values.dob) {
      values.dob = moment(values.dob).format("DD-MM-YYYY");
    }

    const documentExist = state.get("CreateAccount").toJS()["document"];
    const documentBackExist = state.get("CreateAccount").toJS()[
      "document_back"
    ];

    if (values.document && !documentExist) {
      imageUpload1 = yield call(API.account.uploadDocument, {
        documentType: "document",
        file: values.document
      });
    }
    if (values.document_back && !documentBackExist) {
      imageUpload2 = yield call(API.account.uploadDocument, {
        documentType: "document_back",
        file: values.document_back
      });
    }
    if (
      (imageUpload1 && imageUpload1.status === 0) ||
      (imageUpload2 && imageUpload2.status === 0)
    ) {
      notificationOpts.message = imageUpload1
        ? imageUpload1.message
        : imageUpload2.message;
      yield put(Notifications.error(notificationOpts));
    }
    if (imageUpload1 && imageUpload1.status === 1) {
      yield put(setUploadDocument("document"));
    }
    if (imageUpload2 && imageUpload2.status === 1) {
      yield put(setUploadDocument("document_back"));
    }
    // else {
    const res = yield call(API.account.submitDocument, values);
    if (res.result && res.result.status === 0) {
      notificationOpts.message =
        res.result.message || "Please verify the values";
      yield put(Notifications.error(notificationOpts));
    }
    if (res.result && res.result.status === 1) {
      notificationOpts.message =
        res.result.message || "Account Details added successfully";
      yield put(Notifications.success(notificationOpts));
      yield call(getBankDetails);
      yield call(handler);
    }
    // }
  } catch (e) {
    console.log(e);
  }
}

function* CreateAccountSaga() {
  yield fork(takeEvery, VALIDATE, handleValidate);
  yield fork(takeLatest, SUBMIT, handleSubmit);
  yield fork(takeEvery, CREATE_ACCOUNT, addAccountDetails);
  yield fork(takeEvery, GET_ACCOUNT, getBankDetails);
  yield fork(takeEvery, SUBMIT_DOCUMENT, submitDocumentsSaga);
}

export default CreateAccountSaga;
