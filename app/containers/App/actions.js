
import {
  LOAD_REPOS,
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS_ERROR,
  SET_USER_LOCATION,
  SET_CURRNT_USER,
  GET_CURRNT_USER,
  GET_SETTINGS,
  SET_SETTINGS,
  SET_TRAINER_SETTINGS
} from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function loadRepos() {
  return {
    type: LOAD_REPOS,
  };
}
export function getCurrentUser() {  
  return {
    type: GET_CURRNT_USER,
  };
}
/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_REPOS
 */
export function setCurrentUser(user) {  
  return {
    type: SET_CURRNT_USER,
    user,
  };
}
/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} repos The repository data
 * @param  {string} username The current username
 *
 * @return {object}      An action object with a type of LOAD_REPOS_SUCCESS passing the repos
 */
export function reposLoaded(repos, username) {
  return {
    type: LOAD_REPOS_SUCCESS,
    repos,
    username,
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_REPOS_ERROR passing the error
 */
export function repoLoadingError(error) {
  return {
    type: LOAD_REPOS_ERROR,
    error,
  };
}
export function setUserLocation(location) {
  return {
    type: SET_USER_LOCATION,
    location,
  };
}
export const getSettings = () => {
 return{
  type: GET_SETTINGS,
}
}
export const setTrainerSettings = (settings) => ({
  type: SET_TRAINER_SETTINGS,
  settings,
});

export const setSettings = (settings) => ({
  type: SET_SETTINGS,
  settings,
});
