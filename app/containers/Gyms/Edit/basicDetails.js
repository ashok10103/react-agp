
import React, { Component } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';
import Gallery from 'react-grid-gallery';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Image from 'react-image-resizer';
import { RegionDropdown } from 'react-country-region-selector';

let countryData = require('../../../assets/country.json')
// /home/dev/Desktop/vandana/AirGym-Web/app/assets/country.json


const style = {
	image: {
		background: '#fefefe',
	},
};

const validations = {
	name: ["empty:Name"],
	gymInfo: ["empty:Gym Info"],
	country: ["empty:Country"],
	cost: ["empty:Cost"],
	currency: ["empty:Currency"],
	phoneNumber: ["empty:Phone number"],
}

const currencyOptions = [
	{ value: 'USD', label: 'United States Dollars' },
	{ value: 'EUR', label: 'Euro' },
	{ value: 'GBP', label: 'United Kingdom Pounds' },

]



export class BasicDetails extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			address: {},
			countryName: '',
			region:''
		};
		this.handleOnChange = this.handleOnChange.bind(this);
		this.handleCurrencyOnChange = this.handleCurrencyOnChange.bind(this);
		this.handleInfoChange = this.handleInfoChange.bind(this);
		this.addressOnChange = this.addressOnChange.bind(this);
		this.costOnChange = this.costOnChange.bind(this);
		this.handleImageUpload = this.handleImageUpload.bind(this);
		this.removeImage = this.removeImage.bind(this);
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
		const address = this.props.edit.address.value
		address[target.name] = target.value;
		address['state'] = this.state.region;
		this.props.changeValue('address', address, );
	}
	costOnChange({ target }) {
		this.props.changeValue(target.name, target.value);
		this.props.validate(target.name, validations[target.name])
	}
	handleCurrencyOnChange({ value }) {
		this.props.changeValue('currency', value, );
		this.props.validate('currency', validations['currency'])
	}
	onSelectFlag(code) {

		const namee = this.getCountryName(code)
		this.props.changeValue('country', namee, );
		this.props.validate('country', validations['country'])
	}

	getImages(images) {
		const imageArray = images.map((image) => {
			return {
				src: image,
				thumbnail: image,
				thumbnailWidth: 320,
				thumbnailHeight: 212,
			}
		})
		return imageArray
	}
	selectRegion (val) {
		const d= this.props.data.address.value
		d['state']=val
		this.props.changeValue('address', d);
	  }
	handleImageUpload(e) {
		e.preventDefault();
		if (e.target.files[0].type === 'image/jpeg' || e.target.files[0].type === 'image/png') {
			this.setState({ fileFormat: false });
			const reader = new FileReader();
			const imageFile = e.target.files[0];
			this.props.uploadImages(imageFile, this.props.match.params.gymId)
			reader.onloadend = () => {
				this.setState({ preview: reader.result, file: imageFile });
				const fileType = [{
					fileName: imageFile.name,
					fileType: imageFile.type,
				}];
			};
			reader.readAsDataURL(imageFile);
		} else {
			this.setState({ preview: '' });
		}
	}
	removeImage(image) {
		this.props.removeImage(image, this.props.match.params.gymId);
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

		const { data } = this.props;
		return (
			<div id="basicInfo" className="tab-pane fade in active">
				<form className="form-horizontal">
					<div className="form-group">
						<label className="control-label col-sm-3">Name of Gym</label>
						<div className="col-sm-9">
							<input type="text" name="name" className="form-control" value={data && data.name.value} placeholder="Your answer" onChange={this.handleOnChange} />
							<span className="message">
								{data.name.errors.map(e => (
									<span key={e}>{e}</span>
								))}
							</span>
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-3">Gym Info</label>
						<div className="col-sm-9">
							<input type="text" name="gymInfo" className="form-control" value={data && data.gymInfo.value} placeholder="Your answer" onChange={this.handleInfoChange} />
							<span className="message">
								{data.gymInfo.errors.map(e => (
									<span key={e}>{e}</span>
								))}
							</span>
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-12">Gym Image</label>
						<div className="col-sm-12">

							<div className="upload-gym-images">
								<p>Upload images of your gym</p>
								<ul className="gym-images list-unstyled">
									<li>
										<div className="upload-img">
											<input type="file" accept="image/x-png,image/gif,image/jpeg" multiple onChange={(e) => this.handleImageUpload(e, this.props.match.params.gymId)} />
											<span>+</span>
										</div>
									</li>

								</ul>
								{
									data && data.gymImages.value && data.gymImages.value.length ?
										<div className="col-md-12">
											<section className="sc-gallery">
												<h2 className="ttl">Gallery</h2>
												<ul className="uploaded-photos list-unstyled clearfix">
													{
														data.gymImages.value && data.gymImages.value.length ?
															data.gymImages.value.map((img) =>
																<li className="" >
																	<div className="img-wrp" >
																		{/* <div onClick={(e) => this.removeImage(img)}> <span> <i className="fa fa-close"></i></span> </div> */}
																		<Image
																			src={img}
																			alt=""
																			height={200}
																			width={200}
																			style={style.image}
																		/>
																	</div>
																	<div className="img-delete" onClick={(e) => this.removeImage(img)}><i className="fa fa-close"></i></div>

																</li>
															)
															: ''
													}

												</ul>

											</section>
										</div>
										: ''
								}
							</div>
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-3">Address line 1</label>
						<div className="col-sm-9">
							<input type="text" name="addressLine1" className="form-control" value={data && data.address.value.addressLine1} placeholder="Your answer" onChange={this.addressOnChange} />
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-3">Address line 2</label>
						<div className="col-sm-9">
							<input type="text" name="addressLine2" className="form-control" value={data && data.address.value.addressLine2} placeholder="Your answer" onChange={this.addressOnChange} />
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-3">City</label>
						<div className="col-sm-9">
							<input type="text" name="city" className="form-control" value={data && data.address.value.city} placeholder="Your answer" onChange={this.addressOnChange} />

						</div>
					</div>
					
					<div className="form-group">
						<label className="control-label col-sm-3">Select Country</label>
						<div className="col-sm-9">
							{/* <input type="text" name="country" className="form-control" value={data && data.address.value.country} placeholder="Your answer" onChange={this.addressOnChange} /> */}
							{this.props.data.country && this.props.data.country.value &&
								<ReactFlagsSelect
									searchable={true}
									defaultCountry={this.getCountryCode(this.props.data.country.value)}
									ref="userFlag"
									onSelect={(e) => this.onSelectFlag(e)}
									className="form-control text-color"
								/>
							}
							{this.props.data.country.value &&
								data.country.errors.length > 0 && (
									<span className="message">
										{data.country.value.map(e => (
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
									        this.props.data.country&&
									       this.props.data.country.value
								        }
								        value= {data && data.address.value.state}
								        onChange={val => this.selectRegion(val)}
								        showDefaultOption={true}
								        defaultOptionLabel={data && data.address.value.state}
								        classes="form-control text-color"/>
							
						</div>
					</div>
						<div className="form-group">
						<label className="control-label col-sm-3">Zip code</label>
						<div className="col-sm-9">
							<input type="number" name="zip" className="form-control" value={data && data.address.value.zip} placeholder="Your answer" onChange={this.addressOnChange} />
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-3">Landmark</label>
						<div className="col-sm-9">
							<input type="text" name="landmark" className="form-control" value={data && data.address.value.landmark} placeholder="Your answer" onChange={this.addressOnChange} />
						</div>
					</div>
					<div className="form-group">
						<label className="control-label col-sm-3">Rate per hour</label>
						<div className="col-sm-9">
							<input type="number" name="cost" className="form-control" value={data && data.cost.value} placeholder="Enter your rate per hour" onChange={this.costOnChange} />
							<span className="message">
								{data.cost.errors.map(e => (
									<span key={e}>{e}</span>
								))}
							</span>
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-3">currency</label>
						<div className="col-sm-9">
							{/* <input className="form-control"
                  value={this.props.fields.field2.currency.value}
                  placeholder="$"
                  name="currency" type="text"
                  onChange={this.handleOnChange}
                /> */}
							<Dropdown options={currencyOptions} className='form-control ' controlClassName="my-control"  onChange={this.handleCurrencyOnChange} value={data.currency.value} placeholder="Select an currency" />

							{data.currency &&
								data.currency.errors.length > 0 && (
									<span className="message">
										{data.currency.errors.map(e => (
											<span key={e}>{e}</span>
										))}
									</span>
								)}
						</div>
					</div>

					<div className="form-group">
						<label className="control-label col-sm-3">Phone number</label>
						<div className="col-sm-9">
							<input type="number" name="phoneNumber" className="form-control" value={data && data.phoneNumber.value} placeholder="Your answer" onChange={this.handleOnChange} />
							<span className="message">
								{data.phoneNumber.errors.map(e => (
									<span key={e}>{e}</span>
								))}
							</span>
						</div>
					</div>
				</form>
			</div>
		);
	}
}




export default BasicDetails;