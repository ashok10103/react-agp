import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';
import { changeValue,validate,submit,getSettings} from './actions';
import { getFields,getValid,getLevels,fetchSettings
 } from './selectors';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import BasicDetails from './basicDetails'
import OtherDetails from './otherDetails'

const validations = {
  trainerInfo: ["empty:Trainer Info"],
  country: ["empty:Country"],
  trainerType: ["empty:Trainer type"],
  certificates: ["empty:Certificates"],

};

class TrainerRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {
    this.props.getSettings();

  }
  render() {
    const { level } = this.props;

    return (
      <div>
        <div className="contentarea content-registraion">
          <div className="container">
            <div className="registraion-process trainer">
              <h3 className="reg-ttl">TRAINER REGISTRATION</h3>
              <ul className="progresssect">
                <li className="active">
                  <span className="step-no">1</span>
                </li>
                <li>
                  <span className="step-no">2</span>
                </li>
              </ul>
            </div>

             {
            level == 1 ?
            <BasicDetails level={this.props.level}  onSubmit={this.props.onSubmit} validation={validations} changeValue={this.props.changeValue} {...this.props} validate={this.props.validate} fields={this.props.fields}/>
             : ''
          }
          {
           level == 2 ?
            <OtherDetails settings={this.props.settings} level={this.props.level}  onSubmit={this.props.onSubmit} validation={validations} changeValue={this.props.changeValue} {...this.props} validate={this.props.validate} fields={this.props.fields}/>
             : ''
          }
            </div>
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    changeValue: (field, value, module) => {
      const Value = value;
      return dispatch(changeValue(field, Value, module));
    },
    validate: (field, validation, module) =>
      dispatch(validate(field, validation, module)),
      onSubmit: (validations, fields,e, lat, long) => {
        e.preventDefault();
        return dispatch(submit(validations,fields,lat,long));
      },
      getSettings: () => dispatch(getSettings()),

  };
}
const mapStateToProps = createStructuredSelector({
  fields: getFields(),
  level: getLevels(),
  settings: fetchSettings(),
  valid: getValid(),
});

const withConnect = connect( mapStateToProps,mapDispatchToProps);

const withReducer = injectReducer({ key: 'TrainerRegister', reducer });
const withSaga = injectSaga({ key: 'TrainerRegister', saga });
export default compose(withReducer, withSaga, withConnect)(TrainerRegister);
