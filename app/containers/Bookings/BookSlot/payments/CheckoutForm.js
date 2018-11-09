
import React from 'react';
import {injectStripe} from 'react-stripe-elements';
import CardSection from './CardSection';

class CheckoutForm extends React.Component {
  handleSubmit = (ev) => {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();
    this.props.stripe.createToken({name: 'Jenny Rosen'}).then(({token}) => {  
      this.props.addCard(token.id)
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row add-card-row">
          <div className="col-md-9">
            <CardSection/>
          </div>
          <div className="col-md-3">
            <button className="btn btn-secondary btn-sm btn-block btn-addcard">Add Card</button>
          </div>
        </div>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);