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
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import { RegionDropdown } from 'react-country-region-selector';

let countryData = require('../../../assets/country.json')


const validations = {
	trainerInfo: ["empty:Trainer Info"],
	country: ["empty:country"],
	trainerType: ["empty:Trainer type"],
	certificates: ["empty:certificates"],

};
let address

class BasicDetails extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			countryName: '',
			region: this.props.fields.address&& this.props.fields.address.value.state,
			addresss:this.props.fields.address&&this.props.fields.address.value
			
		};
		this.handleOnChange = this.handleOnChange.bind(this);
		this.handleInfoChange = this.handleInfoChange.bind(this);
		this.addressOnChange = this.addressOnChange.bind(this);
		this.getCountryCode = this.getCountryCode.bind(this);
		this.getCountryName = this.getCountryName.bind(this);
		this.selectRegion = this.selectRegion.bind(this);

	}
	handleOnChange({ target }) {
		this.props.changeValue(target.name, target.value);
		this.props.validate(target.name, validations[target.name])
	}
	handleInfoChange({ target }) {
		this.props.changeValue(target.name, target.value);
		this.props.validate(target.name, validations[target.name])
	}
	addressOnChange({ target }) {
		address = this.props.fields.address.value
		address[target.name] = target.value;
		this.props.changeValue('address', address);
	}
	selectRegion (val) {
	
		const d=this.props.fields.address.value
		d['state']=val
		this.props.changeValue('address', d);
		
	  }

	onSelectFlag(code) {

		const namee = this.getCountryName(code)
		this.props.changeValue('country', namee, );
		this.props.validate('country', validations['country'])
	}

	getCountryCode(value) {
		let countryCode
		Object.keys(countryData).forEach(function (key) {

			if (countryData[key].label == value) {

				countryCode = countryData[key].value
			}
		});
		return countryCode
	}
	getCountryName(value) {

		let countryName
		Object.keys(countryData).forEach(function (key) {

			if (countryData[key].value == value) {

				countryName = countryData[key].label
			}
		});
		return countryName
	}



	render() {
		const data = this.props;
		
		
		return (
			<div id="basicInfo" className="tab-pane fade in active">
				<form className="form-horizontal">
					<div className="form-group">
						<label className="control-label col-sm-12">Trainer Info</label>
						<div className="col-sm-12">
							<input type="text" className="form-control" name="trainerInfo" value={data && data.fields.trainerInfo.value} placeholder="Your answer" onChange={this.handleInfoChange} />
							<span className="message">
								{data && data.fields.trainerInfo.errors.map(e => (
									<span key={e}>{e}</span>
								))}
							</span>
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-3">Address line 1</label>
						<div className="col-sm-9">
							<input type="text" className="form-control" name="addressLine1" value={data && data.fields.address.value.addressLine1} placeholder="Your answer" onChange={this.addressOnChange} />
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-3">Address line 2</label>
						<div className="col-sm-9">
							<input type="text" className="form-control" name="addressLine2" value={data && data.fields.address.value.addressLine2} placeholder="Your answer" onChange={this.addressOnChange} />
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-3">City</label>
						<div className="col-sm-9">
							<input type="text" name="city" className="form-control" value={data && data.fields.address.value.city} placeholder="Your answer" onChange={this.addressOnChange} />

						</div>
					</div>
					
					<div className="form-group">
						<label className="control-label col-sm-3">Select Country</label>
						<div className="col-sm-9">

							{data && data.fields.country && data && data.fields.country.value &&
								<ReactFlagsSelect
									searchable={true}
									defaultCountry={this.getCountryCode(data && data.fields.country.value)}
									ref="userFlag"
									onSelect={(e) => this.onSelectFlag(e)}
									className="form-control"
								/>
							}
							{data && data.fields.country.value &&
								data.fields.country.errors.length > 0 && (
									<span className="message">
										{data.fields.country.value.map(e => (
											<span key={e}>{e}</span>
										))}
									</span>
								)}
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-3">State</label>
						<div className="col-sm-9">
						<RegionDropdown
								        country={
									     data&&
								        data.fields.country.value
								        }
								        value= {data && data.fields.address.value.state}
								        onChange={val => this.selectRegion(val)}
								        showDefaultOption={true}
								        defaultOptionLabel={data && data.fields.address.value.state}
								        classes="form-control text-color"/>
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-3">Zip code</label>
						<div className="col-sm-9">
							<input type="number" name="zip" min="0" className="form-control" value={data && data.fields.address.value.zip} placeholder="Your answer" onChange={this.addressOnChange} />
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-3">Landmark</label>
						<div className="col-sm-9">
							<input type="text" name="landmark" className="form-control" value={data && data.fields.address.value.landmark} placeholder="Your answer" onChange={this.addressOnChange} />
						</div>
					</div>
				</form>
			</div>
		);
	}
}
export default BasicDetails;
