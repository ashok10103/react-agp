
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


// import Calendar from 'react-calendar'
import Calendar from 'react-calendar/dist/entry.nostyle'

class Calender extends React.Component { // eslint-disable-line react/prefer-stateless-function

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

    return (
      <Calendar
        onChange={this.onChange}
        value={this.state.day}
        prev2Label={false}
        next2Label={false}
      />
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
export default connect(mapStateToProps, mapDispatchToProps)(Calender);

