import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import Gallery from 'react-grid-gallery';
import { createStructuredSelector } from 'reselect';
import cx from 'classnames';
import qs from "qs";
import StarRatings from 'react-star-ratings';
import { TrainerData, showRating, showNewRating } from './selectors';
import { makeSelectCurrentUser } from '../../App/selectors';
import BackgroundImage from '../../../assets/images/temp/registration-bg2.jpg';
import { getTrainerDetail, changeStar, sendStarRating, addRating } from './actions';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { getUserType, getUserClass, getMiles, setUserState } from 'utils/helper';
import reducer from './reducer';
import saga from './saga';

let name;

export class TrainerDetail extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            rating: '',
            urlParam: false
        };

        this.changeRating = this.changeRating.bind(this);
        this.handleStarSubmit = this.handleStarSubmit.bind(this);
        this.handleViewStarSubmit = this.handleViewStarSubmit.bind(this);
    }

    componentDidMount() {
        setUserState(`/trainer/details/${this.props.match.params.trainerId}`)
        const urlParam = qs.parse(this.props.location.search)['?rate'];        
        this.setState({ urlParam })
        const location = window.navigator && window.navigator.geolocation;
        if (location) {
            location.getCurrentPosition((position) => {
                this.props.getTrainerDetail({ latitude: position.coords.latitude, longitude: position.coords.longitude, distance: 10000000000000 }, this.props.match.params.trainerId);
            }, (error) => {
                // this.setState({ latitude: 'err-latitude', longitude: : 'err-longitude' })
            })
        }
    }
    handleViewStarSubmit() {
        return this.props.addRating()
    }

    changeRating(newRating, name) {
        this.setState({
            rating: newRating
        });
        return this.props.changeStarRating(newRating)
    }
    handleStarSubmit() {
        const newRatings = this.state.rating
        return this.props.sendStarRating(newRatings, this.props.match.params.userId, this.props.data.userId._id)
    }


    render() {
        const { data, newStar, user } = this.props;
        if (data) {
            const firstName = data.userId.firstName
            const lastName = data.userId.lastName
            name = firstName + '   ' + lastName
        }
        const ProfileImage = data && data.userId.profileImageUrl
        return (
            <div>
                <div className="dtl-banner with-profile-pic" style={{ backgroundImage: `url(${BackgroundImage})` }} >
                    <div className="profile-pic-wrp">
                        <div className="container">
                            <div className="profile-pic">
                                {data&&ProfileImage && <img src={ProfileImage} alt="" />}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contentarea detailpage">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-sm-7">
                                        <h2 className="ttl">{name && name}</h2>
                                        {data && data.trainerType ? data.trainerType.map((trainerTyp) =>
                                            <p className="text-additional"><strong> {trainerTyp.trainerType}</strong></p>
                                        ) : ''}

                                        {data &&
                                            <address className="gym-address">{data && data.address.addressLine1 && data.address.addressLine1} {' '}{data && data.address.addressLine2 && data.address.addressLine2}{' '}{data && data.address.city && data.address.city}{' '}{data && data.country && data.country} </address>

                                        }
                                        {/* <address className="gym-address">123 6th St.  Melbourne, FL 32904</address> */}
                                    </div>
                                    <div className="col-sm-5">
                                        <span className="star-rating pull-right">
                                            <span style={{ width: '80%' }}>
                                                {data && <StarRatings
                                                    starRatedColor="yellow"
                                                    rating={data.rating}
                                                    starDimension="12px"
                                                    starSpacing="2px"
                                                />}
                                
                                            </span>
                                        

                                        </span>
                                        <p className="km-run"><i className="sprite-run"></i><span>{getMiles(data && data.distanceFromLocation)} Miles</span></p>
                                    </div>
                                </div>
                                <p className="desc">{data && data.trainerInfo}</p>
                                {!this.state.urlParam && user.userType && user.userType !== 'TRAINER' ?
                                    <div className="btn-container">
                                        <Link to={`/book/trainer/${data && data._id}`} replace>
                                            <a href=""
                                                className={`btn btn-${getUserClass(user.userType.toLowerCase())} btn-wdt-150`}>
                                                BOOK NOW
                                            </a>
                                        </Link>
                                    </div> : ''
                                }
                                {user.userType && user.userType === 'TRAINER' ?
                                    <div className="btn-container">
                                        <Link to={`/trainer/edit/${data && data._id}`} replace>
                                            <a href="" className={`btn btn-${getUserClass(user.userType.toLowerCase())} btn-wdt-150`}>
                                                Edit</a>
                                        </Link>
                                    </div> : ''
                                }
                            </div>
                            <div className="col-md-5 col-md-push-1">
                                <h4 className="certificates-list-ttl">Certificates</h4>
                                <ul className="certificates-list">
                                    {data && data.certificates
                                        ? data.certificates
                                            .map((certificate) =>
                                                <li>{certificate.name}</li>) : ''}
                                </ul>
                            </div>
                        </div>
                       {this.state.urlParam ?  <button className="btn btn-next" onClick={this.handleViewStarSubmit}>Add rating</button> : ''}
                        {this.state.urlParam?
                            <span className="star-rating pull-right">
                                <span className="">
                                    <StarRatings
                                        starRatedColor="red"
                                        rating={this.props.newStar}
                                        starDimension="12px"
                                        starSpacing="2px"
                                        changeRating={this.changeRating}
                                    />

                                </span>
                                <button className="btn btn-next" onClick={this.handleStarSubmit}> SUBMIT</button>
                            </span> : ''
                        }

                    </div>
                </div>
            </div>

        );
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getTrainerDetail: (data, id) => dispatch(getTrainerDetail(data, id)),
        changeStarRating: (star) => {
            return dispatch(changeStar(star));
        },

        sendStarRating: (newRate, id, userId) => {
            return dispatch(sendStarRating(newRate, id, userId));
        },

        addRating:()=> {
            return dispatch(addRating());
        },
  

    };
}

const mapStateToProps = createStructuredSelector({
    data: TrainerData(),
    showStar: showRating(),
    newStar: showNewRating(),
    user: makeSelectCurrentUser(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'TrainerDetail', reducer });
const withSaga = injectSaga({ key: 'TrainerDetail', saga });

export default compose(withReducer, withSaga, withConnect)(TrainerDetail);
