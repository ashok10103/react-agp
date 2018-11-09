import { createSelector } from 'reselect';
const selectTrainerDetail = (state) => state.get('TrainerDetail');

const TrainerData = () => createSelector(
  selectTrainerDetail,
  (trainerDetailState) => trainerDetailState.get('details')
);
const showRating = () => createSelector(
  selectTrainerDetail,
  (showRatingState) => showRatingState.get('showStar')
);


const showNewRating = () => createSelector(
  selectTrainerDetail,
  (showNewRatingState) => showNewRatingState.get('star')
);

export {
  TrainerData,showNewRating,showRating
};
