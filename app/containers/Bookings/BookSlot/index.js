import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import Gallery from "react-grid-gallery";
import { createStructuredSelector } from "reselect";
import cx from "classnames";
import Calender from "components/Calender";
import BookingListContainer from "./bookingsList";
import PaymentIntegration from "./payments/paymentIntegration";
import LoadingIndicator from '../../../components/LoadingIndicator/index';
import {
  getBookingsSlots,
  getSelectedSchedules,
  getCustomerId,
  getCards,
  getCurrentUser
} from "./selectors";
import {
  getBookings,
  addSlots,
  bookTrainerSlots,
  checkForCard,
  addCard,
  listCards,
  payOnline,
  resetBookingData
} from "./actions";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import { weekDays, getDate, setUserState } from "utils/helper";
import reducer from "./reducer";
import saga from "./saga";
import API from "../../../utils/api";
import NumericInput from "react-numeric-input";

const days = weekDays();
export class BookingSlots extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: "",
      index: 0,
      selectedValues: [],
      BookingCount: 0,
      showBooking: true,
      gymCost: 0,
      slotNumber: 0
    };
    this.getSlots = this.getSlots.bind(this);
    this.toggleTimeslot = this.toggleTimeslot.bind(this);
    this.addSlot = this.addSlot.bind(this);
    this.checkSelected = this.checkSelected.bind(this);
    this.handleTrainerBooking = this.handleTrainerBooking.bind(this);
    this.getNumberOfSlot = this.getNumberOfSlot.bind(this);
  }

  componentDidMount() {
		this.props.resetBookingData()
    if (this.props.match.params.bookType === "gyms") {
      API.gyms.get(null, this.props.match.params.id).then(response => {
        if (response && response.result && response.result.gym) {
          this.setState({ gymCost: response.result.gym.cost });
        }
      });
    }
    this.props.checkForCard();
    setUserState(
      `/book/${this.props.match.params.bookType}/${this.props.match.params.id}`
    );
    const bookingDay = getDate(new Date());
    const slots = this.props.selectedSlots;
    this.setState({ day: bookingDay });
    if (slots.schedules) {
      var obj = slots.schedules.find(function(obj) {
        return obj.bookingDate === bookingDay;
      });
      if (!obj) {
        slots.schedules.push({ bookingDate: bookingDay, slots: [] });
      }
      this.props.addSlots(slots);
    }

    this.props.getBookings(
      bookingDay,
      this.props.match.params.bookType,
      this.props.match.params.id
    );
  }

  toggleTimeslot(e, index) {
    this.setState({ index });
  }
  getSlots(day) {
    const bookingDay = getDate(day);
    const slots = this.props.selectedSlots;
    this.setState({ day: bookingDay });
    if (slots) {
      var obj = slots.schedules.find(function(obj) {
        return obj.bookingDate === bookingDay;
      });
      if (!obj) {
        slots.schedules.push({ bookingDate: bookingDay, slots: [] });
      }
      this.props.addSlots(slots);
    }
    this.props.getBookings(
      bookingDay,
      this.props.match.params.bookType,
      this.props.match.params.id
    );
  }
  addSlot(selectedSlot) {
    const slots = this.props.selectedSlots;
    let BookingCount = this.state.BookingCount;
    const day = this.state.day;
    let selectedTimeSlot;
    if (slots) {
      const new_schedules = slots.schedules.map(function(obj) {
        if (obj.bookingDate === day) {
          const index = obj.slots.indexOf(selectedSlot);
          obj.slots.includes(selectedSlot)
            ? (obj.slots.splice(index, 1), BookingCount--)
            : (obj.slots.push(selectedSlot), BookingCount++);
        }
        return obj;
      });
      slots.schedules = new_schedules;
      this.setState({ BookingCount });
      this.props.addSlots(slots);
    }
  }
  checkSelected(slot) {
    const slots = this.props.selectedSlots;
    const day = this.state.day;
    const exist = slots.schedules.find(obj => obj.bookingDate === day);
    return exist && exist.slots.includes(slot);
  }
  bookSlot(e) {
    if (this.props.match.params.bookType === "trainer") {
      this.props.bookTrainerSlots(this.props.match.params.id);
    } else {
      const slots = this.props.selectedSlots;
      if (this.props.user.userType === "MEMBER") {
        let count = 0;
        slots.schedules.forEach(obj => {
          count += obj.slots.length;
        });
        slots.amount = count * this.state.gymCost;
      } else {
        let count = 0;
        slots.schedules.forEach(obj => {
          // ((obj) => obj.bookingDate === this.state.day);
          obj.slots.forEach(slots => {
            count += slots.count;
          });
        });
        slots.amount = count * this.state.gymCost;
      }
      this.props.addSlots(slots);
      this.setState({ showBooking: false });
    }
  }
  getNumberOfSlot(slot) {
    const slots = this.props.selectedSlots;
    const exist = slots.schedules.find(
      obj => obj.bookingDate === this.state.day
    );
    const selectedSlot = exist
      ? exist.slots.find(obj => obj.time === slot)
      : { count: 0 };
    return selectedSlot ? selectedSlot.count : 0;
  }
  checkForBooking() {
    const slots = this.props.selectedSlots;
    let isBooking = false;
    slots.schedules.map(obj => {
      if (obj.slots.length) {
        isBooking = true;
      }
      return obj;
    });
    return isBooking;
  }

  handleTrainerBooking(number, slot) {
    const slots = this.props.selectedSlots;
    let BookingCount = this.state.BookingCount;
    const day = this.state.day;
    let selectedTimeSlot;
    if (slots) {
      const new_schedules = slots.schedules.map(function(obj) {
        if (obj.bookingDate === day) {
          if (obj.slots.length) {
            obj.slots = obj.slots.map(el => {
              if (el.time == slot) {
                return Object.assign({}, el, { count: number });
              } else {
                obj.slots.push({ count: number, time: slot });
                return el;
              }
            });
          } else {
            obj.slots.push({ count: number, time: slot });
          }
        }
        return obj;
      });
      slots.schedules = new_schedules;
      this.setState({ BookingCount });
      this.props.addSlots(slots);
    }
  }

  render() {
    const { bookings, selectedSlots, user } = this.props;
    const { selectedValues, gymCost } = this.state;
    return (
      <div className="contentarea p-scheduler">
        {this.state.showBooking && (
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h3 className="ttl text-uppercase">
                  Select time slots <span>({this.state.day})</span>
                </h3>
              </div>
              <div disabled={!this.checkForBooking()} className="col-md-6">
                {/* {this.checkForBooking() && */}
                <button
                  disabled={!this.checkForBooking()}
                  className="btn-save pull-right"
                  onClick={e => this.bookSlot(e)}
                >
                  <span className="icon-wrp">
                    <i className="icon sprite-book" />
                  </span>
                  <span>Book slots</span>
                </button>
                {/* } */}
              </div>
            </div>
            {bookings.data ?  
            <div className="row">
              <div className="col-md-9">
                <div className="clps">
                  <div className="clps-panel-head">
                    <div className="clps-panel-hd clearfix">
                      <div className="col image-col">&nbsp;</div>
                      <div className="col start-time">
                        Start Time{" "}
                        <i
                          className="fa fa-angle-down sort-btn"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="col end-time">
                        End Time{" "}
                        <i
                          className="fa fa-angle-down sort-btn"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="col max-col">&nbsp;</div>
                    </div>
                  </div>
                  {this.props.match.params.bookType === "gyms" ? (
                    bookings && bookings.data && bookings.data.length ? (
                      bookings.data.map(
                        (day, index) =>
                          day.count !== bookings.maximumBookingCount && (
                            <div className="clps-panel">
                              <div className="clps-panel-hd clearfix">
                                <div className="col image-col">
                                  <span
                                    className={cx("schedule-icon", {
                                      "bg-additional":
                                        this.props.match.params.bookType &&
                                        day.count ==
                                          bookings.maximumBookingCount
                                    })}
                                  >
                                    <i className="icon sprite-time" />
                                  </span>
                                </div>
                                <div className="col start-time">
                                  {day.slot.split("-")[0]}
                                </div>
                                <div className="col end-time">
                                  {day.slot.split("-")[1]}
                                </div>
                                <div className="col max-col text-right">
                                  {user.userType === "MEMBER" && (
                                    <label className="pull-right">
                                      <input
                                        type="checkbox"
                                        checked={cx("", {
                                          checked: this.checkSelected(day.slot)
                                        })}
                                        className="chcked-sect"
                                        onClick={() => this.addSlot(day.slot)}
                                      />
                                      <span class="checkmark">
                                        <div class="background-white" />
                                      </span>
                                    </label>
                                  )}
                                  {user.userType === "TRAINER" && (
                                    <NumericInput
                                      min={0}
                                      max={5}
                                      value={this.getNumberOfSlot(day.slot)}
                                      onChange={valueAsNumber =>
                                        this.handleTrainerBooking(
                                          valueAsNumber,
                                          day.slot
                                        )
                                      }
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                      )
                    ) : (
                      <div className="no-booking">
                        <i className="fa fa-calendar" aria-hidden="true" />
                        <p>No Slot For the Gym</p>
                      </div>
                    )
                  ) : (
                    ""
                  )}
                  {this.props.match.params.bookType === "trainer" ? (
                    bookings && bookings.data && bookings.data.length ? (
                      bookings.data.map((day, index) => (
                        <div className="clps-panel">
                          <div className="clps-panel-hd clearfix">
                            <div className="col image-col">
                              <span
                                className={cx("schedule-icon", {
                                  "bg-additional":
                                    this.props.match.params.bookType &&
                                    day.count == bookings.maximumBookingCount
                                })}
                              >
                                <i className="icon sprite-time" />
                              </span>
                            </div>
                            <div className="col start-time">
                              {day.slot.split("-")[0]}
                            </div>
                            <div className="col end-time">
                              {day.slot.split("-")[1]}
                            </div>
                            <div class="col max-col text-right">
                              {
                                <label class="containercheck pull-right">
                                  <input
                                    type="checkbox"
                                    checked={cx("", {
                                      checked: this.checkSelected(day.slot)
                                    })}
                                    className="chcked-sect"
                                    onClick={() => this.addSlot(day.slot)}
                                  />
                                  <span class="checkmark">
                                    <div class="background-white" />
                                  </span>
                                </label>
                              }
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-booking">
                        <i className="fa fa-calendar" aria-hidden="true" />
                        <p>No Slot For the Gym</p>
                      </div>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="col-md-3">
                <div className="calendar-block">
                  <h3 className="block-ttl text-uppercase">Calendar</h3>
                  <Calender onDaySelect={this.getSlots} />                  
                </div>
              </div>
            </div>
            :<LoadingIndicator/>
            }
          </div>
                      
        )}
      
        {!this.state.showBooking &&
          this.props.match.params.bookType === "gyms" && (
            <div>
              <PaymentIntegration
                slots={this.props.selectedSlots}
                bookingType={this.props.match.params.bookType}
                addCard={this.props.addCard}
                listCards={this.props.listCards}
                payOnline={this.props.payOnline}
                customerId={this.props.customerId}
                cards={this.props.cards}
                user={this.props.user}
                gymId={this.props.match.params.id}
              />
            </div>
          )}
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getBookings: (day, type, id) => {
      return dispatch(getBookings(day, type, id));
    },
    bookTrainerSlots: id => {
      return dispatch(bookTrainerSlots(id));
    },
    addSlots: data => dispatch(addSlots(data)),
    checkForCard: () => dispatch(checkForCard()),
    addCard: token => dispatch(addCard(token)),
    listCards: customerId => dispatch(listCards(customerId)),
		payOnline: data => dispatch(payOnline(data)),
		resetBookingData: () => dispatch(resetBookingData())
  };
}

const mapStateToProps = createStructuredSelector({
  bookings: getBookingsSlots(),
  selectedSlots: getSelectedSchedules(),
  customerId: getCustomerId(),
  cards: getCards(),
  user: getCurrentUser()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "Booking", reducer });
const withSaga = injectSaga({ key: "Booking", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(BookingSlots);
