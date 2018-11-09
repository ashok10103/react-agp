/**
 *
 * LocaleToggle
 *
 */

import React from "react";
import PropTypes from "prop-types";
import MenuHeader from "components/MenuHeader";

function About() {
  return (
    <main className="p-dashboard">
      <MenuHeader type="inner" />
      <div className="innerareass">
        <div className="containr-new">
          <div className="aboutsection">
            <h2 className="ttl">Introduction</h2>
            <p>
              AirGym is a mobile app that was designed for you. The every day
              fitness enthusiast who simply wants to workout. With AirGym, there
              are no contracts, no sign on fees, or subscriptions. You can use
              the free app to locate home gyms and commercial gyms of any type.
              Check out pictures, reviews and gym openings and then book the gym
              and go workout. AirGym is the same workout as you would expect
              from a "traditional big box gym". We are breaking the cycle of
              traditional thinking that you need to "go to" the gym to be
              healthy. Find your workout where you're going to be, with no
              contracts
            </p>
          </div>

          <div className="aboutsection">
            <h2 className="ttl">What is AirGym?</h2>
            <p>
              AirGym is a mobile app for iOS and Android that allows home gym
              owners & commercial gyms to post their space on AirGym's App to
              book members who want to workout. Members who sign up can view
              home and independent gyms on the app and choose to workout
              according to the owners schedule. All payments happen securely
              through the app using Stripe. Fitness Trainers can make a profile
              and use it to have potential clients contact them to workout.
              Members can use the app to locate AirGym Trainers. The Fitness
              Trainers will book the home/independent gym and pay the AirGym
              Owners Fee. The payment between the client and the member stays
              the same as agreed upon between the two parties.
            </p>
          </div>

          <div className="aboutsection">
            <h2 className="ttl">How do I create an account?</h2>
            <p>
              If you don't have an AirGym account yet, go to{" "}
              <a
                href="https://www.airgym.com"
                className="mail-to"
                target="blank"
              >
                airgym.com
              </a>{" "}
              and click on Sign Up under the correct type of user you want to
              be. You can sign up using your email address, Facebook account,
              Google account. Signing up and creating an AirGym account is
              free.You can also download the free app on <a href="https://itunes.apple.com/us/app/airgym/id1399433259?mt=8">iTunes </a> and <a href="https://play.google.com/store/apps/details?id=gym.air.com.airgym">Google
              PlayStore.</a>
            </p>
          </div>

          <div className="aboutsection">
            <h2 className="ttl">What if I want to be an Owner and Member?</h2>
            <p>
              You can sign up as a Member and Owner using the same email.
              However, you will have to Sign Up twice.{" "}
            </p>
          </div>

          <div className="aboutsection">
            <h2 className="ttl">Who can Sign Up?</h2>
            <p>If you're eighteen years of age of older, you can sign up.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default About;
