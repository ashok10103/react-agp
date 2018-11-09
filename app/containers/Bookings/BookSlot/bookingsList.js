import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import Gallery from 'react-grid-gallery';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import BookingList from 'components/BookingList';
import { getBookingsSlots } from './selectors';
import { getBookings } from './actions';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { weekDays, getDate } from 'utils/helper';
import reducer from './reducer';
import saga from './saga';
import API from '../../../utils/api';


const days = weekDays();
export class bookListContainer extends React.Component {	constructor(props) {
  super(props);
  this.state = {
    day: 'sunday',
    users: []
  }
}
componentDidUpdate(nextProps){
if(nextProps != this.props) {
  const params = {
    gymId: this.props.gymId,
    bookingDate: this.props.day,
    slot: this.props.slots,
    filter: 'member'
  }  
  API.bookings.getDetailsOfSlot(params).then((response) => {
      this.setState({users: response.result})
  })
}
 
}

componentDidMount() {
  const params = {
    gymId: this.props.gymId,
    bookingDate: this.props.day,
    slot: this.props.slots,
    filter: 'member'
  }
  
  API.bookings.getDetailsOfSlot(params).then((response) => {
      this.setState({users: response.result})
  })
}
render() {
  return <BookingList users={this.state.users}/>
}

}
function mapDispatchToProps(dispatch) {
	return {
		getBookings: (day, id) => dispatch(getBookings(day, id)),
	};
}

const mapStateToProps = createStructuredSelector({
	bookings: getBookingsSlots(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'GymBookings', reducer });
const withSaga = injectSaga({ key: 'GymBookings', saga });

export default compose(withReducer, withSaga, withConnect)(bookListContainer);