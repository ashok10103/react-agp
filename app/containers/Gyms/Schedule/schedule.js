import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

// import { changeValue, validate, submit, getSettings, moveToNext } from './actions';
// import { getFields, getValid, submitErr, getSubmitting, fetchSettings } from './selectors';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { getMomentTime, removeElement, getTwelveHours } from 'utils/helper';

const format = 'HH:mm';

const now = '00:00';
class Schedule extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			paymentType: [],
			guestAccessType: [],
			endTime: now,
			startTime: now,
			newSchedule: [],
			selectedHours: {
				[props.day]: []
			}
		};
		this.manageTimeSlots = this.manageTimeSlots.bind(this);
		this.removeSchedule = this.removeSchedule.bind(this);
		this.addNewSchedule = this.addNewSchedule.bind(this);
    this.disabledHours = this.disabledHours.bind(this);
	}

	removeSchedule(e, index, currentTime) {
		let selectedHoursDay = this.state.selectedHours[this.props.day] || [];		
		selectedHoursDay = removeElement(selectedHoursDay, parseInt(currentTime.split(':')[0]))
		let selectedHours  =  this.state.selectedHours;
		selectedHours[this.props.day] = selectedHoursDay
		this.setState({selectedHours})
		this.props.updateSchedule(null, this.props.day, index)
		this.forceUpdate();
	}

	manageTimeSlots(value, index, currentTime) {
		const startTime = value.format(format);
		console.log(value);
		
		let selectedHoursDay = this.state.selectedHours[this.props.day] || [];		
		if(parseInt(startTime.split(':')[0]) !=  parseInt(currentTime.split(':')[0])) {
			selectedHoursDay = removeElement(selectedHoursDay, parseInt(currentTime.split(':')[0]))
		}
		selectedHoursDay.push(parseInt(startTime.split(':')[0]));
		let selectedHours  =  this.state.selectedHours;
		selectedHours[this.props.day] = selectedHoursDay
		this.setState({selectedHours})
		let endTime = `${parseInt(startTime.split(':')[0]) + 1}`
		if(endTime > 24) {
			endTime = '24:00'
		}
		const minutes =  `${parseInt(startTime.split(':')[1])}` == 0 ? '00' : `${parseInt(startTime.split(':')[1])}`;
		this.props.updateSchedule({endTime: `${endTime}:${minutes}`, startTime}, this.props.day, index)
		this.forceUpdate();
	}
	addNewSchedule(e) {
	  e.preventDefault();
		this.props.newSchedule({ startTime: '06:00', endTime: '07:00' }, this.props.day)
		this.forceUpdate();
	}
	disabledHours() {
		return this.state.selectedHours[this.props.day]
	}


	render() {
		const { day, schedules } = this.props;
		const { newSchedule } = this.state

		return (
			<div className="respo-table">
				<table className="schedule-table">
				 { schedules[day] && schedules[day].length ? 
					<tr>
						<th></th>
						<th>Start Time
							 {/* <i className="fa fa-angle-down sort-btn" aria-hidden="true"></i> */}
							 </th>
						<th colSpan="2">End Time 
						{/* <i className="fa fa-angle-down sort-btn" aria-hidden="true"></i> */}
						</th>
					</tr>
					: 'Add Your Schedule for the day'}
					{
						schedules[day] && schedules[day].length ? schedules[day].map((schedule, index) =>
							<tr className="new-item" key={index}>
								<td>
									<span className="schedule-icon">
										<i className="icon sprite-time"></i>
									</span>
								</td>
								<td>
									<TimePicker
										showSecond={false}
										onChange={(e) => this.manageTimeSlots(e, index, schedule.startTime)}
										hourStep={1}
										minuteStep={15}
										use12Hours
										value={getMomentTime(schedule.startTime)}
										defaultValue={getMomentTime(schedule.startTime)}
										disabledHours={this.disabledHours}
									/>
								</td>
								<td>
									<input
										type="text"
										value={getTwelveHours(schedule.endTime)}
										className="form-control date-input"
										placeholder="End Time"
										readOnly
									/>
								</td>
								<td className="actions">
									<span className="action-btn" onClick={(e)=>this.removeSchedule(e, index, schedule.startTime)}><a><i className="fa fa-trash-o" aria-hidden="true"></i></a></span>
								</td>
							</tr>
						)
							: ''
					}
				</table>
				<a className="add-new-schedule" title="Add New" onClick={(e) =>this.addNewSchedule(e)}>+</a>

			</div>

		);
	}
}
export default Schedule;
