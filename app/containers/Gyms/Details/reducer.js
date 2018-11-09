import { fromJS } from "immutable";
import {
  SET_GYM_DETAIL,
  CHANGE_STAR,
  SET_NEW_STAR,
  ADD_RATING,
  SET_ISSUES,
  SET_MESSAGE,
  SEND_REPORT,
  REVIEW_DETAIL,
  CLEAR_FP_FORM
} from "./constants";

const initialState = fromJS({
  gym: {},
  showStar: false,
  star: 0,
  issues: [{ id: "", value: "" }],
  report: { gymId: "", title: "", message: "", userType: "" },
  review: {},
  count: 0
});

function gymListReducer(state = initialState, action) {
  switch (action.type) {
    case SET_GYM_DETAIL:
      return state.set("gym", action.data);
    case CHANGE_STAR:
      return state.set("star", action.star);

    case SET_NEW_STAR:
      const starr = action.data.rating;
      return state.set("star", starr);
    case ADD_RATING:
      return state.set("showStar", true);
    case SET_ISSUES:
      return state.setIn(["issues"], { id: action.id, value: action.value });
    case SET_MESSAGE:
      return state.setIn(["message"], action.value);

    case SEND_REPORT:
      const titleData = state.get("issues").value;
      const messageData = state.get("message");
      return state.setIn(["report"], {
        gymId: action.gymId,
        title: titleData,
        message: messageData,
        userType: action.userType
      });
    case CLEAR_FP_FORM:
      return state.set("issues", "").set("message", "");

    case REVIEW_DETAIL:
      return state.set("review", action.data).set("count", action.count);

    default:
      return state;
  }
}

export default gymListReducer;
