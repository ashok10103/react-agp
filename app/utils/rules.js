import { isEmail, matches, isNumeric, isAlphanumeric, isEmpty, isAlpha, isMobilePhone } from 'validator';

const minLength = {
  test: (val, threshold) => val.trim().length + 1 > parseInt(threshold, 10),
  message: (val, threshold) => `Must contain atleast ${threshold} characters.`,
};
const codeMinlength = {
  test: (val, threshold) => val.length + 1 > parseInt(threshold, 10),
  message: () => 'invalid code.',
};
const codeMaxlength = {
  test: (val, threshold) => parseInt(threshold, 10) > val.length,
  message: () => 'invalid code.',
};
const maxLength = {
  test: (val, threshold) => val.length + 1 < parseInt(threshold, 10),
  message: (val, threshold) => `Must contain atleast ${threshold} characters.`,
};
const isNumber = {
  test: isNumeric,
  message: 'Invalid input.',
};
const isAlphaNum = {
  test: isAlphanumeric,
  message: 'Alphabets and numbers allowed.',
};
const isAlphaOnly = {
  test: isAlpha,
  message: ' Special characters and numbers are not allowed.',
};
const checkEmpty = {
  test: (val) => val === true,
  message: 'Please Accept Terms.',
};

const checkPassword = {
  test: (val) => {
    const re = /^[A-Za-z0-9&_]*$/;
    if (re.test(val)) {
      return true;
    } else {
      return false;
    }
  },
  message: 'Special characters are not allowed except & and _',
};

const email = {
  test: isEmail,
  message: 'Please input a valid email address.',
};
const emailDomain = {
  test: (val) => {
  },
  message: 'Only emails with company domain are allowed',
};

const doesNotMatch = {
  test: (val, str) => !matches(val, str),
  message: (_, str) => `Your password should not contain the phrase "${str}."`,
};

const mobilePhone = {
  test: (val) => val ? isMobilePhone(val, 'any') : true,
  message: (val) => 'Invalid Mobile Number.',
};

const empty = {
  test: (val, field) => val.length > parseInt(0),
  message: (val, field) => `${field} should not be empty.`,
};

const isMatchPassword = {
  test: (val, compare) => {
      return val.trim() === compare.trim();
  },
  message: () => 'Password does not match',
};

const required = {
  test: (val) => val.length > 0,
  message: 'Field is required ',
};

export default {
  doesNotMatch,
  minLength,
  email,
  codeMaxlength,
  codeMinlength,
  maxLength,
  isNumber,
  isAlphaNum,
  checkEmpty,
  mobilePhone,
  empty,
  isAlphaOnly,
  checkPassword,
  emailDomain,
  isMatchPassword,
  required,
};
