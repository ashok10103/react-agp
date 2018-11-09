import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'redux-infinite-scroll';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import { GymData } from './selectors';

import { getGymList } from './actions';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { getUserclassName , getUserLocation} from '../../../utils/helper';
export class GymList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
    };
    this.loadMore = this.loadMore.bind(this);
  }
  componentDidMount() {
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
      location.getCurrentPosition((position) => {
        this.props.getGymList({latitude: position.coords.latitude, longitude: position.coords.longitude, distance: 10000000000000, limit: 100 });
        this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude });
      }, (error) => {
        // this.setState({ latitude: 'err-latitude', longitude: : 'err-longitude' })
      })
    } 
  }
  loadMore() {    
    if (this.state.latitude && this.state.longitude) {
      this.props.getGymList({latitude: this.state.latitude, longitude: this.state.longitude, distance: 10000000000000, limit: 50 })
    }
  }
  render() {
    
    return (
      <div className="contentarea">
        <div className="container">
          <ul className="list-unstyled profile-list">
           {
             this.props.gyms && this.props.gyms.map((gym, index) => {
               return (<li key={gym._id} className="list-item clearfix">
              <div className="col-left">
                <a className="img-wrp">
                  <img src={gym.gymImages && gym.gymImages.length ? gym.gymImages[0] : '/default.png'} alt="" />
                </a>
              </div>
              <div className="col-right">
                <div className="row">
                  <div className="col-md-8">
                    <div className="item-header clearfix">
                      <h3 className="item-ttl">{gym.name}</h3>
                      <span className="star-rating">
                        <span className="rating"><span style={{ "width":"80%" }}></span></span>
                        <span className="text">(5.0)</span>
                      </span>
                    </div>
                    <p className="desc">{gym.description} </p>
                    <p><i className="fa fa-phone" aria-hidden="true"></i><span>009 200 500 122</span></p>
                    <p><i className="fa fa-address-card" aria-hidden="true"></i>
                      <span>{gym.address && gym.address.addressLine1 }</span>
                      <span>{gym.address && gym.address.addressLine2 }</span>
                    </p>
                  </div>
                  <div className="col-md-4 text-center">
                    <Link to={`/gyms/${gym._id}`} replace>
                      <span className='btn btn-primary btn-detail'>
                        Detail
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
               </li>
               )
             })
           }
          </ul>
        </div>
      </div>
    );
  }

}
function mapDispatchToProps(dispatch) {
  return {
    getGymList: (data) => dispatch(getGymList(data)),
  };
}

const mapStateToProps = createStructuredSelector({
  gyms: GymData(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'gymList', reducer });
const withSaga = injectSaga({ key: 'gymList', saga });

export default compose(withReducer, withSaga, withConnect)(GymList);
