import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import Gallery from 'react-grid-gallery';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import BookingList from 'components/BookingList';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { weekDays, getDate } from 'utils/helper';
import config from 'utils/config/development.js';
import MyStoreCheckout from './MyStoreCheckout';
import reducer from '../reducer';
import saga from '../saga';
import { StripeProvider } from 'react-stripe-elements';


class paymentIntegration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			day: 'sunday',
			users: [],
			payableAmount: 0,
			cardId: '',
			paymentType: 'online'
		}
		this.payOnline = this.payOnline.bind(this);
		this.selectCard = this.selectCard.bind(this);
		this.checkForCard = this.checkForCard.bind(this);
	}
	componentDidMount() {
		if (this.props.customerId)
			this.props.listCards(this.props.customerId)
		if (this.props.slots && this.props.user) {
			let payableAmount = this.state.payableAmount;
			let paymentType = this.state.paymentType;
			this.props.slots.amount <= this.props.user.credits ? (payableAmount = 0, paymentType = 'credits') :
				(this.props.user.credits === 0 ? (payableAmount = this.props.slots.amount, paymentType = 'online') :
					(payableAmount = this.props.slots.amount - this.props.user.credits, paymentType = 'creditsAndPay'))
			this.setState({ payableAmount, paymentType })
		}
	}
	payOnline(e) {
		e.preventDefault();

		const params = {
			card: this.state.cardId,
			payableAmount: this.state.payableAmount,
			amount: this.props.slots.amount,
			paymentType: this.state.paymentType,
			gymId: this.props.gymId,
			userType: this.props.user.userType
		}
		this.props.payOnline(params)
	}
	checkForCard() {
		return (this.state.payableAmount == 0 || this.state.payableAmount > 0 && this.state.cardId) ? true : false
	}

	selectCard(id) {
		this.setState({ cardId: id })
	}


	render() {
		const { customerId, cards } = this.props;
		return (
			<StripeProvider apiKey={config.stripeKey}>
				<div className="container payment">
					<h3 className="ttl text-uppercase">Payment</h3>
					<div className="row">
						<div className="col-md-8">
							<h4 className="col-ttl">Payment Details</h4>


							<div className="pay-bx">
								{this.state.payableAmount > 0 && <h4 className="ttl">Saved Cards</h4>}
								<div className="responsive-table">
									<table className="saved-cards">
										<tr className="add-new" data-target="#addNewCard" data-toggle="modal">
											{
												this.state.payableAmount > 0 && ( !customerId || !this.props.cards || (this.props.cards&& !this.props.cards.length)) ? <td colSpan="3">
													<MyStoreCheckout addCard={this.props.addCard} />
												</td> : ''
											}

											{/* <td colspan="2">
										<figure>
											<img src="images/temp/dummy-card.jpg" alt="" />
											<figcaption>
												<span>Add New Card</span>
											</figcaption>
										</figure>
									</td> */}
										</tr>
										{this.state.payableAmount > 0 && this.props.cards && this.props.cards.length ? this.props.cards.map((card) =>
											<tr>
												<td>
													<label className="containercheck">
														<input className="chcked-sect" type="checkbox" onClick={() => this.selectCard(card.id)} />
														<span className="checkmark">
															<div className="background-white"></div>
														</span>
													</label>
												</td>
												<td>
													<figure>
														<img src="images/temp/saved-card-01.jpg" alt="" />
														<figcaption>
															<h5 className="cardname">{card.name}</h5>
															<span className="cardno">{`**** **** **** ${card.last4}`}</span>
														</figcaption>
													</figure>
												</td>
												{/* <td>
													<ul className="controls list-unstyled pull-right">
														<li>
															<a href=""><i className="fa fa-pencil-square-o"></i></a>
														</li>
														<li>
															<a href=""><i className="fa fa-trash"></i></a>
														</li>
													</ul>
												</td> */}
											</tr>
										) : ''}


									</table>
								</div>

								<div className="pay-submit" disabled={!this.checkForCard()} onClick={(e) => this.payOnline(e)}>
									<a className="btn btn-secondary" disabled={!this.checkForCard() || !this.props.cards || !this.props.cards.length}
									>
										{`Pay ${this.props.slots ? this.props.slots.amount : 0}`}
									</a>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<h4 className="col-ttl">Order Summary</h4>
							<div className="pay-bx">
								<ul className="payment-summary list-unstyled">
									<li className="row">
										<span className="col-md-7 col-xs-8">Your Credits</span>
										<span className="col-md-5 col-xs-4 amuont">{this.props.user ? this.props.user.credits : 0}</span>
									</li>
									<li className="row">
										<span className="col-md-7 col-xs-8">Online Pay</span>
										<span className="col-md-5 col-xs-4 amuont">{this.state.payableAmount}</span>
									</li>
								</ul>
								<div className="summary-total">
									<div className="row">
										<div className="col-md-7 col-xs-8">Total Payable</div>
										{
											this.props.slots ?
												<div className="col-md-5 col-xs-4 amuont">{this.props.slots ? this.props.slots.amount : 0}</div>
												: 0
										}

									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</StripeProvider>
		)
	}
}
export default paymentIntegration;
