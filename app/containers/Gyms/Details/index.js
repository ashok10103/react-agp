import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import Gallery from "react-grid-gallery";
import { createStructuredSelector } from "reselect";
import cx from "classnames";
import StarRatings from "react-star-ratings";
import InfiniteScroll from "react-infinite-scroller";
import {
  GymData,
  showRating,
  showNewRating,
  getIssues,
  getMessage,
  getReviewList,
  getCount
} from "./selectors";
import { makeSelectCurrentUser } from "../../App/selectors";

import {
  getGymDetail,
  changeStar,
  sendStarRating,
  addRating,
  setIssues,
  setMessage,
  sendReport,
  clearFPForm,
  getRatingList
} from "./actions";
import injectReducer from "utils/injectReducer";
import qs from "qs";
import injectSaga from "utils/injectSaga";
import {
  getUserType,
  getUserClass,
  getMiles,
  setUserState
} from "utils/helper";
import reducer from "./reducer";
import saga from "./saga";
import { Modal } from "react-bootstrap";
import { ENGINE_METHOD_DIGESTS } from "constants";
// import { getMiles } from '../../utils/helper';

const userType =
  getUserType() && typeof getUserType() !== undefined
    ? getUserType().toLowerCase()
    : "";
const count = 50;
const issues = [
  { id: 0, value: "Cannot find gym" },
  { id: 1, value: "Not able to contact owner" },
  { id: 2, value: "No one avoidable at gym" },
  { id: 3, value: "Gym facilities not as per description" },
  { id: 4, value: "Payment related" },
  { id: 5, value: "Other" }
];
export class GymDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rating: "",
      urlParam: false,
      showRatingBar: false,
      showModal: false,
      showModalReview: false,
      feedback: "",
      activePage: 1
    };
    this.getImages = this.getImages.bind(this);
    this.changeRating = this.changeRating.bind(this);
    this.handleStarSubmit = this.handleStarSubmit.bind(this);
    this.handleViewStarSubmit = this.handleViewStarSubmit.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.handleDropDownSingle = this.handleDropDownSingle.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.reset = this.reset.bind(this);
    this.displayRatingModal = this.displayRatingModal.bind(this);
    this.hideModalReview = this.hideModalReview.bind(this);
    this.handleFeedback = this.handleFeedback.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }
  componentWillMount() {
    setUserState(`gyms/${this.props.match.params.gymId}`);
  }
  componentDidMount() {
    const urlParam = qs.parse(this.props.location.search)["?rate"];
    this.setState({ urlParam });
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
      location.getCurrentPosition(
        position => {
          this.props.getGymDetail(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              distance: 10000000000000
            },
            this.props.match.params.gymId
          );
        },
        error => {
          // this.setState({ latitude: 'err-latitude', longitude: : 'err-longitude' })
        }
      );
    }
    this.props.getRatingList(
      this.props.match.params.gymId,
      this.state.activePage
    );
  }

  displayModal(e) {
    this.setState({ showModal: true });
  }

  loadMore() {
    if (
      this.state.activePage <
      parseInt(this.props.count && this.props.count / 10)
    ) {
      this.setState({ activePage: activePage + 1 });
      setTimeout(() => {
        this.props.getRatingList(
          this.props.match.params.gymId,
          this.state.activePage
        );
      }, 1000);
    }
  }

  displayRatingModal() {
    this.setState({ showModalReview: true });
  }

  handleViewStarSubmit() {
    this.setState({ showRatingBar: true });
    // return this.props.addRating()
  }

  getImages(images) {
    const imageArray = images.map(image => {
      return {
        src: image,
        thumbnail: image,
        thumbnailWidth: 320,
        thumbnailHeight: 212
      };
    });
    return imageArray;
  }
  changeRating(newRating, name) {
    this.setState({
      rating: newRating
    });

    return this.props.changeStarRating(newRating);
  }
  handleStarSubmit() {
    const newRatings = this.state.rating;
    const feedback = this.state.feedback;
    this.hideModalReview();
    return this.props.sendStarRating(
      newRatings,
      feedback,
      this.props.match.params.gymId
    );
  }
  hideModal(e) {
    this.setState({ showModal: false });
  }
  hideModalReview(e) {
    this.setState({ showModalReview: false });
  }

  handleDropDownSingle({ target }) {
    // this.props.setIssues(message,target.id,target.value)
    this.props.setIssues(target.id, target.value);
  }
  handleMessage({ target }) {
    this.props.setMessage(target.name, target.value);
  }

  handleFeedback({ target }) {
    this.setState({ feedback: target.value });
    // this.props.setMessage(target.name, target.value);
  }

  reset(e) {
    return this.props.clearFormFields();
  }
  handleReport(e) {
    e.preventDefault();
    this.props.sendReport(
      this.props.match.params.gymId,
      userType,
      this.hideModal
    );
    this.props.clearFormFields();
  }

  render() {
    const { gym, newStar, user, match, reviews } = this.props;
    const { urlParam, showRatingBar } = this.state;
    const { showModal } = this.state;
    return (
      <div>
        <InfiniteScroll
          loadMore={this.props.loadMore}
          hasMore={true}
          threshold={2000}
          useWindow={true}
          // loader={<div className="loader" key={0}>Loading ...</div>}
        >
          <div
            className="dtl-banner"
            style={{
              backgroundImage: `url(${
                gym && gym.gymImages && gym.gymImages.length
                  ? gym.gymImages[0]
                  : ""
              })`
            }}
          />
          <div className="contentarea detailpage">
            <div className="container">
              {userType == "member" || "trainer" || !"owner" ? (
                <div className="">
                  <button
                    data-toggle="tooltip"
                    title="Report an issue!"
                    className="pull-right "
                    onClick={this.displayModal}
                  >
                    <i
                      className="fa fa-exclamation-circle exclamation "
                      aria-hidden="true"
                    />
                  </button>
                  <Modal show={showModal} className="modal popUp_1 in fade vm">
                    <div
                      className={cx("modal-header", {
                        "gradient-gym": userType == "owner",
                        "gradient-member": userType == "member",
                        "gradient-trainer": userType == "trainer"
                      })}
                    >
                      <h3 className="modal-title text-center font-medium font-clr grey">
                        REPORT AN ISSUE
                        <button className="pull" onClick={this.hideModal}>
                          <i className="fa fa-close " aria-hidden="true" />
                        </button>
                      </h3>
                    </div>
                    <div className="modal-body">
                      {issues &&
                        issues.map(val => {
                          return (
                            <div
                              className="col-md-12  align-items-center"
                              key={val.id}
                            >
                              <label className="containercheck">
                                {" "}
                                {val.value}
                                <input
                                  type="checkbox"
                                  id={val.id}
                                  checked={
                                    val.id == this.props.issues.id
                                      ? "checked"
                                      : ""
                                  }
                                  className="chcked-sect"
                                  value={val.value}
                                  name=""
                                  onClick={this.handleDropDownSingle}
                                />
                                <span className="checkmark">
                                  <div className="background-white" />
                                </span>
                              </label>
                            </div>
                          );
                        })}

                      {/* {issues && issues.map((val) =>  */}

                      <form className="cstm_form">
                        <div className="submit-wrp clearfix" />
                        <div className="form-group set-m">
                          <textarea
                            type="text"
                            className={cx("form-control", {
                              "border-member": userType == "member",
                              "border-trainer": userType == "trainer"
                            })}
                            name="message"
                            placeholder="Please write down your issues here..."
                            value={this.props.messages}
                            onChange={this.handleMessage}
                          />
                        </div>
                      </form>
                    </div>
                    <form className="modal-footer ">
                      <input
                        type="submit"
                        disabled={
                          !this.props.issues.value || !this.props.messages
                        }
                        className={cx("btn btn-next font-clr center-block", {
                          "gradient-gym": userType == "owner",
                          "gradient-member": userType == "member",
                          "gradient-trainer": userType == "trainer"
                        })}
                        value="Report"
                        data-dismiss="modal"
                        onClick={e => this.handleReport(e)}
                      />
                    </form>
                  </Modal>
                </div>
              ) : (
                ""
              )}

              {!urlParam && user.userType && user.userType !== "OWNER" ? (
                <div className="btn-container pull-right">
                  <Link
                    to={`/book/gyms/${this.props.match.params.gymId}`}
                    replace
                  >
                    <a
                      href=""
                      className={`btn btn-${getUserClass(
                        user.userType.toLowerCase()
                      )} btn-wdt-150`}
                    >
                      BOOK NOW
                    </a>
                  </Link>
                </div>
              ) : (
                ""
              )}
              {user.userType && user.userType === "OWNER" ? (
                <div className="btn-container">
                  <Link to={`/gyms/edit/${gym._id}`} replace>
                    <a
                      href=""
                      className={`btn btn-${getUserClass(
                        user.userType.toLowerCase()
                      )} btn-wdt-150`}
                    >
                      Edit
                    </a>
                  </Link>
                </div>
              ) : (
                ""
              )}

              <div className="row">
                <div className="col-md-5">
                  <div className="row">
                    <div className="col-sm-7">
                      <h2 className="ttl">{gym.name}</h2>
                      <p className="text-primary">
                        <strong>
                          {gym.address && gym.address.addressLine1}
                        </strong>
                      </p>
                      <address className="gym-address">
                        {gym.address && gym.address.addressLine2}{" "}
                      </address>
                    </div>
                    <div className="col-sm-5">
                      <span className="star-rating pull-right">
                        {/* <span className="text">{gym.rating}</span> */}
                      </span>
                      <p className="km-run">
                        <i className="sprite-run" />
                        <span>{getMiles(gym.distanceFromLocation)} Miles</span>
                      </p>
                    </div>
                  </div>
                  <p className="desc">{gym.description}</p>
                  <h5>About us</h5>
                  <p>{gym.gymInfo}</p>
                  <h5>Contact No:</h5>
                  <p>{gym.phoneNumber}</p>
                  <h5>Guest Access Methods</h5>

                  {gym.guestAccessType
                    ? gym.guestAccessType.map((gymAccess, index) => (
                        <p key={index}>{gymAccess.name}</p>
                      ))
                    : ""}
                  <h5>Please follow these rules</h5>

                  {gym.gymRules
                    ? gym.gymRules.map((rule, index) => (
                        <p key={index}>{rule.name}</p>
                      ))
                    : ""}

                  {!urlParam &&
                  user.userType &&
                  user.userType !== "OWNER" &&
                  gym.gymRules
                    ? gym.paymentType.map((payment, index) => (
                        <span>
                          <h5> Payment Options</h5>
                          <p key={index}>{payment.method}</p>
                        </span>
                      ))
                    : ""}

                  <h5>Maximum members</h5>
                  <p>{gym.maxMembers}</p>

                  <h5>Gym Type</h5>
                  {gym.gymType
                    ? gym.gymType.map((type, index) => (
                        <p key={index}>{type.gymType.toLowerCase()}</p>
                      ))
                    : ""}
                  <h5> Amenities</h5>
                  {gym.amenities
                    ? gym.amenities.map((amenity, index) => (
                        <p key={index}>{amenity.name}</p>
                      ))
                    : ""}
                </div>

                <div className="col-md-7">
                  {gym && gym.gymImages && gym.gymImages.length ? (
                    <section className="sc-gallery clearfix">
                      <h2 className="ttl">Gallery</h2>
                      <Gallery
                        images={this.getImages(gym.gymImages)}
                        rowHeight={200}
                        maxRows={3}
                        showImageCount={true}
                      />
                    </section>
                  ) : (
                    ""
                  )}

                  {urlParam ? (
                    <div>
                      <button
                        data-toggle="tooltip"
                        title="   Your Rating!"
                        className="pull-right btn btn-next "
                        onClick={this.displayRatingModal}
                      >
                        Your Rating
                      </button>
                      <Modal
                        show={this.state.showModalReview}
                        className="modal popUp_1 in fade vm"
                      >
                        <div
                          className={cx("modal-header", {
                            "gradient-gym": userType == "owner",
                            "gradient-member": userType == "member",
                            "gradient-trainer": userType == "trainer"
                          })}
                        >
                          <h3 className="modal-title text-center font-medium font-clr">
                            RATE AND REVIEW
                            <button
                              className="pull"
                              onClick={this.hideModalReview}
                            >
                              <i className="fa fa-close " aria-hidden="true" />
                            </button>
                          </h3>
                        </div>
                        <div className="modal-body">
                          <div className="add-rating">
                            <p className="star-rating text-center">
                              Rate your Experience:
                              {"       "}
                              <span className="">
                                <StarRatings
                                  starRatedColor="#f9c00a"
                                  rating={newStar}
                                  starDimension="25px"
                                  starSpacing="2px"
                                  changeRating={this.changeRating}
                                />
                              </span>
                            </p>
                          </div>
                          <form className="cstm_form">
                            <div className="submit-wrp clearfix" />
                            <div className="form-group set-m">
                              <textarea
                                type="text"
                                className={cx("form-control", {
                                  "border-member": userType == "member",
                                  "border-trainer": userType == "trainer"
                                })}
                                name="feedback"
                                placeholder="Describe your experience here..."
                                value={this.state.feedback}
                                onChange={this.handleFeedback}
                              />
                            </div>
                          </form>
                        </div>
                        <div className="modal-footer ">
                          <button
                            className={cx(
                              "btn btn-next font-clr center-block",
                              {
                                "gradient-gym": userType == "owner",
                                "gradient-member": userType == "member",
                                "gradient-trainer": userType == "trainer"
                              }
                            )}
                            onClick={this.handleStarSubmit}
                            data-dismiss="modal"
                          >
                            {" "}
                            SUBMIT
                          </button>
                        </div>
                      </Modal>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col-md-6">
                  <div className="contentarea p-notifications ">
                    <div className="container">
                      <h3 className="ttl">
                        Reviews and ratings {"    "}
                        <StarRatings
                          rating={gym.rating}
                          starDimension="15px"
                          starSpacing="2px"
                        />{" "}
                        <span className="color h7"> ({gym.rating}) </span>{" "}
                      </h3>
                      <ul className="notification-list list-unstyled">
                        {reviews &&
                          reviews.map(d => (
                            <li className="item clearfix">
                              <span className="img-wrp">
                                <img
                                  src={
                                    d.userId.profileImageUrl ||
                                    "/avatar-default.png"
                                  }
                                  width="100%"
                                  alt=""
                                />
                              </span>{" "}
                              {"   "}
                              {"   "}
                              <span className="h3 review-list">{d.userId.firstName}</span>
                              <p className="time mb-0">
                                <span className="review-list">
                                  <StarRatings
                                    rating={d.rating || 0}
                                    starDimension="12px"
                                    starSpacing="2px"
                                  />
                                  {"    "}
                                </span>
                              </p>
                              <div className="rgt-block review-list-comment">
                                <p> {d.comment}</p>
                              </div>
                            </li>
                          ))}
                      </ul>
                      {reviews && reviews.length ? "" : <p>No reviews yet!!</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getGymDetail: (data, id) => dispatch(getGymDetail(data, id)),

    changeStarRating: star => {
      return dispatch(changeStar(star));
    },

    sendStarRating: (newRate, feedback, id) => {
      return dispatch(sendStarRating(newRate, feedback, id));
    },

    addRating: () => dispatch(addRating()),
    setIssues: (id, value) => dispatch(setIssues(id, value)),
    setMessage: (name, value) => {
      return dispatch(setMessage(name, value));
    },
    clearFormFields: () => dispatch(clearFPForm()),
    sendReport: (gymId, userType, handler) => {
      return dispatch(sendReport(gymId, userType, handler));
    },
    getRatingList: (gymId, pageNo) => {
      return dispatch(getRatingList(gymId, pageNo));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  gym: GymData(),
  showStar: showRating(),
  newStar: showNewRating(),
  user: makeSelectCurrentUser(),
  issues: getIssues(),
  messages: getMessage(),
  reviews: getReviewList(),
  count: getCount()

  // location: getUserLocation(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "gymDetail", reducer });
const withSaga = injectSaga({ key: "gymDetail", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(GymDetail);
