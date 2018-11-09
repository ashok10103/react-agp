import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import Gallery from "react-grid-gallery";
import { createStructuredSelector } from "reselect";
import cx from "classnames";
import Calender from "components/Calender";
import { getBookingsSlots, getclear,} from "./selectors";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { Modal } from "react-bootstrap";
import {
  getBookings,
  getAllBookings,
  deleteBookings,
  setFlag
} from "./actions";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import { weekDays, getDate, setUserState, getUserType } from "utils/helper";
import reducer from "./reducer";
import saga from "./saga";
import { Button } from "react-bootstrap";

const userType = getUserType();

const days = weekDays();

export class BookingsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: "",
      index: 0,
      clearfilter: false,
      clear: false,
    
    };
    this.getSlots = this.getSlots.bind(this);
    this.ClearDate = this.ClearDate.bind(this);
    this.openGym = this.openGym.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

  }

  componentDidMount() {
    setUserState(`/gyms/schedule/${this.props.match.params.userId}`);
    const bookingDay = getDate(new Date());
    this.setState({ day: bookingDay });
    this.props.getBookings(bookingDay, this.props.match.params.userId);
  }
  ClearDate() {
    this.setState({ clearfilter: !this.state.clearfilter }, () => {
      if (this.state.clearfilter) {
        this.props.getAllBookings(this.props.match.params.userId);
      } else {
        const bookingDay = getDate(new Date());
        this.setState({ day: bookingDay });
        this.props.getBookings(bookingDay, this.props.match.params.userId);
      }
    });
  }


  handleDelete(e, id, day) {
    e.stopPropagation();
    this.props.setFlag();
    this.props.deleteBookings(
      id,
      this.props.match.params.userId,
      day,
      this.state.clearfilter
    );
  }
  getSlots(day) {
    this.setState({ clearfilter: false });
    const bookingDay = getDate(day);
    this.setState({ day: bookingDay });
    this.props.getBookings(bookingDay, this.props.match.params.userId);
  }

  openGym(day) {
    if (day.bookingType == "gym") {
      this.props.history.push({
        pathname: `/gyms/${day.gymId}`,
        search: `rate=true`
      });
    } else {
      this.props.history.push({
        pathname: `/trainer/details/${day.trainerId}`,
        search: `rate=true`
      });
    }
  }

  render() {
    const { bookings } = this.props;
   
    return (
      <div className="contentarea p-scheduler">
        <div className="container">
          {!this.state.clearfilter ? (
            <div>
              <h3 className="ttl text-uppercase">
                Bookings Of the Day <span>({this.state.day})</span>
              </h3>
             
            </div>
          ) : (
            <h3 className="ttl text-uppercase">Your Bookings</h3>
          )}
          <div className="row">
            <div className="col-md-9">
              <div className="clps">
                <div className="clps-panel-head">
                  <div className="clps-panel-hd clearfix">
                    <div className="col image-col">&nbsp;</div>
                    <div className="col gym-name">
                      Name
                      <i
                        className="fa fa-angle-down sort-btn"
                        aria-hidden="true"
                      />
                    </div>
                    {this.state.clearfilter ? (
                      <div className="col date-col">
                        Booking Type{" "}
                        <i
                          className="fa fa-angle-down sort-btn"
                          aria-hidden="true"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="col date-col">
                      Date{" "}
                      <i
                        className="fa fa-angle-down sort-btn"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="col start-time">Start Time</div>
                    <div className="col end-time">End Time</div>
                    <div className="col end-time"> </div>
                    <div className="col action-col">&nbsp;</div>
                  </div>
                </div>
                {this.state.clearfilter ? (
                  bookings && bookings.length ? (
                    bookings.map(
                      (day, index) =>
                        day.slot &&
                        Array.isArray(day.slot) &&
                        day.slot.map(slot => (
                          <div className="clps-panel pointer">
                            <div onClick={e => this.openGym(slot)}>
                              <div className="clps-panel-hd clearfix">
                                <div className="col image-col">
                                  <span className="schedule-icon img-wrp">
                                    <img src={slot.image} alt="" />
                                  </span>
                                </div>
                                <div className="col gym-name">{slot.name}</div>
                                <div className="col gym-name">
                                  {slot.bookingType}
                                </div>
                                <div className="col date-col">
                                  {slot.bookingDate || this.state.day}
                                </div>
                                <div className="col start-time">
                                  {slot.slot.split("-")[0]}
                                </div>
                                <div className="col end-time">
                                  {slot.slot.split("-")[1]}
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={e =>
                                this.handleDelete(e, slot.bookingId)
                              }
                            >
                              {" "}
                              <i
                                className="fa fa-times-circle-o"
                                aria-hidden="true"
                              />{" "}
                            </Button>
                          </div>
                        ))
                    )
                  ) : (
                    <div className="no-booking">
                      <i className="fa fa-calendar" aria-hidden="true" />
                      <p>No booking</p>
                    </div>
                  )
                ) : bookings && bookings.length ? (
                  bookings.map((day, index) => (
                    <div
                      className={cx("clps-panel pointer", {
                        full: day.count == bookings.maximumBookingCount
                      })}
                      onClick={e => this.openGym(day)}
                    >
                      <div className="clps-panel">
                        <div className="clps-panel-hd clearfix">
                          <div className="col image-col">
                            <span className="schedule-icon img-wrp">
                              <img src={day.image} alt="" />
                            </span>
                          </div>
                          <div className="col gym-name">{day.name}</div>
                          <div className="col date-col">
                            {day.day || this.state.day}
                          </div>
                          <div className="col start-time">
                            {!Array.isArray(day.slot)
                              ? day.slot.split("-")[0]
                              : ""}
                          </div>
                          <div className="col end-time">
                            {!Array.isArray(day.slot)
                              ? day.slot.split("-")[1]
                              : ""}
                          </div>
                          <Button
                            onClick={e =>
                              this.handleDelete(
                                e,
                                day.bookingId,
                                day.day || this.state.day
                              )
                            }
                          >
                            <i
                              className="fa fa-times-circle-o"
                              aria-hidden="true"
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-booking">
                    <i className="fa fa-calendar" aria-hidden="true" />
                    <p>No booking</p>
                  </div>
                )}
                {/* {
                  bookings && bookings.length ?
                    bookings.map((day, index) =>
                      <div className={cx("clps-panel", {
                        full: day.count == bookings.maximumBookingCount,
                        'collapse-open': index === this.state.index
                      })} onClick={((e) => this.toggleTimeslot(e, index))}>
                        <div className="clps-panel">
                          <div className="clps-panel-hd clearfix">
                            <div className="col image-col">
                              <span className="schedule-icon img-wrp">
                                <img src={day.image} alt="" />
                              </span>
                            </div>
                            <div className="col gym-name">{day.name}</div>
                            <div className="col date-col">{day.day || this.state.day}</div>
                            <div className="col start-time">{day.slot.split('-')[0]}</div>
                            <div className="col end-time">{day.slot.split('-')[1]}</div>
                          </div>
                        </div>

                      </div>
                    )
                    :
                    <div className="no-booking">
                      <i className="fa fa-calendar" aria-hidden="true"></i>
                      <p>No booking</p>
                    </div>
                } */}
              </div>
            </div>
            <div className="col-md-3">
              <div className="calendar-block">
                <div className="clearfix">
                  {!this.state.clearfilter ? (
                    <h3 className="block-ttl text-uppercase pull-left">
                      Calendar
                    </h3>
                  ) : (
                    ""
                  )}
                  <button
                    className="btn-clearfilter pull-right"
                    onClick={this.ClearDate}
                  >
                    {!this.state.clearfilter
                      ? "Clear Date Filter"
                      : "Show Date Filter"}
                  </button>
                </div>
                {!this.state.clearfilter ? (
                  <Calender onDaySelect={this.getSlots} />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {/* <a
            href="javascript:void(0);"
            className="add-new-schedule"
            title="Add New"
            data-toggle="modal"
            data-target="#editProfile"
          >
            +
          </a> */}
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getBookings: (day, id) => dispatch(getBookings(day, id)),
    getAllBookings: id => dispatch(getAllBookings(id)),
    deleteBookings: (id, uId, day, clear) =>
      dispatch(deleteBookings(id, uId, day, clear)),
    setFlag: () => dispatch(setFlag()),
    
    
  };
}

const mapStateToProps = createStructuredSelector({
  bookings: getBookingsSlots(),
 
  
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "BookingsList", reducer });
const withSaga = injectSaga({ key: "BookingsList", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(BookingsList);
