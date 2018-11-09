import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Modal, Button } from 'react-bootstrap';
import cx from 'classnames';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
const validations = {
    trainerInfo: ["empty:Trainer Info"],
    country: ["empty:country"],
    trainerType: ["empty:Trainer type"],
    certificates: ["empty:certificates"],
};

class OtherDetails extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            certificates: [],
            trainerType: [],
        };
        this.handleDropDown = this.handleDropDown.bind(this);
    }
    handleDropDown({ target }) {
        const arrayValues = this.props.fields[target.name].value;
        if (!arrayValues.includes(target.value)) {
            arrayValues.push(target.value);
            this.setState({ [target.name]: arrayValues });
            this.props.changeValue(target.name, arrayValues);
            this.props.validate(target.name, validations[target.name])
        } else {
            const index = arrayValues.indexOf(target.value);
            if (index !== -1) arrayValues.splice(index, 1);
            this.setState({ [target.name]: arrayValues });
            this.props.changeValue(target.name, arrayValues);
            this.props.validate(target.name, validations[target.name])
        }
    }

    render() {
        const trainer_types = this.props.settings && this.props.settings.trainer_types;
        const certificates = this.props.settings && this.props.settings.certificates;
        return (
            <div id="others" className="tab-pane fade">
                <form>
                    <div className="fomr-control">

                        <label className="control-label">Trainer Type</label>
                        <ul className="chk-list list-unstyled clearfix trainer-certificates">
                            {trainer_types && trainer_types.map((trainer_type) => {
                                return <div key={trainer_type._id}>
                                    <label className="containercheck">  {trainer_type.trainerType}
                                        <input type="checkbox"
                                            checked={this.props.fields.trainerType.value.length && this.props.fields.trainerType.value.includes(trainer_type._id) ? 'checked' : ''}
                                            className="chcked-sect"
                                            value={trainer_type._id}
                                            name='trainerType'
                                            onClick={this.handleDropDown}
                                        />
                                        <span className="checkmark">
                                            <div className="background-white"></div>
                                        </span>
                                    </label>
                                </div>
                            }
                            )}
                            {this.props.fields.trainerType &&
                                this.props.fields.trainerType.errors.length > 0 && (
                                    <span className="message">
                                        {this.props.fields.trainerType.errors.map(e => (
                                            <span key={e}>{e}</span>
                                        ))}
                                    </span>
                                )}
                        </ul>
                    </div>
                    <div className="fomr-control">
                        <label className="control-label">Certificates</label>
                        <ul className="chk-list list-unstyled clearfix trainer-certificates">
                            {certificates && certificates.map((certificate) => {
                                return <div key={certificate._id}>
                                    <label className="containercheck"> {certificate.name}
                                        <input type="checkbox"
                                            checked={this.props.fields.certificates.value.length && this.props.fields.certificates.value.includes(certificate._id) ? 'checked' : ''}
                                            className="chcked-sect"
                                            value={certificate._id}
                                            name='certificates'
                                            onClick={this.handleDropDown}
                                        />
                                        <span className="checkmark">
                                            <div className="background-white"></div>
                                        </span>
                                    </label>
                                </div>
                            }
                            )}
                            {this.props.fields.certificates &&
                                this.props.fields.certificates.errors.length > 0 && (
                                    <span className="message">
                                        {this.props.fields.certificates.errors.map(e => (
                                            <span key={e}>{e}</span>
                                        ))}
                                    </span>
                                )}
                        </ul>
                    </div>
                </form>
            </div>
        );
    }
}
export default OtherDetails;
