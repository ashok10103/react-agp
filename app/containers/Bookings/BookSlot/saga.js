import { takeEvery, takeLatest } from 'redux-saga';
import { put, select, fork, call, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import Notifications from 'react-notification-system-redux';
import API from '../../../utils/api';
import { getUserId } from '../../../utils/helper';

import { getFormatedMessage } from 'utils/formatMessage';


import {
  GET_BOOKINGS,
  BOOK_TRAINER_SLOTS,
  CHECK_FOR_CARD,
  ADD_CARD,
  LIST_ALL_CARDS,
  PAY_ONLINE
} from './constants';

import {
  setBookings,
  resetBookingData,
  setCustomerId,
  listCards,
  setCards
} from './actions';
import {
  getUserData
} from '../../EditProfile/actions';
import {
  setCurrentUser
} from '../../App/actions'

const notificationOpts = {
  message: 'Welcome to Airgym',
  position: 'tc',
  autoDismiss: 5,
};

function* getProfileData(id) {
  try {
    const res = yield call(API.common.getUser, id);
    if (res.result) {
      yield put(setCurrentUser(res.result));
    }
  } catch (e) {
    console.log(e);
  }
}

function* getBookings(action) {
  try {
    const { day, bookingType, id } = action
    let res
    if (bookingType === 'trainer') {
      res = yield call(API.trainers.getTrainerSlot, { trainerId: id, date: day, type: 'user' });
    } else {
      res = yield call(API.bookings.getAllSlots, { gymId: id, date: day });
    }

    if (res.result) {
      bookingType === 'trainer' ? yield put(setBookings({ data: res.result })) :
        yield put(setBookings(res.result));
    }
  } catch (e) {
    // notificationOpts.title = e.err;
    // notificationOpts.message = e.message;
    // yield put(Notifications.error(notificationOpts));
  }
}

function* bookTrainer(action) {
  try {
    const { id } = action
    const userId = getUserId();
    const state = yield select((state) => state);
    let data = state.get('Booking').toJS()['bookingSlots'];
    const result = data.schedules.filter((obj) => obj.slots.length > 0)
    const res = yield call(API.trainers.bookTrainer, { trainerId: id, schedules: data.schedules });
    if (res.result.status) {
      if (res.result.unBookedSlots && res.result.unBookedSlots.length) {
        notificationOpts.message = getFormatedMessage(res.result.unBookedSlots)
        yield call(getProfileData, userId);
        yield put(Notifications.error(notificationOpts));
        yield put(resetBookingData())
      } else {
        notificationOpts.message = 'Booked slots successfully';
        yield call(getProfileData, userId);
        yield put(Notifications.success(notificationOpts));
        yield put(resetBookingData())
      }

    }
  } catch (e) {

  }
}

function* addCard(action) {
  try {
    const res = yield call(API.payments.createCard, { token: action.token });
    if (res.result.customerId) {
      notificationOpts.message = 'Added your card successfully';
      yield put(Notifications.success(notificationOpts));
      yield put(setCustomerId(res.result.customerId))
      yield call(getListCards, { customerId: res.result.customerId })

    } else {
      notificationOpts.message = res.result.message || 'Please check the card details';

    }
  } catch (e) {

  }
}

function* checkForCard() {
  try {
    const res = yield call(API.payments.checkForCard);
    if (res.result) {
      yield put(setCustomerId(res.result.customerId))
      yield call(getListCards, { customerId: res.result.customerId })
    }
  } catch (e) {

  }
}

function* getListCards(action) {
  try {
    const res = yield call(API.payments.listAllCards, { customerId: action.customerId });
    if (res.result) {
      yield put(setCards(res.result.cards))
    }
  } catch (e) {

  }
}
function* bookGyms(action) {
  const { params } = action;

  if (params) {
    const state = yield select((state) => state);
    let data = state.get('Booking').toJS()['bookingSlots'];
    const result = data.schedules.filter((obj) => obj.slots.length > 0)
    const paramObj = {
      "gymId": params.gymId,
      "paymentType": params.paymentType,
      "paymentId": params.paymentId,
      "amount": data.amount,
      "schedules": result
    }
    const userId = getUserId();    
    let res;

    if(params.userType === 'TRAINER') {      
      res = yield call(API.bookings.bookSlotsByTrainer, paramObj);
    } else {
      res = yield call(API.bookings.bookSlots, paramObj);
    }
    if (res.result.status) {
      if (res.result.unBookedSlots && res.result.unBookedSlots.length) {
        notificationOpts.message = getFormatedMessage(res.result.unBookedSlots)
        yield put(Notifications.error(notificationOpts));
        yield put(resetBookingData())
        yield call(getProfileData, userId);
        yield put(push(`/mybookings/${userId}`));

      } else {
        notificationOpts.message = 'Booked slots successfully';
        yield put(Notifications.success(notificationOpts));
        yield call(getProfileData, userId);
        yield put(resetBookingData())
        yield put(push(`/mybookings/${userId}`));
      }

    }
  }
}

function* payOnlineAndBook(action) {
  try {
    const { params } = action;
    if (params.payableAmount && params.payableAmount > 0 &&  (params.paymentType === 'online' || params.paymentType === 'creditsAndPay')) {
      const paramObj = {
        token: params.card,
        amount: params.payableAmount,
        gymId: params.gymId
      }
      const res = yield call(API.payments.payOnline, paramObj);
      if (res.result.status) {
        params.paymentId = res.result.paymentId;
        params.userType = params.userType;
        yield call(bookGyms, { params })
      } else {
        notificationOpts.message = 'Payment Failed';
        yield put(Notifications.error(notificationOpts));
      }
    } else {
      const res = yield call(bookGyms, { params });
    }

  } catch (e) {

  }
}


function* GymBookingsListSaga() {
  yield fork(takeEvery, GET_BOOKINGS, getBookings);
  yield fork(takeEvery, BOOK_TRAINER_SLOTS, bookTrainer);
  yield fork(takeEvery, CHECK_FOR_CARD, checkForCard);
  yield fork(takeEvery, ADD_CARD, addCard);
  yield fork(takeEvery, LIST_ALL_CARDS, getListCards);
  yield fork(takeEvery, PAY_ONLINE, payOnlineAndBook);


}

export default GymBookingsListSaga;
