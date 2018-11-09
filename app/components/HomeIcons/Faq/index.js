/**
 *
 * LocaleToggle
 *
 */

import React from "react";
import PropTypes from "prop-types";
import MenuHeader from "components/MenuHeader";

function Faq() {
  return (
    <main className="p-dashboard">
      <MenuHeader type="inner" />
      <div className="innerareass">
        <div className="containr-new">
          <div className="faqsection">
            <h2 className="ttl-sb">PRICING</h2>

            <div className="pricing-sect">
              <div className="pricesection">
                <h4>
                  How is the price determined for booking a home or independent
                  gym?
                </h4>
                <p>The owners will set their price per hour. </p>
              </div>

              <div className="pricesection">
                <h4>When will I be paid as an Owner?</h4>
                <p>
                  You will set your payment schedule based on the options when
                  you register. Monthly, Weekly or Bi-weekly are all options to
                  be paid as an owner.{" "}
                </p>
              </div>

              <div className="pricesection">
                <h4>Are my payments secure?</h4>
                <p>
                  Yes, we use STRIPE payment processors for all exchanges. No
                  cash or credit card is ever exchanged on site or in person.{" "}
                </p>
              </div>

              <div className="pricesection">
                <h4>What does AirGym take as a service fee?</h4>
                <p>
                  AirGym collects 10% of all transactions between Member or
                  Trainer and the Owner.{" "}
                </p>
              </div>
            </div>
            <h2 className="ttl-sb">
              I'm an Owner of a home or independent gym, how do I check if
              someone booked my gym?{" "}
            </h2>
            <p>
              Log into the app or website and go to notifications. There you
              will see the number of people who booked for a specific time slot.You will also receive a notification on your phone as long as you turned them on in your settings
            </p>
          </div>

          <div className="faqsection">
            <h2 className="ttl-sb">
              I'm a member and want to cancel my booking for a workout, how do I
              do this?
            </h2>
            <p>
              Go to Settings, My Bookings, Locate the time you want to cancel
              and swipe to the left and accept the cancellation.{" "}
            </p>
          </div>

          <div className="faqsection">
            <h2 className="ttl-sb">I have yoga space, can I sign up?</h2>
            <p>YES!</p>
          </div>

          <div className="faqsection">
            <h2 className="ttl-sb">
              I have a martial arts studio in my basement, can I sign up?{" "}
            </h2>
            <p>YES!</p>
          </div>

          <div className="faqsection">
            <h2 className="ttl-sb">
              I own a commercial property and we have clients already. Why would
              I use AirGym's Service?
            </h2>
            <p>
              AirGym is a free platform for you to be able to connect your
              business to new customers without having to "manage" the bookings.
              We've created this app with your business in mind and believe that
              your focus should be on your customers once they walk in the door
              and not on the administrative or booking schedule.
            </p>
          </div>

          <div className="faqsection">
            <h2 className="ttl-sb">What is AirGym's Cancellation Policy?</h2>
            <p>
              Members and Trainers can cancel their booking for a full refund as
              long as a they don't cancel within 24 hours of their booking.{" "}
            </p>
          </div>

          <div className="faqsection">
            <h2 className="ttl-sb">How do Reviews Work in the AirGym App?</h2>
            <p>
              All of the reviews are a two way street. Owners have the
              opportunity to review and rate Members/Trainers. Members and
              Trainers can leave a rating and review for the AirGym Owners
              Facility.{" "}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Faq;
