import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import InfiniteScroll from 'redux-infinite-scroll';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { changeValue, validate, submit, getSettings, moveToNext } from './actions';
import { getFields,fetchFilters, getValid, submitErr, getSubmitting, fetchSettings } from './selectors';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';

const dataa = {
	gym: {
		gymType: [],
		guestAccessType: [],
		paymentType: [],
		amenities: [],
	},
	trainer: {
		trainerType: [],
		certificates: [],
	}
}
class filterView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			paymentType: [],
			guestAccessType: [],
			filter: 'gym',
			latitude: '',
			longitude: '',
			filterParams_gym: {
				gymType: [],
				guestAccessType: [],
				paymentType: [],
				amenities: [],
			},
			filterParams_trainer: {
				trainerType: [],
				certificates: [],
			},
			volume: 50
		};
		this.loadMore = this.loadMore.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
		this.handleDropDown = this.handleDropDown.bind(this);
		this.getFilterResults = this.getFilterResults.bind(this);
		this.clearFilter = this.clearFilter.bind(this);
		this.changeDistance = this.changeDistance.bind(this);
		this.filterByDistance = this.filterByDistance.bind(this);
	}

	componentDidMount() {
		const location = window.navigator && window.navigator.geolocation;
		if (location) {
			location.getCurrentPosition((position) => {
				this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude }, () => {
					const paramObj = {};
					if (this.state.latitude && this.state.longitude) {
						paramObj.latitude = this.state.latitude;
						paramObj.longitude = this.state.longitude;
						paramObj.distanceValue = this.state.volume || 50;
						this.props.setFilters(paramObj);
						this.props.getGyms(paramObj);
						this.props.getTrainers(paramObj);
					}
				});

			}, (error) => {
				// this.setState({ latitude: 'err-latitude', longitude: : 'err-longitude' })
			})
		}
	}
	loadMore(e) {
		// this.props.moveToNext('level', 3);
		// this.props.onSubmit(validations, "field2", e);
	}
	handleFilter() {
		const currentFilter = this.state.filter === 'gym' ? 'trainer' : 'gym';
		this.props.changeFilter(currentFilter)
		this.setState({ filter: currentFilter })
	}
	handleDropDown({ target }) {
		const filter = this.state.filter;
		const filterValues = this.state[`filterParams_${filter}`]
		if (!filterValues[target.name].includes(target.value)) {
			filterValues[target.name].push(target.value);
			this.setState({ [`filterParams_${filter}`]: filterValues }, () => {
				this.getFilterResults(filterValues);
				// this.forceUpdate();
			});
		} else {
			const index = filterValues[target.name].indexOf(target.value);
			if (index !== -1) filterValues[target.name].splice(index, 1);
			this.setState({ [`filterParams_${filter}`]: filterValues }, () => {
				this.getFilterResults(filterValues);
				this.forceUpdate();
			});
		}
	}
	getFilterResults(params) {
		const paramObj = params || {};
		if (this.state.latitude && this.state.longitude) {
			paramObj.latitude = this.state.latitude;
			paramObj.longitude = this.state.longitude;
			paramObj.distanceValue = this.state.volume || 50;
			this.props.setFilters(paramObj);
			this.props.setPageNumber(1);
			this.state.filter === 'gym' ? this.props.getGyms(paramObj) : this.props.getTrainers(paramObj)
		}
	}
	clearFilter() {
		const data = {
			gym: {
				gymType: [],
				guestAccessType: [],
				paymentType: [],
				amenities: [],
			},
			trainer: {
				trainerType: [],
				certificates: [],
			}
		}
		this.setState({ [`filterParams_${this.state.filter}`]: data[this.state.filter], volume: 50 }, () => {
			this.getFilterResults();
		})
	}
	changeDistance(value) {		
		this.setState({
			volume: value
		})
	}
	filterByDistance() {
		const filter = this.state.filter;
		const filterValues = this.state[`filterParams_${filter}`];		
		console.log(filterValues,"this is filterValues")
		this.getFilterResults(filterValues, this.props.pageNumber);
	}
	render() {
		const { gyms, settings, trainerSettings, user } = this.props;
		console.log(this.props,"fromnbo akjhsvduyavsdkja sdjhvagusyhdvakjnd ")
		return (
			<div className="col-md-4 col-lg-3">
				<div className="gym-locator-hd clearfix">
					<div className="filter-sec pull-left">Filters</div>
					<button className="btn-clearfilter pull-right" onClick={this.clearFilter}>Clear filter</button>
				</div>
				<div className="gym-filters">
					{user.userType === 'MEMBER' &&
						<h5>
							<span>Category</span>
						</h5>
					}
					{user.userType == 'MEMBER' &&
						<ul className="categories list-unstyled chk-list">
							<li>
								<label className="containercheck">Gym
									<input type="checkbox" checked={this.state.filter === 'gym' ? "checked" : ''} className="chcked-sect" onClick={this.handleFilter} />
									<span className="checkmark">
										<div className="background-white"></div>
									</span>
								</label>
							</li>
							<li>
								<label className="containercheck">Trainers
									<input type="checkbox" className="chcked-sect" checked={this.state.filter === 'trainer' ? "checked" : ''} onClick={this.handleFilter} />
									<span className="checkmark">
										<div className="background-white"></div>
									</span>
								</label>
							</li>
						</ul> }

					<h5><span>Distance</span></h5>
					<div className="distance-slider">
						<div>
							<Slider min={1} max={100} value={this.state.volume} step={1} onChange={this.changeDistance} onChangeComplete={this.filterByDistance} />
						</div>
					</div>
					{this.state.filter === 'gym' ?
						(<div>
							<h5><span>Gym Types</span></h5>
							<ul className="gym-types list-unstyled chk-list">
								{settings && settings.gymTypes ? (settings.gymTypes.map((gymType, index) =>
									<li key={index}>
										<label className="containercheck">{gymType.gymType}
											<input type="checkbox"
												className="chcked-sect"
												name='gymType'
												checked={
													this.state.filterParams_gym.gymType &&
														this.state.filterParams_gym.gymType.includes(gymType._id) ?
														'checked' : ''
												}
												value={gymType._id}
												onClick={this.handleDropDown}
											/>
											<span className="checkmark">
												<div className="background-white"></div>
											</span>
										</label>
									</li>
								)) : ''}
							</ul>
							<h5><span>Gym AccessTypes</span></h5>
							<ul className="gym-types list-unstyled chk-list">
								{settings && settings.gymAccessTypes ? (settings.gymAccessTypes.map((accessType, index) =>
									<li key={index}>
										<label className="containercheck">{accessType.name}
											<input type="checkbox"
												name='guestAccessType'
												checked={
													this.state.filterParams_gym.guestAccessType &&
														this.state.filterParams_gym.guestAccessType.includes(accessType._id) ?
														'checked' : ''
												}
												value={accessType._id}
												onClick={this.handleDropDown}
												className="chcked-sect" />
											<span className="checkmark">
												<div className="background-white"></div>
											</span>
										</label>
									</li>
								)) : ''}
							</ul>
							<h5><span>Amenities</span></h5>
							<ul className="gym-types list-unstyled chk-list">
								{settings && settings.amenities ? (settings.amenities.map((amenity, index) =>
									<li key={index}>
										<label className="containercheck">{amenity.name}
											<input type="checkbox"
												name='amenities'
												checked={
													this.state.filterParams_gym.amenities &&
														this.state.filterParams_gym.amenities.includes(amenity._id) ?
														'checked' : ''
												}
												value={amenity._id}
												onClick={this.handleDropDown}
												className="chcked-sect" />
											<span className="checkmark">
												<div className="background-white"></div>
											</span>
										</label>
									</li>
								)) : ''}
							</ul>
							</div>) : 
				
						(<div>
							<h5><span>Trainer Types</span></h5>
							<ul className="gym-types list-unstyled chk-list">
								{trainerSettings && trainerSettings.trainer_types ? (trainerSettings.trainer_types.map((trainer_type, index) =>
									<li key={index}>
										<label className="containercheck">{trainer_type.trainerType}
											<input type="checkbox"
												className="chcked-sect"
												name='trainerType'
												checked={
													this.state.filterParams_trainer.trainerType &&
														this.state.filterParams_trainer.trainerType.includes(trainer_type._id) ?
														'checked' : ''
												}
												value={trainer_type._id}
												onClick={this.handleDropDown}
											/>
											<span className="checkmark">
												<div className="background-white"></div>
											</span>
										</label>
									</li>
								)) : ''}
							</ul>
							<h5><span>Certificates</span></h5>
							<ul className="gym-types list-unstyled chk-list">
								{trainerSettings && trainerSettings.certificates ? (trainerSettings.certificates.map((certificate, index) =>
									<li key={index}>
										<label className="containercheck">{certificate.name}
											<input type="checkbox"
												name='certificates'
												checked={
													this.state.filterParams_trainer.certificates &&
														this.state.filterParams_trainer.certificates.includes(certificate._id) ?
														'checked' : ''
												}
												value={certificate._id}
												onClick={this.handleDropDown}
												className="chcked-sect" />
											<span className="checkmark">
												<div className="background-white"></div>
											</span>
										</label>
									</li>
								)) : ''}
							</ul>
						</div>
						)}
				</div>
			</div>
		);
	}
}


const mapStateToProps = createStructuredSelector({
	
	
	as: fetchFilters(),
	// count: getCount(),
	
	// pageNumber: getPageNumber()

});

export default connect(mapStateToProps)(filterView);
