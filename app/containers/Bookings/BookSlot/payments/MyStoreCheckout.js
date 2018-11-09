import React from 'react';
import {Elements} from 'react-stripe-elements';

import InjectedCheckoutForm from './CheckoutForm';

export default class MyStoreCheckout extends React.Component {
  render() {
    return (
      <Elements  style={{border: '#d2d2d2 1px solid', padding: '10px'}}>
        <InjectedCheckoutForm addCard={this.props.addCard} />
      </Elements>
    );
  }
}
