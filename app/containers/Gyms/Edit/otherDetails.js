import React, { Component } from 'react';


const validations = {
	
    guestAccessType: ["empty:Gym Access Type"],
	paymentType: ["empty:Payment Type"],
	gymRules: ["empty:Gym Rules"],
	maxMembers: ["empty:Max Members"],
	gymType: ["empty:Gym Type"],
	amenities: ["empty:Amenities"],
};

export class OtherDetails extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			paymentType: [],
			guestAccessType: [],
			gymRules: [],
		};
		this.handleDropDown = this.handleDropDown.bind(this);
		this.handleOnChange = this.handleOnChange.bind(this);
		this.handleDropDownSingle = this.handleDropDownSingle.bind(this);

	}

	componentDidMount() {

	}
	handleOnChange({ target }) {
		this.props.changeValue(target.name, target.value);
		this.props.validate(target.name, validations[target.name])
	}

	handleDropDown({ target }) {
		const arrayValues = this.props.data[target.name].value;
		if (!arrayValues.includes(target.value)) {
			arrayValues.push(target.value);
			this.props.changeValue(target.name, arrayValues);
			this.props.validate(target.name, validations[target.name])
		} else {
			const index = arrayValues.indexOf(target.value);
			if (index !== -1) arrayValues.splice(index, 1);
			this.props.changeValue(target.name, arrayValues);
			this.props.validate(target.name, validations[target.name])
		}
	}

	handleDropDownSingle({ target }) {
		const arrayValues = this.props.data.paymentType.value
		if (!arrayValues.includes(target.value)) {
			arrayValues.splice(0, 1, target.value);
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

	



	render() {
		const data = this.props.data;
		let validations= this.props.validation;
		const paymentsTypes = this.props.settings && this.props.settings.paymentsTypes;
		const gymAccessTypes = this.props.settings && this.props.settings.gymAccessTypes;
		const rules = this.props.settings && this.props.settings.rules;
		const amenities = this.props.settings && this.props.settings.amenities;
		const gymTypes = this.props.settings && this.props.settings.gymTypes;
	
		return (
			<div id="others" className="tab-pane fade">
				<form>
					<div className="fomr-control">

						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
									<label className="control-label">Max members</label>
									<input className="form-control" value={data.maxMembers.value} name="maxMembers" placeholder="Enter max members count" type="number" onChange={this.handleOnChange} />
									{data.maxMembers &&
										data.maxMembers.errors.length > 0 && (
											<span className="message">
												{data.maxMembers.errors.map(e => (
													<span key={e}>{e}</span>
												))}
											</span>
										)}
								</div>
							</div>
						</div>
						<label className="control-label">Payment Options</label>
						<div className="row">
							{paymentsTypes && paymentsTypes.map((paymentType) => {
								return <div className="col-sm-4" key={paymentType._id}>
									<label className="containercheck"> {paymentType.method}
										<input type="checkbox"
											checked={data.paymentType.value.length && data.paymentType.value.includes(paymentType._id) ? 'checked' : ''}
											className="chcked-sect"
											value={paymentType._id}
											name='paymentType'
											onClick={this.handleDropDownSingle}
										/>

										<span className="checkmark">
											<div className="background-white"></div>
										</span>
									</label>
								</div>
							}
							)}
							{data.paymentType &&
								data.paymentType.errors.length > 0 && (
									<span className="message">
										{data.paymentType.errors.map(e => (
											<span key={e}>{e}</span>
										))}
									</span>
								)}

						</div>
					</div>
					<div className="fomr-control">
						<label className="control-label">Gym access</label>
						<div className="row">
							{gymAccessTypes && gymAccessTypes.map((gymAccessType) => {
								return <div className="col-sm-4" key={gymAccessType._id}>
									<label className="containercheck"> {gymAccessType.name}
										<input type="checkbox"
											checked={data.guestAccessType.value.length && data.guestAccessType.value.includes(gymAccessType._id) ? 'checked' : ''}
											className="chcked-sect"
											value={gymAccessType._id}
											name='guestAccessType'
											onClick={this.handleDropDown}

										/>

										<span className="checkmark">
											<div className="background-white"></div>
										</span>
									</label>
								</div>
							}
							)}
							{data.guestAccessType &&
								data.guestAccessType.errors.length > 0 && (
									<span className="message">
										{data.guestAccessType.errors.map(e => (
											<span key={e}>{e}</span>
										))}
									</span>
								)}
						</div>
					</div>
					<div className="fomr-control">
						<label className="control-label">Gym Rules</label>
						<div className="row">
							{rules && rules.map((rule) => {
								return <div className="col-md-6" key={rule._id}>
									<label className="containercheck"> {rule.name}
										<input type="checkbox"
											checked={data.gymRules.value.length && data.gymRules.value.includes(rule._id) ? 'checked' : ''}
											className="chcked-sect"
											value={rule._id}
											onClick={this.handleDropDown}
											name='gymRules'

										/>

										<span className="checkmark">
											<div className="background-white"></div>
										</span>
									</label>
								</div>
							}
							)}
							{data.gymRules &&
								data.gymRules.errors.length > 0 && (
									<span className="message">
										{data.gymRules.errors.map(e => (
											<span key={e}>{e}</span>
										))}
									</span>
								)}
						</div>
					</div>




					<div className="fomr-control">
						<label className="control-label">Gym Type</label>
						<div className="row">
							{gymTypes && gymTypes.map((gymtype) => {
								return <div className="col-md-6" key={gymtype._id}>
									<label className="containercheck" > {gymtype.gymType}
										<input type="checkbox"
											 checked={data.gymType.value.length && data.gymType.value.includes(gymtype._id) ? 'checked' : ''}
											className="chcked-sect"
											value={gymtype._id}
											onClick={this.handleDropDown}
											name='gymType'

										/>

										<span className="checkmark">
											<div className="background-white"></div>
										</span>
									</label>
								</div>
							}
							)}
							{data.gymType &&
								data.gymType.errors.length > 0 && (
									<span className="message">
										{data.gymType.errors.map(e => (
											<span key={e}>{e}</span>
										))}
									</span>
								)}

						</div>
					</div>




					<div className="fomr-control">
						<label className="control-label">Amenities</label>
						<div className="row">
							{amenities && amenities.map((amenity) => {
								return <div className="col-md-6" key={amenity._id}>
									<label className="containercheck" > {amenity.name}
										<input type="checkbox"
											checked={data.amenities.value.length && data.amenities.value.includes(amenity._id) ? 'checked' : ''}
											className="chcked-sect"
											value={amenity._id}
											onClick={this.handleDropDown}
											name='amenities'

										/>

										<span className="checkmark">
											<div className="background-white"></div>
										</span>
									</label>
								</div>
							}
							)}
							{data.amenities &&
								data.amenities.errors.length > 0 && (
									<span className="message">
										{data.amenities.errors.map(e => (
											<span key={e}>{e}</span>
										))}
									</span>
								)}
						</div>
					</div>
					<div className="row">
						<div className="col-md-6">
							<div className="form-group">
								<label className="control-label">Descriptions</label>
								<input type="text" name="description" className="form-control" value={data && data.description.value} placeholder="Your answer" onChange={this.handleOnChange} />

							</div>
						</div>
					</div>

				</form>
			</div>
		);
	}
}




export default OtherDetails;
