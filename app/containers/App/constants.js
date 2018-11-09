/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_REPOS = 'boilerplate/App/LOAD_REPOS';
export const LOAD_REPOS_SUCCESS = 'boilerplate/App/LOAD_REPOS_SUCCESS';
export const LOAD_REPOS_ERROR = 'boilerplate/App/LOAD_REPOS_ERROR';
export const DEFAULT_LOCALE = 'en';
export const SET_USER_LOCATION = 'boilerplate/App/SET_USER_LOCATION';
export const SET_CURRNT_USER = 'boilerplate/App/SET_CURRNT_USER';
export const GET_CURRNT_USER = 'boilerplate/App/GET_CURRNT_USER';
export const GET_SETTINGS = 'boilerplate/App/GET_SETTINGS';
export const SET_SETTINGS = 'boilerplate/App/SET_SETTINGS';
export const SET_TRAINER_SETTINGS = 'boilerplate/App/SET_TRAINER_SETTINGS';