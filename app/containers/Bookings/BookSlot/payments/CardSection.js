// CardSection.js
import React from 'react';
import {CardElement} from 'react-stripe-elements';

class CardSection extends React.Component {
  render() {
    return (
        <CardElement 
          className="stripe-class"
          />
    );
  }
}

export default CardSection;