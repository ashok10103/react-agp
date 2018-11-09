/*
 * User Widget
 *
 * This is the landing page of our User Widget component
 *
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";

class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      readOnly: true,
      preview: null,
      file: ""
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClose = this.handleClose.bind(this);
    
  }
  componentDidMount() {
    const user = this.props.user;
  }
  handleDelete(e) {
    e.preventDefault();
    this.props.deleteUser(this.props.userId);
  }
  handleClose(e) {
    
    e.preventDefault();
    this.props.handleClosee();
  }

  render() {
    const { showPopup } = this.props;
    const { user, editable } = this.state;

    return (
      <Modal
        show={showPopup}
        className="modal fade deleteProfile"
        id="deleteProfile"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header blue-bg">
            <h3 className="text-center color-white">Confirm Delete</h3>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={e => this.handleClose(e)}
                aria-hidden="true"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <h5 className="text-center">Are you sure you want to delete this user ?</h5>
            </div>
            <div className="modal-footer">
              <button
               onClick={e => this.handleClose(e)}
                type="button"
                className="btn btn-default border-bluee "
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                onClick={e => this.handleDelete(e)}
                type="button"
                className="btn btn-danger"
                // id="confirm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
export default DeleteModal;
