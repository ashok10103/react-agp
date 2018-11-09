import {
  SEND_TOKEN, SET_MESSAGE
 
  } from './constants';
  
   export const sendToken = (value) => ({
    type: SEND_TOKEN,
    value
  });
  export const setMessage = () => ({
    type: SET_MESSAGE,
    
  });
  