

import React from 'react';
import cx from 'classnames';
import { makeSelectCurrentUser } from './selectors'
import { connect } from 'react-redux';
import { createStructuredSelector } from "reselect"

 class AppWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={cx("", {
        'owner': this.props.user.userType == 'OWNER',
        'pg-members': this.props.user.userType == 'MEMBER',
        'pg-trainers': this.props.user.userType == 'TRAINER',
      })}>
        {this.props.children}
      </div>
    )
  }
}
const mapStateToProps = createStructuredSelector({
  user: makeSelectCurrentUser(),
});

export default connect(mapStateToProps, null)(AppWrapper);
