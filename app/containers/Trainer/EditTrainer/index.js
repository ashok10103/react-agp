import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";
import {
  changeValue,
  validate,
  submit,
  getSettings,
  getApiToEdit
} from "./actions";
import {
  getTrainerFields,
  fetchTrainerSettings
} from "./selectors";

import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import BasicDetails from "./basicDetails";
import OtherDetails from "./otherDetails";
import {
  getUserType,
  getUserClass,
  getMiles,
  setUserState
} from "utils/helper";

const validations = {
  trainerInfo: ["empty:Trainer Info"],
  country: ["empty:country"],
  trainerType: ["empty:Trainer type"],
  certificates: ["empty:certificates"]
};

class TrainerEdit extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    setUserState(`/trainer/edit/${this.props.match.params.gymId}`);

    this.props.getApiToEdit(this.props.match.params.gymId);
    this.props.getSettings();
  }
  handleSubmit() {
    const finalData = this.props.fields;
    this.props.onSubmit(validations, finalData, this.props.match.params.gymId);
  }

  render() {

    return (
      <div className="contentarea p-scheduler">
        <div className="container">
          <div className="row sch-hd">
            <div className="col-md-6">
              <h3 className="ttl text-uppercase">Edit Trainer</h3>
            </div>
            <div className="col-md-6">
              <button
                className="btn-save pull-right"
                onClick={this.handleSubmit}
              >
                <span className="icon-wrp">
                  <i className="icon sprite-save-2" />
                </span>
                <span>Save</span>
              </button>
            </div>
          </div>
          <div className="gym-prof-tab">
            <ul className="nav nav-tabs">
              <li className="active">
                <a data-toggle="tab" href="#basicInfo">
                  Basic Info
                </a>
              </li>
              <li>
                <a data-toggle="tab" href="#others">
                  Others
                </a>
              </li>
            </ul>
            <div className="tab-content">
              <BasicDetails
                onSubmit={this.props.onSubmit}
                validation={validations}
                changeValue={this.props.changeValue}
                {...this.props}
                validate={this.props.validate}
                fields={this.props.fields}
              />

              <OtherDetails
                settings={this.props.settings}
                onSubmit={this.props.onSubmit}
                validation={validations}
                changeValue={this.props.changeValue}
                {...this.props}
                validate={this.props.validate}
                fields={this.props.fields}
              />
            </div>

          </div>

        </div>

      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    changeValue: (field, value) => {
      const Value = value;
      return dispatch(changeValue(field, Value));
    },
    validate: (field, validation) => dispatch(validate(field, validation)),
    onSubmit: (validations, finalData, id) => {
      return dispatch(submit(validations, finalData, id));
    },
    getApiToEdit: id => dispatch(getApiToEdit(id)),
    getSettings: () => dispatch(getSettings())
    // socialSignup: (fields) =>
    //   dispatch(socialSignup(fields)),
  };
}
const mapStateToProps = createStructuredSelector({
  fields: getTrainerFields(),
  // // getError: submitErr(),
  // // submitting: getSubmitting(),
  //  level: getLevels(),
  settings: fetchTrainerSettings()
  // valid: getValid(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "TrainerEdit", reducer });
const withSaga = injectSaga({ key: "TrainerEdit", saga });
export default compose(
  withReducer,
  withSaga,
  withConnect
)(TrainerEdit);
