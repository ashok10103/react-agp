/*
 * AppReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */

import { fromJS } from 'immutable';

import {
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS,
  LOAD_REPOS_ERROR,
  SET_USER_LOCATION,
  SET_CURRNT_USER,
  SET_SETTINGS,
  SET_TRAINER_SETTINGS
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  userData: {
    repositories: false,
  },
  location: {
    latitude: '',
    longitude: '',
  },
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_REPOS:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['userData', 'repositories'], false);
    case SET_CURRNT_USER:
      return state
        .set('currentUser', action.user);
    case SET_SETTINGS:
      return state
      .set('settings', action.settings);
    case SET_TRAINER_SETTINGS:
      return state
      .set('trainerSettings', action.settings);
    case LOAD_REPOS_SUCCESS:
      return state
        .setIn(['userData', 'repositories'], action.repos)
        .set('loading', false)
        .set('currentUser', action.username);
    case LOAD_REPOS_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    case SET_USER_LOCATION:
      return state
        .setIn(['location', 'latitude'], action.location.latitude)
        .setIn(['location', 'longitude'], action.location.longitude);
    default:
      return state;
  }
}

export default appReducer;
