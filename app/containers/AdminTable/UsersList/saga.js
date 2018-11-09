import { GET_USERS, BLOCK_USER, DELETE_USER } from "./constants";

import { takeEvery, takeLatest } from "redux-saga";
import { put, select, fork, call, take, cancel, all } from "redux-saga/effects";
import { LOCATION_CHANGE } from "react-router-redux";
import { push } from "react-router-redux";
import Notifications from "react-notification-system-redux";
import API from "../../../utils/api";

import { UPDATE_DATA, GET_INITIAL_DATA, SET_USER_DETAILS } from "./constants";

import {
  setUsersList,
  blockedMessage,
  setTotalCount,
  deleteSuccessfull,
  setUserDetails,
  getInitialData
} from "./actions";

const notificationOpts = {
  message: "Welcome to Airgym",
  position: "tc",
  autoDismiss: 5
};

function* getUsersSaga(action) {
  try {
    const state = yield select(state => state);
    const pageNo = action.pageNumber;
    const limit = pageNo * 10;
    const skip = (pageNo - 1) * 10;
    const res = yield call(
      API.admin.users,
      limit,
      skip,
      action.key,
      action.typee
    );
    let filterActive;
    if (action.key) {
      filterActive = true;
    } else {
      filterActive = false;
    }
    if (res.result.status == 1) {
      const data = res.result.data;
      yield put(setUsersList(data, filterActive));
      yield put(setTotalCount(res.result.count));
    }
  } catch (e) {}
}

function* handleBlockUser(data) {
  try {
    const payload = {
      userId: data.id,
      blocked: !data.blockedState
    };
    const res = yield call(API.admin.block, payload);
    if (res.result.status == 1) {
      yield put(blockedMessage(res.result.message, data.id));
      yield call(getUsersSaga);
    }
  } catch (e) {
    console.log("Error", e);
  }
}

function* getInitialDataa(action) {
  try {
    const res = yield call(API.admin.fetchUser, action.id);
    if (res.result.status == 1) {
      yield put(setUserDetails(res.result.user, action.typee));
    }
  } catch (e) {
    console.log("Error", e);
  }
}

function* updateData(action) {
  try {
    const { typee, id, edit } = action;
    const state = yield select(state => state.toJS());
    const data = state.UsersList.data.gym;
    if (typee == "OWNER") {
      const gymProfile = state.UsersList.gymProfile;
      const userProfile = state.UsersList.userProfile;
      yield call(handleUserProfile, userProfile, id);
      yield call(handleGymProfile, gymProfile, data._id);
      yield put(getInitialData("OWNER", id));
    } else if (typee == "TRAINER") {
      const trainerProfile = state.UsersList.trainerProfile;
      const userProfile = state.UsersList.userProfile;
      yield call(handleUserProfile, userProfile, id, typee);
      yield call(
        handleTrainerProfile,
        trainerProfile,
        trainerProfile.id.value,
        typee
      );
      yield put(getInitialData(typee, id));
    } else {
      if (typee == "MEMBER") {
        const userProfile = state.UsersList.userProfile;
        yield call(handleUserProfile, userProfile, id, typee);
        yield put(getInitialData(typee, id));
      }
    }
  } catch (e) {
    console.log("Error", e);
  }
}
function* handleDeleteUser(data) {
  try {
    const payload = {
      userId: data.id
    };
    const res = yield call(API.admin.deleteUser, payload);
    if (res.result.status == 1) {
      yield put(deleteSuccessfull(res.result.message, data.id));
      notificationOpts.title = "Deleted";
      notificationOpts.message = "Deleted user successfully";
      yield put(Notifications.error(notificationOpts));
      yield call(getUsersSaga);
    } else {
      notificationOpts.message = "Couldnt delete";
      yield put(Notifications.error(notificationOpts));
    }
  } catch (e) {
    notificationOpts.message = "Couldnt delete";
    yield put(Notifications.error(notificationOpts));
  }
}
function* handleUserProfile(userProfile, id, typee) {
  try {
    const value = {
      emailId: userProfile.emailId.value,
      firstName: userProfile.firstName.value,
      lastName: userProfile.lastName.value,
      phoneNumber: userProfile.phoneNumber.value
    };
    const response = yield call(API.common.updateUser, value, id);
    if (response.result && response.result.status === 1) {
      notificationOpts.message =
        (response.result && response.result.message) ||
        "Updated user profile successfully";
      yield put(Notifications.success(notificationOpts));
    } else {
    }
  } catch (e) {
    console.log("Error", e);
  }
}
function* handleGymProfile(gymProfile, id, typee) {
  try {
    const value = {
      name: gymProfile.gymName.value,
      guestAccessType: gymProfile.guestAccess.value,
      amenities: gymProfile.ameneties.value,
      gymType: gymProfile.gymType.value,
      gymRules: gymProfile.gymRules.value,
      paymentType: gymProfile.payment.value,
      gymInfo: gymProfile.ownerInfo.value
    };
    const settings = yield call(API.gyms.editGym, value, id);
    if (settings.result.status == 1) {
      notificationOpts.message = "Successfully updated details !";
      yield put(Notifications.success(notificationOpts));
    } else {
      notificationOpts.message = "No values";
      yield put(Notifications.error(notificationOpts));
    }
  } catch (e) {
    console.log("Error", e);
  }
}

function* handleTrainerProfile(trainerProfile, id) {
  try {
    const value = {
      trainerInfo: trainerProfile.trainerInfo.value,
      trainerType: trainerProfile.trainerType.value,
      certificates: trainerProfile.certificates.value
    };

    const settings = yield call(API.trainers.editTrainer, value, id);
    if (settings) {
      notificationOpts.message = "Updated details successfully!";
      yield put(Notifications.success(notificationOpts));
    } else {
      notificationOpts.message = "No values";
      yield put(Notifications.error(notificationOpts));
    }
  } catch (e) {}
}

function* usersListSaga() {
  yield fork(takeEvery, GET_USERS, getUsersSaga);
  yield fork(takeLatest, BLOCK_USER, handleBlockUser);
  yield fork(takeLatest, DELETE_USER, handleDeleteUser);
  yield fork(takeLatest, UPDATE_DATA, updateData);
  yield fork(takeLatest, GET_INITIAL_DATA, getInitialDataa);
}

export default usersListSaga;
