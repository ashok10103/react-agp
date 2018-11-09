/*
 * User Widget
 *
 * This is the landing page of our User Widget component
 *
 */

import React, { PropTypes as T } from 'react';
import { FormattedMessage } from 'react-intl';
import AuthService from 'utils/AuthService';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { selectNotifications } from './selectors';
import { removeUser, getUserState } from '../../utils/helper';

import Notifications from 'react-notification-system-redux';


class NotificationsComponent extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
  }

  
  componentDidMount() {

  }   
  render() {
    const { notifications } = this.props;
    const style = {
      NotificationItem: { // Override the notification item
        DefaultStyle: { // Applied to every notification, regardless of the notification level
          margin: '10px 5px 2px 1px',
          padding:'8px 20px'
        },

        success: { // Applied only to the success notification item
          color: 'blue',
        },
      },
    };

    return (
      <Notifications
        notifications={notifications}
        style={style}
      />
    );
  }
}


function mapDispatchToProps(dispatch, ownProps) {
  return {

  };
}

const mapStateToProps = createStructuredSelector({
  notifications: selectNotifications(),
});

Notifications.propTypes = {
    // TOdO have to add proptypes
    // isAuthenticated: boolean,
    // user:object,
};

// export default connect(
//     (state) => ({ notifications: state.notifications })
// )(NotificationsComponent);
export default connect(mapStateToProps, mapDispatchToProps)(NotificationsComponent);

