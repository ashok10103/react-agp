import request from "../utils/request";
import { getUserAuthToken, userJWTData } from "./helper";

const defaultOptions = { credentials: "same-origin", headers: {} };
const methodsWithPayload = ["POST", "PUT", "PATCH", "DELETE"];

const API_URL =  'https://api-airgym.cubettech.in';
// const API_URL = 'https://api.airgym.com';

function makeRequest(method, url, file, imgUrl) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Cache-Control", "public,max-age=3000");
    xhr.setRequestHeader("x-amz-acl", "public-read");
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        let data;
        data = imgUrl;
        resolve(data);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send(file);
  });
}
/* eslint-disable no-underscore-dangle */
function _apiCall(path, options = {}) {
  const defaultedOptions = Object.assign({}, defaultOptions, options);

  if (
    methodsWithPayload.indexOf(defaultedOptions.method) > -1 &&
    defaultedOptions.body
  ) {
    defaultedOptions.headers["Content-Type"] = "application/json";
    defaultedOptions.headers["X-Requested-With"] = "XMLHttpRequest";
    defaultedOptions.body =
      typeof defaultedOptions.body === "string"
        ? defaultedOptions.body
        : JSON.stringify(defaultedOptions.body);
  }

  if (defaultedOptions.auth) {
    defaultedOptions.headers.Authorization = `Bearer ${getUserAuthToken()}`;
  }

  let defaultedPath = typeof path === "string" ? path : path.join("/");

  if (defaultedOptions.params) {
    const esc = encodeURIComponent;
    const query = Object.keys(defaultedOptions.params)
      .map(k => `${esc(k)}=${esc(defaultedOptions.params[k])}`)
      .join("&");
    defaultedPath = `${defaultedPath}?${query}`;
  }
  return request(`${API_URL}/${defaultedPath}`, defaultedOptions)
    .then(result => ({ result }))
    .catch(error => ({ error }));
}

let callId = 0;
export const call =
  process.env.NODE_ENV === "production"
    ? _apiCall
    : (path, options = {}, json = true, ...rest) => {
        callId += 1;
        const thisCallId = callId;
        return _apiCall(path, options, json, ...rest).then(
          result => {
            console.info("API Result", thisCallId, json ? result : "(stream)");
            return result;
          },
          error => {
            // console.log(error;)
            console.error(
              "API Error",
              thisCallId,
              error.stack || error.message || error
            );
            throw error;
          }
        );
        /* eslint-enable no-console */
      };

async function uploadFormData(params, url) {
  const authToken = getUserAuthToken();
  const response = await fetch(`${API_URL}/${url}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`
    },
    body: params
  });
  const responseData = await response.json();
  return responseData;
}

export default {
  auth: {
    login(payload) {
      return call(["auth", "login"], {
        method: "POST",
        body: payload
      });
    },
    socialLogin(payload) {
      return call(["auth", "socialLogin"], {
        method: "POST",
        body: payload
      });
    },
    register(payload) {
      return call(["auth", "register"], {
        method: "POST",
        body: payload
      });
    },
        verify(payload) {
      return call(["auth", "verifyToken","gmail"], {
        method: "POST",
        body: {token:payload}
      });
    },

  },


  common: {
    getUser(id) {
      if (id) {
        const authToken = getUserAuthToken();
        return call(["api", "users", id], {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
      }
    },


    getShare(id) {
      const authToken = getUserAuthToken();
      return call(["api", "gyms","getSchedule"], {
        method: "POST",
        body: {gymId:id},
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },

    getSettings() {
      return call(["api", "settings", "get"], {
        method: "GET"
      });
    },
    trainerSettings() {
      return call(["api", "settings", "get", "trainerDetails"], {
        method: "GET"
      });
    },
    updateUser(payload, id) {
      const authToken = getUserAuthToken();
      return call(["api", "users", id], {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: payload
      });
    },
    imageUpload(payload) {
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("userId", payload.userId);
      return uploadFormData(formData, "api/users/upload");
    },
    resetPassword(payload) {
      return call(["api", "users", "savepassword"], {
        method: "POST",
        body: payload
      });
    },
    forgotPassword(payload) {
      return call(["api", "users", "forgotpassword"], {
        method: "POST",
        body: payload
      });
    }
  },
  admin: {
    users(limit, skip, key, userType) {
      const authToken = getUserAuthToken();
      return call(["api", "users", "list"], {
        method: "POST",
        body: { limit, skip, emailId: key, userType},
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    block(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "users", "blocked"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    deleteUser(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "users", "deleteUser"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    report(limit, skip) {
      const authToken = getUserAuthToken();
        return call(["api", "gyms", "reports", "list"], {
        method: "GET",
        params:{limit:limit, skip:skip},
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },

    fetchUser(id) {
      const authToken = getUserAuthToken();
      return call(["api", "admin", "getUser", id], {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },

    contactAdmin(payload) {
      return call(["api", "admin", "contact"], {
        method: "POST",
        body: payload
      });
    }
  },
  gyms: {
    list(payload) {
      return call(["api", "gyms", "list"], {
        method: "POST",
        body: payload
      });
    },
    get(payload, id) {
      const authToken = getUserAuthToken();
      return call(["api", "gyms", id], {
        method: "GET",
        params: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    reviewlist(id,limit,skip) {
      const authToken = getUserAuthToken();
      return call(["api", "gymrating","list"], {
        method: "POST",
        body: {limit:limit,skip:skip,gymId:id},
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },

    report(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "gyms", "reports"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    createGym(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "gyms"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },

    createStarRating(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "gyms", "rating"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },

    editGym(payload, id) {
      const authToken = getUserAuthToken();
      return call(["api", "gyms", id], {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: payload
      });
    },
    addSchedule(data) {
      const authToken = getUserAuthToken();
      return call(["api", "gyms", "addSlots"], {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    fetchTimeSlots(data) {
      const authToken = getUserAuthToken();
      return call(["api", "gyms", "getSlots"], {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },

    sendMail(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "users", "forgotpassword"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    uploadGymImage(payload) {
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("gymId", payload.gymId);
      return uploadFormData(formData, "api/gyms/upload");
    },
    removeImage(data) {
      const authToken = getUserAuthToken();
      return call(["api", "gyms", "deleteImage"], {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }
  },
  notifications: {
    getAllNotifications(data) {
      if (data) {
        const authToken = getUserAuthToken();
        return call(["api", "notification", "List"], {
          method: "GET",
          params: data,
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
      }
    }
  },
  bookings: {
    getAllSlots(data) {
      const authToken = getUserAuthToken();
      return call(["api", "booking", "getSlots"], {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    cancelBookings(data) {
      const authToken = getUserAuthToken();
      return call(["api", "booking", "cancelBooking"], {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },

    getDetailsOfSlot(data) {
      const authToken = getUserAuthToken();
      return call(["api", "booking", "getSlotUsers"], {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    getAllBookings(data) {
      const authToken = getUserAuthToken();
      return call(["api", "booking", "getAllBookings"], {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    getBookingsAday(data) {
      const authToken = getUserAuthToken();
      return call(["api", "booking", "getBookingsAday"], {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    bookSlots(data) {
      const authToken = getUserAuthToken();
      return call(["api", "booking", "bookSlot"], {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    bookSlotsByTrainer(data) {
      const authToken = getUserAuthToken();
      return call(["api", "booking", "bookSlotTrainer"], {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    getOwnerBookings(data) {
      const authToken = getUserAuthToken();
      return call(["api", "booking", "getOwnerBookings"], {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }
  },
  trainers: {
    list(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "trainer", "list"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },

    get(payload, id) {
      const authToken = getUserAuthToken();
      return call(["api", "trainer", id], {
        method: "GET",
        params: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    getTrainerSlot(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "trainer", "getSlots"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    editTrainer(payload, id) {
      const authToken = getUserAuthToken();
      return call(["api", "trainer", id], {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: payload
      });
    },
    getMembers(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "trainer", "bookedMe"], {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: payload
      });
    },

    createTrainers(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "trainer", "create"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    bookTrainer(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "trainer", "bookTrainer"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }
  },

  payments: {
    checkForCard() {
      const authToken = getUserAuthToken();
      return call(["api", "payment", "checkForCard"], {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    createCard(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "payment", "createCard"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    listAllCards(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "payment", "listCards"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    payOnline(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "payment", "payOnline"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }
  },
  account: {
    getBankDetails() {
      const authToken = getUserAuthToken();
      return call(["api", "payment", "getBankDetails"], {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    addBankAccount(payload) {
      const authToken = getUserAuthToken();
      return call(["api", "payment", "createAccount"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    submitDocument(payload) {

      const authToken = getUserAuthToken();
      return call(["api", "payment", "addSecurityInfo"], {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
    },
    uploadDocument(payload) {
      console.log("caled the api here ");
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("documentType", payload.documentType);
      return uploadFormData(formData, "api/payment/uploadDocuments");

    }
  }
};
