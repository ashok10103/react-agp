/**
 *
 * LocaleToggle
 *
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import MenuHeader from "components/MenuHeader";
import API from "../../../utils/api";
import Notifications from "react-notification-system-redux";
import { updateUser } from "../../../containers/Search/actions";

const notificationOpts = {
  // uid: 'once-please', // you can specify your own uid if required
  title: "",
  message: "",
  position: "tc",
  autoDismiss: 5
};

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "",
        phoneNumber: "",
        email: "",
        message: "",
      }
    };
    this.changeValue = this.changeValue.bind(this);
  }



  changeValue(e) {
    
    e.preventDefault()
    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // var phonePattern = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
    var phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    var name = document.getElementsByName("name")[0].value
    var email = document.getElementsByName("email")[0].value
    var phoneNumber = document.getElementsByName("phoneNumber")[0].value
    var message = document.getElementsByName("message")[0].value
    if(name==""){      
      document.getElementById("name-error").innerHTML = 'Name cant be empty'   
      setTimeout(function() {
        $('#name-error').fadeOut('slow');
    }, 4000); 
    }   
    else if(email==""){

      document.getElementById("email-error").innerHTML = 'Email cant be empty'
      setTimeout(function() {
        $('#email-error').fadeOut('slow');
    }, 4000); 
    }
    else if(pattern.test(email) == false){

      document.getElementById("email-error").innerHTML = 'Enter valid email'
      setTimeout(function() {
        $('#email-error').fadeOut('slow');
    }, 4000);
    }
    else if(phoneNumber == ""){
      document.getElementById("phone-error").innerHTML = "Phone number cant be empty"
      setTimeout(function() {
        $('#email-error').fadeOut('slow');
    }, 4000);
    }
    else if(phonePattern.test(phoneNumber)==false){
      
      document.getElementById("phone-error").innerHTML = "Enter valid phone number"
      
      setTimeout(function() {
        $('#phone-error').fadeOut('slow');
    }, 4000);
    }
     else{
       const updatedUser = this.state.user
        updatedUser["name"] = name
        updatedUser["email"] = email
        updatedUser["phoneNumber"] = phoneNumber
        updatedUser["message"] = message

         API.admin.contactAdmin(updatedUser).then(response => {
         if(response) {
          notificationOpts.message = 'Thanks for contacting us. We will reach out to you soon'
          this.props.getNotifications(notificationOpts)
         }
      });
    }
   
  }
 
  render() {
    const { user } = this.state;
    return (
      <main className="p-dashboard">
        <MenuHeader type="inner" />
        <div className="innerareass">
          <div className="containr-new">

            <div className="contact-area row">
              <div className="col-sm-4">
                <div className="contct-dets">
                  <div className="det-bx">
                    <span>Questions on App or Website?</span>
                    <h4>
                      <a href="mailto:customerservice@airgym.com">
                        customerservice@airgym.com
                      </a>
                    </h4>
                  </div>

                  <div className="det-bx">
                    <span>Looking to Join the Team?</span>
                    <h4>
                      <a href="mailto:jobs@airgym.com">jobs@airgym.com</a>
                    </h4>
                  </div>

                  <div className="det-bx">
                    <span>Interested in Investing?</span>
                    <h4>
                      <a href="mailto:investor@airgym.com">
                        investor@airgym.com
                      </a>
                    </h4>
                  </div>

                  <div className="det-bx">
                    <span>Want to Partner with AirGym?</span>
                    <h4>
                      <a href="mailto:investor@airgym.com">
                        supplier@airgym.com
                      </a>
                    </h4>
                  </div>
                </div>
              </div>
              
              <div className="col-sm-8">
                <div className="contactform">
                  <form>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        name="name"                       
                      />
                      <p id="name-error" style={{fontSize:'16px'}}></p>
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="email"                      
                      />
                    </div>
                    <p id="email-error"  style={{fontSize:'16px'}}></p>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Phone"
                        name="phoneNumber"                       
                      />
                      <p id="phone-error" style={{fontSize:'16px'}} ></p>
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Message"                  
                        name="message"         
                       />
                    </div>
                    <div
                      className="btn-form"
                      onClick={e => this.changeValue(e)}
                    >
                      <a href="" className="btn btn-primary btn-wdt-150">
                        Send
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="contact-location">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d51767.896268423414!2d-86.94639640043604!3d35.81236545156904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88637f5ad8d51d67%3A0xe9091bfa65a0dd2d!2sThompson&#39;s+Station%2C+TN%2C+USA!5e0!3m2!1sen!2sin!4v1536667751112"
                width="100%"
                height="400"
                frameborder="0"
                style={{ border: 0 }}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </main>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getNotifications: notificationOpts => {
      return dispatch(Notifications.success(notificationOpts));
    }
  }
}

const withConnect = connect(
  null,
  mapDispatchToProps
);

export default compose(
  withConnect
)(Contact);
