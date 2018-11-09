import { fromJS } from "immutable";
import { uniqBy } from "lodash";

import {
  SET_USERS_LIST,
  BLOCK_SUCCESSFULL,
  SET_PAGENUMBER,
  SEARCH_USER,
  SET_TOTALCOUNT,
  DELETE_SUCCESSFULL,
  CHANGE_VALUE,
  SEND_USER_DATA,
  SET_USER_DETAILS
} from "./constants";

const initialFieldState = {
  value: ""
};

function getIdsFromObjectArray(data) {
  if (data.length) {
    return data.map(obj => obj);
  } else return data;
}

const initialFieldObjectState = {
  value: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    landmark: "",
    zip: ""
  }
};
const initialFieldArrayState = {
  value: [],
  validated: false,
  validating: false,
  errors: []
};

const initialState = fromJS({
  users: [{}],
  data: {},
  userProfile: {
    firstName: {
      ...initialFieldState
    },
    lastName: {
      ...initialFieldState
    },
    phoneNumber: {
      ...initialFieldState
    },
    password: {
      ...initialFieldState
    },
    emailId: {
      ...initialFieldState
    },
    profileImageUrl: {
      ...initialFieldState
    }
  },
  gymProfile: {
    phoneNumber: {
      ...initialFieldState
    },
    rating: {
      ...initialFieldState
    },
    ownerInfo: {
      ...initialFieldState
    },
    gymType: {
      ...initialFieldState
    },
    description: {
      ...initialFieldState
    },
    gymName: {
      ...initialFieldState
    },
    gymImageUrl: {
      ...initialFieldState
    },

    address: { ...initialFieldObjectState },
    payment: { ...initialFieldArrayState },
    guestAccess: {
      ...initialFieldArrayState
    },
    ameneties: {
      ...initialFieldArrayState
    },
    gymRules: {
      ...initialFieldArrayState
    }
  },
  trainerProfile: {
    phoneNumber: {
      ...initialFieldState
    },
    address: { ...initialFieldObjectState },
    rating: {
      ...initialFieldState
    },
    id: {
      ...initialFieldState
    },
    trainerInfo: {
      ...initialFieldState
    },
    trainerType: {
      ...initialFieldArrayState
    },
    certificates: {
      ...initialFieldArrayState
    },
    trainerImageUrl: {
      ...initialFieldState
    }
  },

  valid: true,
  statusText: "",
  data: [],
  blocked: false,
  display: ""
});

function UsersListReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USERS_LIST:
      const { data, filterActive } = action;
      let usersData = state.get("users");
      if (filterActive) {
        return state.set("users", action.data);
      } else {
        usersData = uniqBy(usersData.concat(action.data), "_id");
        return state.set("users", action.data);
      }

    case BLOCK_SUCCESSFULL:
      const { message, id } = action;
      const users = state.get("users");
      const updatedUsers = users.map((item, index) => {
        if (item._id === id) {
          return { ...item, blocked: message === "blocked" };
        } else {
          return item;
        }
      });
      return state.set("users", updatedUsers);
    case DELETE_SUCCESSFULL:
      const { msg, idd } = action;
      const userss = state.get("users");
      const filtered = userss.filter(function(value, index, arr) {
        return value._id != idd;
      });

      return state.set("users", filtered);

    case SET_PAGENUMBER:
      return state.set("pageNumber", action.pageNumber);

    case SEND_USER_DATA:
      const { typee, field, value } = action;
      if (typee == "user") {
        return state.setIn(["userProfile", field], { value: value });
      } else if (typee == "gym") {
        return state.setIn(["gymProfile", field], { value: action.value });
      } else {
        return state.setIn(["trainerProfile", field], { value: action.value });
      }

    case SET_USER_DETAILS:
      const { dataa, typ } = action;
      let trainer = dataa.trainer;
      let gym = dataa.gym;
      let display;
      if (trainer === null || gym === null) {
        display = false;
      } else {
        display = true;
      }
      if (typ == "MEMBER") {
        return state

          .setIn(["userProfile", "firstName"], { value: dataa.firstName })
          .setIn(["userProfile", "lastName"], { value: dataa.lastName })
          .setIn(["userProfile", "phoneNumber"], { value: dataa.phoneNumber })
          .setIn(["userProfile", "emailId"], { value: dataa.emailId });
      } else if (typ == "OWNER") {
        return state
          .set("display", display)
          .set("data", dataa)
          .setIn(["userProfile", "firstName"], {
            value: dataa.firstName && dataa.firstName
          })
          .setIn(["userProfile", "lastName"], {
            value: dataa.lastName && dataa.lastName
          })
          .setIn(["userProfile", "phoneNumber"], {
            value: dataa.phoneNumber && dataa.phoneNumber
          })
          .setIn(["userProfile", "emailId"], {
            value: dataa.emailId && dataa.emailId
          })
          .setIn(["userProfile", "profileImageUrl"], {
            value: dataa.profileImageUrl && dataa.profileImageUrl
          })
          .setIn(["gymProfile", "address"], {
            value: gym ? dataa.gym.address : {}
          })
          .setIn(["gymProfile", "rating"], {
            value: gym ? dataa.gym.rating : 0
          })
          .setIn(["gymProfile", "gymName"], {
            value: gym ? dataa.gym.name : ""
          })
          .setIn(["gymProfile", "ownerInfo"], {
            value: gym ? dataa.gym.gymInfo : ""
          })
          .setIn(["gymProfile", "description"], {
            value: gym ? dataa.gym.description : ""
          })
          .setIn(["gymProfile", "gymType"], {
            value: gym ? getIdsFromObjectArray(gym.gymType) : []
          })
          .setIn(["gymProfile", "payment"], {
            value: gym ? getIdsFromObjectArray(gym.paymentType) : []
          })
          .setIn(["gymProfile", "guestAccess"], {
            value: gym ? getIdsFromObjectArray(gym.guestAccessType) : []
          })
          .setIn(["gymProfile", "ameneties"], {
            value: gym ? getIdsFromObjectArray(gym.amenities) : []
          })
          .setIn(["gymProfile", "gymRules"], {
            value: gym ? getIdsFromObjectArray(gym.gymRules) : []
          })
          .setIn(["gymProfile", "gymImageUrl"], {
            value: gym ? gym.gymImages[0] : ""
          });
      } else {
        return state
          .set("display", display)
          .setIn(["userProfile", "firstName"], { value: dataa.firstName })
          .setIn(["userProfile", "lastName"], { value: dataa.lastName })
          .setIn(["userProfile", "phoneNumber"], { value: dataa.phoneNumber })
          .setIn(["userProfile", "emailId"], { value: dataa.emailId })
          .setIn(["userProfile", "profileImageUrl"], {
            value: dataa.profileImageUrl
          })
          .setIn(["trainerProfile", "address"], {
            value: trainer ? trainer.address : {}
          })
          .setIn(["trainerProfile", "rating"], {
            value: trainer ? trainer.rating : 0
          })
          .setIn(["trainerProfile", "id"], {
            value: trainer ? trainer._id : ""
          })
          .setIn(["trainerProfile", "trainerInfo"], {
            value: trainer ? trainer.trainerInfo : ""
          })
          .setIn(["trainerProfile", "trainerType"], {
            value: trainer ? getIdsFromObjectArray(trainer.trainerType) : []
          })
          .setIn(["trainerProfile", "certificates"], {
            value: trainer ? getIdsFromObjectArray(trainer.certificates) : []
          });
      }

    case SET_TOTALCOUNT:
      return state.set("count", action.data);
    default:
      return state;
  }
}

export default UsersListReducer;
