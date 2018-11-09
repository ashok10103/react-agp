import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap';
import { GoogleMap, Marker, InfoWindow } from "react-google-maps"
import cx from 'classnames';
import MapComponent from 'components/Map';

import { changeValue, validate, submit, getSettings, moveToNext } from './actions';
import { getFields, getValid, submitErr, getSubmitting, fetchSettings } from './selectors';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';

const validations = {
  guestAccessType: ["empty:guestAccessType"],
  cost: ["empty:cost"],
  paymentType: ["empty:paymentType"],
};

const styles = {
  "width": "64%",
  "height": "100%",
  "float": "right",
}
class MapView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      paymentType: [],
      guestAccessType: [],
      latitude: '',
      longitude: '',
      showInfo: ''
    };
    this.loadMore = this.loadMore.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.setMapCom = this.setMapCom.bind(this);
  }

  componentDidMount() {
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
      location.getCurrentPosition((position) => {
        this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude })

      }, (error) => {
        // this.setState({ latitude: 'err-latitude', longitude: : 'err-longitude' })
      })
    }
  }
  loadMore(e) {
    // this.props.moveToNext('level', 3);
    // this.props.onSubmit(validations, "field2", e);
  }
  onMarkerClick(id) {
    const path = this.props.filter === 'gym' ? `/gyms/${id}` : `/trainer/details/${id}`;
    this.props.history.push(path);

  }
  showInfo(id) {
    this.setState({ showInfo: id })
  }

  setMapCom(el) {

  }
  render() {
    const { gyms, trainers, filter } = this.props;
    return (
      <div className="map-cntr"  >
        {
          // ((gyms && gyms.length) || (trainers && trainers.length)) ?
            <MapComponent
              isMarkerShown
              gyms={gyms}
              trainers={trainers}
              lat={this.state.latitude}
              lon={this.state.longitude}
              onClick={this.onMarkerClick}
              info={this.state.showInfo}
              showInfo={this.showInfo}
              setMapCom={this.setMapCom}
              filter={filter}
            /> 
        }
        {/* <MapComponent
          isMarkerShown
          gyms={gyms}
          trainers={trainers}
          lat={this.state.latitude}
          lon={this.state.longitude}
          onClick={this.onMarkerClick}
          info={this.state.showInfo}
          showInfo={this.showInfo}
          setMapCom={this.setMapCom}
          filter={filter}
        /> */}
      </div>
    );
  }
}
export default MapView;
