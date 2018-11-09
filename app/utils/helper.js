import jwt_decode from 'jwt-decode';
import cookie from 'react-cookies';
import moment from 'moment';


function checkPassStrength(pass) {
  let numberCount = pass.replace(/[^0-9]/g, '').length;
  let charCount = pass.replace(/[^a-zA-Z]/g, '').length;
  let splCount = pass.replace(/[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '').length;
  if (pass.length === 0) {
    return;
  }
  else {
    if (pass.length < 6) {
      return "weak";
    } else if (pass.length >= 6 && splCount === 0 && (numberCount !== 0 || charCount !== 0)) {
      return "medium";
    } else if (splCount !== 0 && (numberCount !== 0 || charCount !== 0)) {
      return "strong";
    } else if (splCount !== 0 && numberCount === 0 && charCount === 0) {
      return "medium";
    }
  }
};

const setUser = function (token, userId, userType, expiry) {
  localStorage.setItem('user_id', userId);
  localStorage.setItem('user_type', userType);

  if (expiry) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 14);
    cookie.save('user_access_token', token, { expires, path: '/' });
  } else {
    cookie.save('user_access_token', token, { path: '/' });
  }
};

const removeUser = function () {
  localStorage.clear();
  cookie.remove('user_access_token', { path: '/' });
  cookie.remove('user_id', { path: '/' });
  cookie.remove('user_type', { path: '/' });

};

const getUserId = function () {
  // return cookie.load('user_id');
  return localStorage.getItem('user_id');

};

const getUserType = function () {
  // return cookie.load('user_type');
  return localStorage.getItem('user_type');

};

const setUserCompany = function (company) {
  localStorage.setItem('user_company', JSON.stringify(company));
};

const getUserCompany = function () {
  // checked condition to get rid of undefined values
  if (localStorage.getItem('user_company') === 'undefined')
    return null;
  else
    return localStorage.getItem('user_company');
};

const getUserState = function () {
  return localStorage.getItem('currentState');
};

const setUserState = function (state) {
  return localStorage.setItem('currentState', state);
};

const getUserAuthToken = function () {
  // return localStorage.getItem('user_access_token');
  return cookie.load('user_access_token');
};

const userJWTData = function () {
  const token = cookie.load('user_access_token');
  const decoded = token ? jwt_decode(token) : {};
  return decoded;
};

const getUserClass = (userType) => {
  const classNames = {
    owner: 'primary',
    member: 'secondary',
    trainer: 'additional',
  };
  return classNames[userType];
};

const getCurrentYear = function () {
  const d = new Date();
  const y = d.getFullYear();
  return y;
};

const ORIGIN = window.location.origin ||
  `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;

const convertToBlob = function (dataURI) {
  // convert base64 to raw binary data held in a string
  const byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  const bb = new Blob([ab], { type: 'image/png' });
  return bb;
};

const weekDays = function () {
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
}
const getMomentTime = function (time) {
  const hour = time.split(':')[0] || 0;
  const minute = time.split(':')[1] || 0;
  return moment().hour(hour).minute(minute);
}
const getTwelveHours = function  (time) {
  let hour = parseInt(time.split(':')[0]) || 0;
  const minute = time.split(':')[1] || 0;
  let format = 'am'
  if(hour > 12 ) {
    hour = hour - 12 
    format = 'pm'
  } else if (hour === 12) {
    format = 'pm'
  }
  return `${hour} : ${minute} ${format}`
}

const removeElement = function (array, element) {
  const index = array.indexOf(element);
  if (index >= 0)
    array.splice(index, 1);
  return array;
}

const getDate = function (time) {
  return moment(time).format('YYYY-MM-DD')
}

const getTimeAgo = function (date) {
  return moment(date, "YYYYMMDD").fromNow();
}

const getMiles = function (i) {
  return (i * 0.000621371192).toFixed(2);
}
const getMeters = function (i) {
  return (i * 1609.344).toFixed(2);
}
export {
  checkPassStrength,
  getUserAuthToken,
  setUser,
  removeUser,
  setUserCompany,
  getUserCompany,
  getUserState,
  setUserState,
  getUserType,
  userJWTData,
  getCurrentYear,
  ORIGIN,
  convertToBlob,
  getUserClass,
  getUserId,
  weekDays,
  getMomentTime,
  removeElement,
  getDate,
  getTimeAgo,
  getMiles,
  getMeters,
  getTwelveHours
};
