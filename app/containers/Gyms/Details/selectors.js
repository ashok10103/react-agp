import { createSelector } from "reselect";
const selectGymDetail = state => state.get("gymDetail");

const GymData = () =>
  createSelector(selectGymDetail, gymDetailState => gymDetailState.get("gym"));

const showRating = () =>
  createSelector(selectGymDetail, showRatingState =>
    showRatingState.get("showStar")
  );

const showNewRating = () =>
  createSelector(selectGymDetail, showNewRatingState =>
    showNewRatingState.get("star")
  );

const getIssues = () =>
  createSelector(selectGymDetail, getIssuesState =>
    getIssuesState.get("issues")
  );

const getMessage = () =>
  createSelector(selectGymDetail, getIssuesState =>
    getIssuesState.get("message")
  );

const getReviewList = () =>
  createSelector(selectGymDetail, getIssuesState =>
    getIssuesState.get("review")
  );
const getCount = () =>
  createSelector(selectGymDetail, getIssuesState =>
    getIssuesState.get("count")
  );

export {
  GymData,
  showRating,
  showNewRating,
  getIssues,
  getMessage,
  getReviewList,
  getCount
};
