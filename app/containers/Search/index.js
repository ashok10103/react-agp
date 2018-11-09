import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';
import ListView from './listView'
import FilterView from './filterView'
import { updateUser, getGyms, getTrainers, setFilters, setPageNumber } from './actions';
import { getSettings, getTrainerSettings, fetchGyms, fetchTrainers, fetchFilters, getCount, getPageNumber } from './selectors';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { getUserclassName, setUserState, getUserType } from '../../utils/helper';
import { makeSelectCurrentUser } from '../App/selectors';
import MapView from './mapView';

const userType = getUserType();

const validations = {
	emailId: 'email',
	password: ['minLength:6'],
	phoneNumber: ['empty:Phone number'],
	firstName: ['empty:First Name'],
};
const notificationOpts = {
	// uid: 'once-please', // you can specify your own uid if required
	title: '',
	message: '',
	position: 'tc',
	autoDismiss: 5
};
class searchView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showList: true,
			filter: 'gym'
		};
		this.triggerListView = this.triggerListView.bind(this);
		this.changeFilter = this.changeFilter.bind(this);
	}
	componentDidMount() {
		setUserState(`/search/${this.props.match.params.gymId}/${this.props.match.params.userId}`)
	}

	triggerListView() {
		this.setState({ showList: !this.state.showList })
	}
	changeFilter(filter) {
		this.setState({ filter })
	}
	render() {

		const { showProfile, toggleModal, settings, trainerSettings, gyms, trainers, user } = this.props;
		const { editable } = this.state;

		return (
			<div className="contentarea p-scheduler">
				<div className="container">
					<h2 className="ttl">Home</h2>
					<div className="row">
						<div className="col-md-8 col-lg-9">
							<div className="gym-locator-hd clearfix">
								<div className="list-sec pull-left">List</div>
								<div className="map-sec pull-right">Map</div>
							</div>
							<div className={cx("gym-locator", {
								"list-open": this.state.showList,
							})}>
								{/* {this.state.showList ? */}
								<div>
									{((gyms && gyms.length) || (trainers && trainers.length)) ?
										<ListView
											show={this.state.showList}
											gyms={gyms}
											trainers={trainers}
											filter={this.state.filter}
											filterTypes={this.props.filterTypes}
											getTrainers={this.props.getTrainers}
											getGyms={this.props.getGyms}
											changeFilter={this.changeFilter}
											history={this.props.history}
											setFilters={this.props.setFilters}
											count={this.props.count}
											pageNumber={this.props.pageNumber}
											setPageNumber={this.props.setPageNumber}
										/> : ''
									}

								</div>
								{/* : ''} */}
								{((gyms && gyms.length) || (trainers && trainers.length)) ?
								<MapView
									gyms={gyms}
									trainers={trainers}
									history={this.props.history}
									filter={this.state.filter}
								/>
								: ''}
								<button className="gym-list-trigger" title="View List" onClick={this.triggerListView}>
									<i className="fa fa-bars" aria-hidden="true"></i>
								</button>
							</div>
						</div>
						<FilterView
							settings={settings}
							trainerSettings={trainerSettings}
							getTrainers={this.props.getTrainers}
							getGyms={this.props.getGyms}
							changeFilter={this.changeFilter}
							setFilters={this.props.setFilters}
							user={this.props.user}
							setPageNumber={this.props.setPageNumber}
							pageNumber={this.props.pageNumber}
						/>
					</div>
				</div>
			</div>
		);
	}
}
function mapDispatchToProps(dispatch) {
	return {
		updateUser: (user, id, file, handler) =>
			dispatch(updateUser(user, id, file, handler)),
		getTrainers: (params, loadMore) =>
			dispatch(getTrainers(params, loadMore)),
		getGyms: (params, limit, loadMore) =>
			dispatch(getGyms(params, limit, loadMore)),
		setFilters: (params) =>
			dispatch(setFilters(params)),
		setPageNumber: (number) =>
			dispatch(setPageNumber(number)),
	};
}
const mapStateToProps = createStructuredSelector({
	settings: getSettings(),
	gyms: fetchGyms(),
	trainers: fetchTrainers(),
	trainerSettings: getTrainerSettings(),
	filterTypes: fetchFilters(),
	count: getCount(),
	user: makeSelectCurrentUser(),
	pageNumber: getPageNumber()

});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'search', reducer });
const withSaga = injectSaga({ key: 'search', saga });

export default compose(withReducer, withSaga, withConnect)(searchView);
