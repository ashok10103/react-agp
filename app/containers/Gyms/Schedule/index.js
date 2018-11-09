import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import Gallery from 'react-grid-gallery';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import { getSchedules } from './selectors';
import { changeSchedule, newSchedule, updateSchedule, removeSchedule, saveSchedule, getSchedule } from './actions';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { weekDays, setUserState } from 'utils/helper';
import reducer from './reducer';
import saga from './saga';
import Schedule from './schedule';

const days = weekDays();
export class GymSchedule extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			day: 'sunday'
		}
		this.onDaySelect = this.onDaySelect.bind(this);
		this.saveSchedule = this.saveSchedule.bind(this);
	}
	componentDidMount() {
		setUserState(`/gyms/schedule/${this.props.match.params.gymId}`)
		this.props.getSchedule(this.props.match.params.gymId);
	}

	onDaySelect(e, day) {		
		this.setState({ day })
	}
	
	saveSchedule() {		
    this.props.saveSchedule(this.props.match.params.gymId);
	}

	render() {
		const { schedules } = this.props;
		
		return (
			<div className="contentarea p-scheduler">
				<div className="container">
					<div className="row">
						<div className="col-md-6">
							<h3 className="ttl text-uppercase">Weekly Scheduler</h3>
						</div>
						<div className="col-md-6">
							<button className="btn-save pull-right"  onClick={this.saveSchedule}><span className="icon-wrp"><i className="sprite-save-2"></i></span><span>Save</span></button>
						</div>
					</div>
					<ul className="day-selector list-unstyled clearfix">
						{
							days && days.map((day) =>
								<li>
									<input type="radio" name="dayseltor" id={`day-${day}`}  onClick={(e) =>this.onDaySelect(e,day)} checked={this.state.day == day? true: false} />
									<label htmlFor={`day-${day}`} data-shortcode={day.toUpperCase()}><span> {day} </span></label>
								</li>
							)
						}
					</ul>
					<Schedule
						day={this.state.day}
						schedules={this.props.schedules}
						changeSchedule={this.props.changeSchedule}
						newSchedule={this.props.newSchedule}
						updateSchedule={this.props.updateSchedule}
						removeSchedule={this.props.removeSchedule}
					/>
				</div>
			</div>
		);
	}
}
function mapDispatchToProps(dispatch) {
	return {
		saveSchedule: (id) => dispatch(saveSchedule(id)),
		getSchedule: (id) => dispatch(getSchedule(id)),
		changeSchedule: (data, id) => dispatch(changeSchedule(data, id)),
		newSchedule:  (schedule, day) => dispatch(newSchedule(schedule, day)),
		removeSchedule: (schedule, day)  => dispatch(removeSchedule(day, index)),
		updateSchedule: (schedule, day, index) => dispatch(updateSchedule(schedule, day, index)),
	};
}

const mapStateToProps = createStructuredSelector({
	schedules: getSchedules(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'gymSchedule', reducer });
const withSaga = injectSaga({ key: 'gymSchedule', saga });

export default compose(withReducer, withSaga, withConnect)(GymSchedule);
