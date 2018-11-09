import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import Gallery from 'react-grid-gallery';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import Calender from 'components/Calender';
import { getBookingsSlots } from './selectors';
import { getBookings } from './actions';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { weekDays, getDate, setUserState } from 'utils/helper';
import reducer from './reducer';
import saga from './saga';

const days = weekDays();
export class TrainerBookings extends React.Component {
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
		const bookingDay = getDate(new Date());
		this.setState({ day: bookingDay })
		this.props.getBookings(bookingDay, this.props.match.params.trainerId);
	}
	toggleTimeslot(e, index) {
		this.setState({ index })
	}
	getSlots(day) {
		const bookingDay = getDate(day);
		this.setState({ day: bookingDay })
		this.props.getBookings(bookingDay, this.props.match.params.trainerId);
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
									<div className="clps-panel-hd clearfix">
										<div className="col image-col">&nbsp;</div>
										<div className="col gym-name">
											Name<i className="fa fa-angle-down sort-btn" aria-hidden="true"></i>
										</div>
										<div className="col start-time">
											Start Time <i className="fa fa-angle-down sort-btn" aria-hidden="true"></i>
										</div>
										<div className="col end-time">
											End Time <i className="fa fa-angle-down sort-btn" aria-hidden="true"></i>
										</div>
										<div className="col action-col">&nbsp;</div>
									</div>
								</div>
								{
									bookings && bookings.length ?
										bookings.map((day, index) =>
											<div className={cx("clps-panel", {
												full: day.count == bookings.maximumBookingCount,
												'collapse-open': index === this.state.index
											})} onClick={((e) => this.toggleTimeslot(e, index))}>
												<div className="clps-panel-hd clearfix">
													<div className="col image-col">
														<span className="schedule-icon img-wrp">
															<img src={day.user.profileImageUrl} alt="" />
														</span>
													</div>
													<div className="col gym-name">{`${day.user.firstName} ${day.user.lastName}`}</div>
													<div className="col start-time">{day.slot.split('-')[0]}</div>
													<div className="col end-time">{day.slot.split('-')[1]}</div>
												
												</div>
											</div>
										)
										:
										<div className="no-booking">
											<i className="fa fa-calendar" aria-hidden="true"></i>
											<p>zxc booking</p>
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
					<a href="javascript:void(0);" class="add-new-schedule" title="Add New" data-toggle="modal" data-target="#editProfile">+</a>
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

const withReducer = injectReducer({ key: 'TrainerBookings', reducer });
const withSaga = injectSaga({ key: 'TrainerBookings', saga });

export default compose(withReducer, withSaga, withConnect)(TrainerBookings);
