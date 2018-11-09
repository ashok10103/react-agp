import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

class ResetPasswordComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
        this.hideModal = this.hideModal.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // this.setState({ showModal: nextProps.showModal });
    }

    hideModal(e) {
        this.props.hideRpc(e);
    }

    render() {
        const { showModal } = this.state;
        return (
            <Modal show={showModal} className="modal popUp_1 in fade vm">
                <div className="modal-header">
                    <button type="button" className="close" onClick={(e) => this.hideModal(e)}><i className="sprite-icon-close"></i></button>
                    <h3 className="modal-title text-center font-medium">Password reset!</h3>
                </div>
                <div className="modal-body">
                    <div className="pswd-sent-imgbx">
                        <img width="200px" src="/confirm-action-icn.svg" />
                    </div>
                    <p className="forgtpswd-text">You have successfully updated your password. Please login with new password.</p>
                    <form className="cstm_form">
                        <div className="submit-wrp clearfix">
                            <input type="button" className="btn btn-primary btn-block" value="Got it" onClick={(e) => this.hideModal(e)} />
                        </div>
                    </form>
                </div>
            </Modal>
        );
    }
}

export default ResetPasswordComplete;
