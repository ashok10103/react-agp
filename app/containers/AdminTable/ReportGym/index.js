import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";
import { getComplaintGyms } from "./actions";
import { getGymData, getCount } from "./selectors";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import Pagination from "react-js-pagination";

class ReportGym extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    };
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore(pNo) {
    this.setState({ activePage: pNo });
    setTimeout(() => {
      this.props.getComplaintGyms(this.state.activePage);
    }, 1000);
  }
  componentDidMount() {
    this.props.getComplaintGyms(1);
  }
  render() {
    const { data, count } = this.props;
    return (
      <div className="container">
        <div className="row">
          <main className="db-main ">
            <div className="db-cnt-area">
              <div className=" align-center">
               {
                 data&& data.length ? 
                 <div>
                 <form action="" />
                 <div className="respo-table shadow">
                   <table className="tbl-user-list">
                     <tr>
                       <th>Name</th>
                       <th>Reason</th>
                       <th>Reported by</th>
                       <th>Date</th>
                     </tr>
                     {data &&
                       data.map(d => (
                         <tr>
                           <td>{d.gymId.name}</td>
                           <td>{d.message}</td>
                           <td>{d.userId.firstName}</td>
                           <td>{d.createdAt.split("T")[0]}</td>
                         </tr>
                       ))}
                   </table>
                 </div>

                 <div id="react-paginate">
                   <Pagination
                     hideDisabled
                     activePage={this.state.activePage}
                     itemsCountPerPage={10}
                     totalItemsCount={count}
                     onChange={this.loadMore}
                     innerClass="pagination"
                     activeClass="active"
                     prevPageText="prev"
                     nextPageText="next"
                   />
                 </div>
               </div> : <p> No Reports Yet... </p>
               }
              
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
    getComplaintGyms: pageNumber => {
      return dispatch(getComplaintGyms(pageNumber));
    }
  };
}
const mapStateToProps = createStructuredSelector({
  data: getGymData(),
  count: getCount()
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "ReportGym", reducer });
const withSaga = injectSaga({ key: "ReportGym", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(ReportGym);
