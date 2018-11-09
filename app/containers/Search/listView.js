import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { createStructuredSelector } from "reselect";
import InfiniteScroll from "react-infinite-scroller";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";
import {
  changeValue,
  validate,
  submit,
  getSettings,
  moveToNext
} from "./actions";
import {
  getFields,
  getValid,
  submitErr,
  getSubmitting,
  fetchSettings
} from "./selectors";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import { getMiles } from "../../utils/helper";

class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentType: [],
      guestAccessType: [],
      pageNumber: 1
    };
    this.loadMore = this.loadMore.bind(this);
    this.gotoProfile = this.gotoProfile.bind(this);
    // this.handleScroller = this.handleScroller.bind(this)
  }

  componentDidMount() {
    this.props.setPageNumber(1);
  }
  gotoProfile(id) {
    const path =
      this.props.filter === "gym" ? `/gyms/${id}` : `/trainer/details/${id}`;
    this.props.history.push(path);
  }
  loadMore() {
    if (
      this.props.filterTypes &&
      this.props.pageNumber <= parseInt(this.props.count / 10)
    ) {
      const currentFilter = this.props.filterTypes;
      // this.setState({pageNumber: this.props.pageNumber + 1})
      // console.log(currentFilter,"current")
      this.props.setFilters(currentFilter);
      setTimeout(() => {
        this.props.filter === "gym"
          ? this.props.getGyms(currentFilter, this.props.pageNumber)
          : this.props.getTrainers(currentFilter, this.props.pageNumber);
      }, 1000);
      // this.props.filter === 'gym' ? this.props.getGyms(currentFilter, this.props.pageNumber + 1, true) : this.props.getTrainers(currentFilter,this.props.pageNumber + 1, true)
    }
  }

  getGymType(gymTypes) {
    return gymTypes
      .map(gymType => {
        return gymType.gymType;
      })
      .toString();
  }

  getTrainerType(trainerTypes) {
    return trainerTypes
      .map(trainerTypes => {
        return trainerTypes.trainerType;
      })
      .toString();
  }
  render() {
    const { gyms, trainers, filter } = this.props;
    return (
      <div className="gym-list">
        <InfiniteScroll
          // loadMore={this.loadMore}
          hasMore={true}
          threshold={50}
          height={100}
          useWindow={false}
          // loader={<div className="loader" key={0}>Loading ...</div>}
        >
          <ul className="gym-result-list" onMouseOver={this.handleScroller}>
            {filter === "gym"
              ? gyms &&
                gyms.length > 0 &&
                gyms.map((gym, index) => (
                  <li
                    key={index}
                    className="clearfix"
                    onClick={() => this.gotoProfile(gym._id)}
                  >
                    <figure className="gym-details">
                      <span className="img-wrp">
                        <img src={gym.gymImages[0]} alt="" />
                      </span>
                      <figcaption>
                        <span>
                          <span className="gym-name">{gym.name}</span>
                          <span className="star-rating">
                            <StarRatings
                              starRatedColor="green"
                              rating={gym.rating}
                              starDimension="12px"
                              starSpacing="2px"
                            />
                          </span>
                        </span>
                        <span className="clearfix">
                          <span className="gym-type">
                            {this.getGymType(gym.gymType)}
                          </span>
                        </span>
                        <span className="gym-distance">
                          {getMiles(gym.distanceFromLocation)} Miles
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                ))
              : trainers &&
                trainers.length > 0 &&
                trainers.map((trainer, index) => (
                  <li
                    key={index}
                    className="clearfix"
                    onClick={() => this.gotoProfile(trainer._id)}
                  >
                    <figure className="gym-details">
                      <span className="img-wrp">
                        <img
                          src={trainer.userId && trainer.userId.profileImageUrl}
                          alt=""
                        />
                      </span>
                      <figcaption>
                        <span>
                          <span className="gym-name">{`${trainer.userId &&
                            trainer.userId.firstName} ${trainer.userId &&
                            trainer.userId.lastName}`}</span>
                          <span className="star-rating">
                            <StarRatings
                              rating={trainer.rating}
                              starDimension="12px"
                              starSpacing="2px"
                            />
                          </span>
                        </span>
                        <span className="clearfix">
                          <span className="gym-type">
                            {this.getTrainerType(trainer.trainerType)}
                          </span>
                        </span>
                        <span className="gym-distance">
                          {getMiles(trainer.distanceFromLocation)} Miles
                        </span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
          </ul>
        </InfiniteScroll>
      </div>
    );
  }
}
export default ListView;
