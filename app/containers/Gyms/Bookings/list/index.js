import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import Gallery from 'react-grid-gallery';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import Calender from 'components/Calender';
import BookingListContainer from './bookingsList';
import { getBookingsSlots } from './selectors';
import { getBookings } from './actions';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { weekDays, getDate, setUserState } from 'utils/helper';
import reducer from './reducer';
import saga from './saga';

const days = weekDays();
export class GymBookings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			day: '',
			index: 0
		}
		this.getSlots = this.getSlots.bind(this);
		this.toggleTimeslot = this.toggleTimeslot.bind(this);
	}

	componentDidMount() {		
		setUserState(`/gyms/bookings/${this.props.match.params.gymId}`)
		const bookingDay = getDate(new Date());
		this.setState({ day: bookingDay })
		this.props.getBookings(bookingDay, this.props.match.params.gymId);
	}
	toggleTimeslot(e, index) {
		if(this.state.index == index) {
			this.setState({ index : -1})
		} else {
			this.setState({ index })
		}
	}
	getSlots(day) {
		const bookingDay = getDate(day);
		this.setState({ day: bookingDay })
		this.props.getBookings(bookingDay, this.props.match.params.gymId);
	}
	render() {
		const { bookings } = this.props;

		return (
			<div className="contentarea p-scheduler">
				<div className="container">
					<h3 className="ttl text-uppercase">Booking Details <span>({this.state.day})</span></h3>
					<div className="row">
						<div className="col-md-9">
							<div className="clps">
								<div className="clps-panel-head">
								{bookings.data && bookings.data.length >0 ?
									<div className="clps-panel-hd clearfix">
										<div className="col image-col">&nbsp;</div>
										<div className="col start-time">
											Start Time
											 {/* <i className="fa fa-angle-down sort-btn" aria-hidden="true"></i> */}
										</div>
										<div className="col end-time">
											End Time 
											{/* <i className="fa fa-angle-down sort-btn" aria-hidden="true"></i> */}
										</div>
										<div className="col booking-col">
											Bookings
											</div>
										<div className="col action-col">&nbsp;</div>
									</div>:''}
								</div>
								{
									bookings.data && bookings.data.length ?
										bookings.data.map((day, index) =>
											<div className={cx("clps-panel", {
												full: day.count == bookings.maximumBookingCount,
												'collapse-open': index === this.state.index
											})} onClick={((e) => this.toggleTimeslot(e, index))}>
												<div className="clps-panel-hd clearfix">
													<div className="col image-col">
														<span className="schedule-icon">
															<i className="icon sprite-time"></i>
														</span>
													</div>
													<div className="col start-time">{day.slots.split('-')[0]}</div>
													<div className="col end-time">{day.slots.split('-')[1]}</div>
													<div className="col booking-col">{day.count}</div>
													 <div className="col action-col"><button className="collapse-toggle"> {day.count ?  <i className="fa fa-angle-down sort-btn" aria-hidden="true"></i>  : ''}</button></div>
												</div>
												{index === this.state.index ?
													<BookingListContainer slots={day.slots} day={this.state.day} gymId={this.props.match.params.gymId} />
												: ''
												}
											</div>
										)
										:
										<div className="no-booking">
											<i className="fa fa-calendar" aria-hidden="true"></i>
											<p>No booking</p>
										</div>
								}

							</div>

						</div>
						<div className="col-md-3">
							<div className="calendar-block">
								<h3 className="block-ttl text-uppercase">Calendar</h3>
								<Calender onDaySelect={this.getSlots} />
							</div>
						</div>
					</div>
					{/* <a href="javascript:void(0);" className="add-new-schedule" title="Add New" data-toggle="modal" data-target="#editProfile">+</a> */}
				</div>
			</div>
		);
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

export default compose(withReducer, withSaga, withConnect)(GymBookings);
