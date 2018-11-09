import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import BookingList from 'components/BookingList';
import { getBookingsSlots } from './selectors';
import { getBookings } from './actions';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import API from '../../../utils/api';


const days = weekDays();
export class cardListContainer extends React.Component {	constructor(props) {
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
  return 
  (<tr>
  <td>
    <label className="containercheck">
        <input className="chcked-sect" type="checkbox" />
        <span className="checkmark">
            <div className="background-white"></div>
        </span>
    </label>
  </td>
  <td>
    <figure>
      <img src="images/temp/saved-card-01.jpg" alt="" />
      <figcaption>
        <h5 className="cardname">Card name</h5>
        <span className="cardno">#00050 5055 20500</span>
      </figcaption>
    </figure>
  </td>
  <td>
    <ul className="controls list-unstyled pull-right">
      <li>
        <a href=""><i className="fa fa-pencil-square-o"></i></a>
      </li>
      <li>
        <a href=""><i className="fa fa-trash"></i></a>
      </li>
    </ul>
  </td>
</tr>)
{/* <tr>
  <td>
    <label className="containercheck">
        <input className="chcked-sect" type="checkbox" />
        <span className="checkmark">
            <div className="background-white"></div>
        </span>
    </label>
  </td>
  <td>
    <figure>
      <img src="images/temp/saved-card-01.jpg" alt="" />
      <figcaption>
        <h5 className="cardname">Card name</h5>
        <span className="cardno">#00050 5055 20500</span>
      </figcaption>
    </figure>
  </td>
  <td>
    <ul className="controls list-unstyled pull-right">
      <li>
        <a href=""><i className="fa fa-pencil-square-o"></i></a>
      </li>
      <li>
        <a href=""><i className="fa fa-trash"></i></a>
      </li>
    </ul>
  </td>
</tr> */}
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

export default compose(withReducer, withSaga, withConnect)(cardListContainer);