import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const validations = {
	trainerInfo: ["empty:Trainer Info"],
    country: ["empty:Country"],
    trainerType: ["empty:Trainer type"],
    certificates: ["empty:Certificates"],
};

class OtherDetails extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			certificates: [],
			trainerType: [],
		};
		this.handleDropDown = this.handleDropDown.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}



	handleDropDown({ target }) {
		const arrayValues = this.state[target.name];
		if (!arrayValues.includes(target.value)) {
			arrayValues.push(target.value);
			this.setState({ [target.name]: arrayValues });
			this.props.changeValue(target.name, arrayValues, "field2");
			this.props.validate(target.name, validations[target.name], 'field2')
		} else {
			const index = arrayValues.indexOf(target.value);
			if (index !== -1) arrayValues.splice(index, 1);
			this.setState({ [target.name]: arrayValues });
			this.props.changeValue(target.name, arrayValues, "field2");
			this.props.validate(target.name, validations[target.name], 'field2')
		}
	}
	handleSubmit(e) {
		e.preventDefault()
		const location = window.navigator && window.navigator.geolocation;
		if (location) {
			location.getCurrentPosition((position) => {
				this.props.onSubmit(validations, "field2", e, position.coords.latitude, position.coords.longitude);

			}, (error) => {
				console.log(error);
			})
		} else {
			console.log('here in no locatin');

		}
	}
	render() {
		const { trainer_types, certificates } = this.props.settings;
		return (
			<form className="registration-section trainer">
				<div className="reg-box">
					<label htmlFor="">Trainer Types</label>
					<ul className="list-unstyled certificate-list clearfix">

						{trainer_types && trainer_types.map((trainer_type) => {
							return <li className="col-md-6">
								<label className="containercheck"> {trainer_type.trainerType}
									<input type="checkbox"
										checked={this.props.fields.field2.trainerType.value && this.props.fields.field2.trainerType.value.includes(trainer_type._id) ? 'checked' : ''}
										className="chcked-sect"
										value={trainer_type._id}
										name='trainerType'
										onClick={this.handleDropDown}
									/>
									<span className="checkmark">
										<div className="background-white"></div>
									</span>
								</label>
							</li>
						}
						)}
						{this.props.fields.field2.trainerType &&
							this.props.fields.field2.trainerType.errors.length > 0 && (
								<span className="message">
									{this.props.fields.field2.trainerType.errors.map(e => (
										<span key={e}>{e}</span>
									))}
								</span>
							)}


					</ul>

					<label htmlFor="">Certificates</label>
					<ul className="list-unstyled certificate-list clearfix">

						{certificates && certificates.map((certificate) => {
							return <li className="col-md-6">
								<label className="containercheck"> {certificate.name}
									<input type="checkbox"
										checked={this.props.fields.field2.certificates.value && this.props.fields.field2.certificates.value.includes(certificate._id) ? 'checked' : ''}
										className="chcked-sect"
										value={certificate._id}
										name='certificates'
										onClick={this.handleDropDown}
									/>
									<span className="checkmark">
										<div className="background-white"></div>
									</span>
								</label>
							</li>
						}
						)}
						{this.props.fields.field2.certificates &&
							this.props.fields.field2.certificates.errors.length > 0 && (
								<span className="message">
									{this.props.fields.field2.certificates.errors.map(e => (
										<span key={e}>{e}</span>
									))}
								</span>
							)}


					</ul>
					<div className="text-center">
						<input className="btn btn-next" type="submit" onClick={this.handleSubmit} />
					</div>
				</div>
			</form>

		);
	}
}
export default OtherDetails;
