import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import {
  getUsers,
  blockUser,
  deleteUser,
  setPageNumber,
  sendUserData,
  updateData,
  getInitialData
} from "./actions";
import {
  getUsersList,
  getBlocked,
  getPageNumber,
  getCount,
  getUserDetails,
  getTrainerDetails,
  getTrainerSettings,
  getGymDetails,
  getSettings,
  getDisplay
} from "./selectors";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import Listing from "./listing";
import InfiniteScroll from "react-infinite-scroller";
import cx from "classnames";
import { getUserType } from "utils/helper";
import UserDetails from "../UserDetails";
import { timingSafeEqual } from "crypto";
let count = 240;
class UsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "OWNER",
      updateType: "",
      userActive: false,
      userEdit: false,
      activePage: 1,
      id: ""
    };
    this.loadMore = this.loadMore.bind(this);
    this.setUserType = this.setUserType.bind(this);
    this.viewUser = this.viewUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.sendUser = this.sendUser.bind(this);
    this.updateDetails = this.updateDetails.bind(this);
  }
  componentDidMount() {
    this.props.setPageNumber(1);
    this.props.getUsers(1, this.state.type);
  }
  updateDetails(typee, id, edit) {
    this.props.updateData(typee, id, edit);
  }

  setUserType(typee) {
    this.setState(
      { type: typee, userActive: false, userEdit: false, activePage: 1 },
      () => {
        this.props.setPageNumber(this.state.activePage);
        this.props.getUsers(this.state.activePage, this.state.type);
      }
    );
  }
  viewUser(id) {
    this.setState({ userActive: true, id: id });
  }
  editUser() {
    this.setState({ userActive: true, userEdit: true });
  }

  sendUser() {
    this.props.sendUserData(type, name, value);
    this.setState({ updateType: type });
  }

  loadMore(pNo) {
    this.setState({ activePage: pNo });
    this.props.setPageNumber(pNo);
    setTimeout(() => {
      this.props.getUsers(this.state.activePage, this.state.type);
    }, 1000);
    
  }
  filterUsers() {
    const filteredArray =
      this.props.users &&
      this.props.users.filter(itm => {
        return this.state.type.toUpperCase() == itm.userType;
      });
    return filteredArray;
  }

  render() {
    const { type } = this.state;

    return (
      <div className="container">
        <div className="row">
          <main className="db-main aside-open">
            <div className="db-cnt-area">
              <aside className="db-sidebar">
                <nav className="sideNav">
                  <ul className="list-unstyled">
                    <li
                      className="tabb user-view"
                      onClick={() => this.setUserType("OWNER")}
                    >
                      <a
                        className={cx({ active: type === "OWNER" })}
                        data-toggle="tab"
                      >
                        Owner
                      </a>
                    </li>

                    <li
                      className="tabb user-view active tabb"
                      onClick={() => this.setUserType("MEMBER")}
                    >
                      <a
                        data-toggle="tab"
                        className={cx({ active: type === "MEMBER" })}
                      >
                        Member
                      </a>
                    </li>

                    <li
                      className=" user-view tabb active tabb"
                      onClick={() => this.setUserType("TRAINER")}
                    >
                      <a
                        data-toggle="tab"
                        className={cx({ active: type === "TRAINER" })}
                      >
                        Trainer
                      </a>
                    </li>
                  </ul>
                </nav>
              </aside>
              <div className="db-cnt-right">
                {this.state.userActive ? (
                  ""
                ) : (
                  <Listing
                    {...this.props}
                    users={this.filterUsers()}
                    blockedState={this.props.blockedState}
                    blockUser={this.props.blockUser}
                    deleteUser={this.props.deleteUser}
                    setPageNumber={this.props.setPageNumber}
                    getUsers={this.props.getUsers}
                    loadMore={this.loadMore}
                    sendData={this.props.getUsers}
                    count={this.props.count}
                    type={this.state.type}
                    userss={this.props.users}
                    viewUser={this.viewUser}
                    editUser={this.editUser}
                    pageNumber={this.props.pageNUmber}
                    activePage={this.state.activePage}
                  />
                )}

                {this.state.userActive || this.state.userEdit ? (
                  <UserDetails
                    id={this.state.id}
                    updateDetails={this.updateDetails}
                    sendUser={this.sendUser}
                    typee={this.state.type}
                    {...this.props}
                    gymProfile={this.props.gymProfile}
                    trainerProfile={this.props.trainerProfile}
                    userProfile={this.props.userProfile}
                    edit={this.state.userEdit}
                    {...this.props}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    getUsers: (pageNumber, type, key) => {
      return dispatch(getUsers(pageNumber, type, key));
    },
    blockUser: (id, blockedState) => {
      return dispatch(blockUser(id, blockedState));
    },
    updateData: (typee, id, edit) => {
      return dispatch(updateData(typee, id, edit));
    },
    deleteUser: id => {
      return dispatch(deleteUser(id));
    },
    getInitialData: (type, id) => {
      return dispatch(getInitialData(type, id));
    },
    sendUserData: (type, field, value) =>
      dispatch(sendUserData(type, field, value)),
    setPageNumber: number => dispatch(setPageNumber(number))
  };
}
const mapStateToProps = createStructuredSelector({
  users: getUsersList(),
  blockedState: getBlocked(),
  pageNumber: getPageNumber(),
  count: getCount(),
  userProfile: getUserDetails(),
  trainerProfile: getTrainerDetails(),
  gymProfile: getGymDetails(),
  trainerSettings: getTrainerSettings(),
  settings: getSettings(),
  display: getDisplay()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "UsersList", reducer });
const withSaga = injectSaga({ key: "UsersList", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(UsersList);
