/**
 * The global state selectors
 */

import { createSelector } from 'reselect';

const selectState = (state) => state;

const selectNotifications = () => createSelector(
    selectState,
    (globalState) => globalState.get('notifications')
);


export {
    selectNotifications,
};
