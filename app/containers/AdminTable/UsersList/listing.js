import React, { Component } from "react";
import { Button } from "react-bootstrap";
import DeleteModal from "components/Modal";
import InfiniteScroll from "react-infinite-scroller";
import ReactPaginate from "react-paginate";
import Pagination from "react-js-pagination";
let name;
export default class Listing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: "",
      filteredArray: [],
      showPopup: false,
      userId: ""
    };
    this.handleButton = this.handleButton.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.search = this.search.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleClosee = this.handleClosee.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }
  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber });
    this.props.setPageNumber(ths.state.activePage);
  }

  search(arrayy, Value) {
    this.setState({ value: Value });
  }
  handleDelete() {
    this.props.deleteUser(this.state.userId);
    this.setState({ userId: "", showPopup: false });
  }
  handleDeletePopup(e, id) {
    e.preventDefault();
    this.setState({ userId: id, showPopup: true });
  }

  handleButton(e, id, blockedState) {
    this.props.blockUser(id, blockedState);
  }
  handleClosee() {
    this.setState({ userId: "", showPopup: false });
  }

  sendData(e, key) {
    e.preventDefault();
    this.props.getUsers({}, this.props.type, key);
    this.setState({ value: "" });
  }

  clearFilter() {
    this.setState({ value: "" });
    this.props.getUsers(2, this.props.type);
  }
  render() {
    const pagesCount = parseInt(this.props.count / 10);
    const data = this.props.users;

    return (
      <div>
        <form action="">
          <div className="search-bar">
            <div className="form-group">
              <input
                type="search"
                className="form-control search-input"
                placeholder="Search Here By Email.."
                onChange={e =>
                  this.search(this.state.filteredArray, e.target.value)
                }
                value={this.state.value}
              />
              <button
                className="search-submit"
                type="submit"
                onClick={e => this.sendData(e, this.state.value)}
              >
                <i className="fa fa-search" />
              </button>
              {this.state.value && (
                <button
                  className="search-reset"
                  type="button"
                  onClick={this.clearFilter}
                >
                  <i className="fa fa-close" />
                </button>
              )}
            </div>
          </div>
        </form>
        <div className="respo-table shadow">
          <table className="tbl-user-list">
            <tr>
              <th>Name</th>
              {this.props.type === "OWNER" ? <th>Gym's Name</th> : ""}
              <th>Email</th>
              <th>Phone number</th>
              <th>Manage</th>
            </tr>
            {this.props.userss &&
              this.props.userss.length &&
              this.props.userss.map((d, index) => (
                <tr key={index}>
                  <td
                    className="user-view"
                    data-toggle="popover"
                    title="View details"
                    onClick={e => this.props.viewUser(d._id)}
                  >
                    {" "}
                    {d.firstName + " " + d.lastName}
                  </td>
                  {this.props.type === "OWNER" ? <td>{d.gym}</td> : ""}
                  <td>{d.emailId}</td>
                  <td>{d.phoneNumber}</td>
                  <td>
                    <div className="user-options">
                      <a className="edit user-view">
                        <i
                          data-toggle="popover"
                          title="Edit user"
                          className="fa fa-edit"
                          aria-hidden="true"
                          onClick={this.props.editUser}
                        />
                      </a>
                      <a className="delete">
                        <i
                          data-toggle="popover"
                          title="Delete user"
                          onClick={e => this.handleDeletePopup(e, d._id)}
                          className="fa fa-trash user-view "
                          aria-hidden="true"
                        />
                      </a>
                      <a className="block">
                        <i
                          data-toggle="popover"
                          title={d.blocked ? "Unblock user" : "Block user"}
                          onClick={e => this.handleButton(e, d._id, d.blocked)}
                          className={`fa fa-ban user-view ${
                            d.blocked ? "red-color" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
          </table>
        </div>

        <div id="react-paginate">
          <Pagination
            hideDisabled
            activePage={this.props.activePage}
            itemsCountPerPage={10}
            totalItemsCount={this.props.count}
            onChange={this.props.loadMore}
            innerClass="pagination"
            activeClass="active"
            prevPageText="prev"
            nextPageText="next"
          />
        </div>

        {/* </InfiniteScroll> */}
        <DeleteModal
          deleteUser={this.handleDelete}
          userId={this.state.userId}
          showPopup={this.state.showPopup}
          handleClosee={this.handleClosee}
        />
      </div>
    );
  }
}
