import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { getStateNotifications } from './selectors';
import { getNotifications } from './actions';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import { getTimeAgo } from 'utils/helper';


export class NotificationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }

    componentDidMount() {
        this.props.getNotifications(this.props.match.params.userId);
    }

    render() {
        const data = this.props.notifications && this.props.notifications.data
        console.log('notificatios',this.props)

        return (

            <div className="contentarea p-notifications">
                <div className="container">
                    <h3 className="ttl">Notifications</h3>
                    <ul className="notification-list list-unstyled">
                        {data && data.map((d) =>
                            <li className="item clearfix">
                                <span className="img-wrp">
                                    <img src="images/temp/notifications.png" alt="" />
                                </span>
                                <div className="rgt-block">
                                    <h5 className="nt-ttl">{d.title}</h5>
                                    <p> {d.description}</p>
                                    <p className="time mb-0"><i className="sprite-notification"></i><span>{getTimeAgo(d.createdAt)}</span></p>
                                </div>
                                {/* <a href="" className="nt-close"><i className="fa fa-times-circle-o" aria-hidden="true"></i></a> */}
                            </li>
                        )}
                    </ul>
                    {data && data.length ? '' : <p>No notifications yet!!</p>}
                </div>
            </div>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getNotifications: (id) => dispatch(getNotifications(id)),
    };
}

const mapStateToProps = createStructuredSelector({
    notifications: getStateNotifications(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'NotificationList', reducer });
const withSaga = injectSaga({ key: 'NotificationList', saga });

export default compose(withReducer, withSaga, withConnect)(NotificationList);
