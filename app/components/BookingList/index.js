
/*
 * User Widget
 *
 * This is the landing page of our User Widget component
 *
 */

import React, { PropTypes as T } from 'react';
import AuthService from 'utils/AuthService';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';
import { connect } from 'react-redux';


import Calendar from 'react-calendar'

class BookingList extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      day: new Date()
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange(day) {
    this.setState({day})
    this.props.onDaySelect(day);
	}

  render() {
     const {users} = this.props
    return (
      <div className="clps-panel-bd">
      <ul className="list list-unstyled">
        {
          users && users.length ?  users.map((user)=> 
          <li className="item clearfix">
          <div className="col image-col">
            <span className="schedule-icon img-wrp">
              <img src={user.profileImageUrl} alt="" />
            </span>
          </div>
          <div className="col name-col">
            {user.firstName} {user.lastName}
      </div>
          <div className="col desc-col user-list">
          {user.emailId} 

      </div>
      <div className="col desc-col">
          {user.phoneNumber} 

      </div>
        </li>
        ) : ''

        }
      </ul>
    </div>
    );
  }
}


function mapDispatchToProps(dispatch, ownProps) {
  return {

  };
}

const mapStateToProps = createStructuredSelector({
});
// export default connect(
//     (state) => ({ notifications: state.notifications })
// )(NotificationsComponent);
export default connect(mapStateToProps, mapDispatchToProps)(BookingList);

