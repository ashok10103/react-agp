import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import {
  getApiToEdit,
  changeValue,
  validate,
  submit,
  getSettings,
  uploadImages,
  removeImage
} from "./actions";
// import { getSettings } from '../Register/actions';

import { getFieldsEdit, fetchSettings } from "./selectors";
// import { fetchSettings } from '../Register/selectors';
import { setUserState } from "utils/helper";

import BasicDetails from "./basicDetails";
import OtherDetails from "./otherDetails";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";

const validations = {
  name: ["empty:Name"],
  gymInfo: ["empty:Gym Info"],
  country: ["empty:Country"],
  cost: ["empty:Cost"],
  currency: ["empty:Currency"],
  guestAccessType: ["empty:Guest Access Type"],
  paymentType: ["empty:Payment Type"],
  gymRules: ["empty:Gym Rules"],
  maxMembers: ["empty:Max Members"],
  gymType: ["empty:Gym Type"],
  amenities: ["empty:Amenities"]
};

export class GymEdit extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    const finalData = this.props.edit;
    this.props.onSubmit(validations, finalData, this.props.match.params.gymId);
  }
  componentDidMount() {
    this.props.getApiToEdit(this.props.match.params.gymId);
    this.props.getSettings();
  }
  componentWillMount() {
    setUserState(`gyms/edit/${this.props.match.params.gymId}`);
  }

  render() {
    const data = this.props.edit;
    console.log("this.props", this.props);

    return (
      <div className="contentarea p-scheduler">

        <div className="container">

          <div className="row sch-hd">

            <div className="col-md-6">

              <h3 className="ttl text-uppercase">Edit GYM</h3>
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
                validation={validations}
                data={this.props.edit}
                changeValue={this.props.changeValue}
                validate={this.props.validate}
                settings={this.props.settings}
                uploadImages={(file, id) => this.props.uploadImages(file, id)}
                {...this.props}
                removeImage={this.props.removeImage}
              />

              <OtherDetails
                validation={validations}
                data={this.props.edit}
                changeValue={this.props.changeValue}
                validate={this.props.validate}
                settings={this.props.settings}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    getApiToEdit: id => dispatch(getApiToEdit(id)),
    getSettings: () => dispatch(getSettings()),
    changeValue: (field, value) => {
      return dispatch(changeValue(field, value));
    },
    validate: (field, validation) => dispatch(validate(field, validation)),
    onSubmit: (validations, finalData, id) => {
      return dispatch(submit(validations, finalData, id));
    },
    uploadImages: (file, id) => {
      return dispatch(uploadImages(file, id));
    },
    removeImage: (image, id) => {
      return dispatch(removeImage(image, id));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  edit: getFieldsEdit(),
  settings: fetchSettings()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
const withReducer = injectReducer({ key: "gymEdit", reducer });
const withSaga = injectSaga({ key: "gymEdit", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(GymEdit);
