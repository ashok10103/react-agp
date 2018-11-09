/**
 *
 * LocaleToggle
 *
 */

import React from "react";
import PropTypes from "prop-types";

function CopyRight() {
  return (
    <div className="contentarea">
      <div className="container">
        <h2 className="text-center">
          <strong>AirGym Copyright Policy</strong>
        </h2>
        <div className="box">
          <div>
            <h4>Last modified April 8, 2018</h4>
          </div>
          <div>
            <h4>
              <strong>Notice of Copyright Infringement</strong>
            </h4>
          </div>
          <div className="text-justify">
            <p>
              {" "}
              AirGym respects the intellectual property of other and expects
              Members to do the same. If you believe, in good faith, that any
              materials on the AirGym Platform infringe upon your copyrights,
              please send the following information to AirGym’s Copyright Agent
              at
              <strong>
              <a href="https://www.google.com/maps/place/185+Berry+St+%235000,+San+Francisco,+CA+94107,+USA/@37.7765973,-122.3941375,17z/data=!3m1!4b1!4m5!3m4!1s0x808f7fd6d780ed0f:0x399bae1feb9a7275!8m2!3d37.7765973!4d-122.3919488" target="blank">

                {" "}
                AirGym, LLC, PO BOX 351 Thompsons Station, TN 37179:
                </a>
              </strong>
            </p>

            <ol>
              <li>
                {" "}
                a description of the copyrighted work that you claim has been
                infringed, including specific location on the AirGym Platform
                where the material you claim is infringed is located. Include
                enough information to allow AirGym to locate the material, and
                explain why you think an infringement has taken place;
              </li>
              <li>
                a description of the location where the original or an
                authorized copy of the copyrighted work exists – for example,
                the URL (Internet address) where it is posted or the name of the
                book in which it has been published;
              </li>
              <li>your name, address, telephone number, and e-mail address;</li>
              <li>
                a statement by you that you have a good faith belief that the
                disputed use is not authorized by the copyright owner, its
                agent, or the law;
              </li>
              <li>
                a statement by you, made under penalty of perjury (ie.
                notarized), that the information in your notice is accurate, and
                that you are the copyright owner or authorized to act on the
                copyright owner's behalf; and
              </li>
              <li>
                an electronic or physical signature of the owner of the
                copyright or the person authorized to act on behalf of the owner
                of the copyright interest.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CopyRight;
