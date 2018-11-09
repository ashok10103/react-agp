import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import { Modal, Button } from "react-bootstrap";
import cx from "classnames";
import { getShareData } from "./actions";
import injectReducer from "utils/injectReducer";
import injectSaga from "utils/injectSaga";
import reducer from "./reducer";
import saga from "./saga";
import { getCount,getData,getGym,getSettings} from "./selectors";
import {
  getUserclassName,
  setUserState,
  getUserType
} from "../../utils/helper";





class Share extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  
  }
  componentDidMount() {
   
    this.props.getShareData(this.props.match.params.gymId);

  }
 
  render() {
    const { gym,count,schedule,settings} = this.props;
 
console.log('this.props',this.props)
    return (
      <div>
      <main className="db-main  padding">
        	
        	<div className="db-cnt-area">
        		
        		<div className="db-cnt-right">
        			<div className="sc-box shadow">
        				<div className="gym-profile">
        					<div className="col img-wrp">
								<span className="user-img"><img src={gym&&gym.gymImages[0] || "/avatar-default.png"}  alt=""/></span>
							</div>
       						<div className="col dtl-wrp">
       							<div className="clearfix">
       								<div className="pull-left">
       									<h3>{gym&&gym.name}</h3>
       								</div>
       							</div>
       							{settings&&settings.gymTypes && settings.gymTypes.map((gymtype) => (
                       	gym&&gym.gymType && gym.gymType .includes(gymtype._id) ? 
                         <p className="text-primary">{gymtype.gymType}</p> : ''
                     )
													)}
       						
       							<p>{gym&&gym.address.addressLine1} {'  '}{gym&&gym.address.addressLine2} {'  '}
                     {gym&&gym.address.city} {'  '}
                     {gym&&gym.address.state} {'  '}
                     {gym&&gym.country} {'  '}</p>
       							<p>{gym&&gym.gymInfo} </p>
       						</div>
        				</div>
					</div>
        		</div>
        		
        		<div className="respo-table shadow">
        				<table className="tbl-user-list">
        					<tr>
        						<th>Date</th>
        						<th>Time slots</th>
        						<th>Number of Slots</th>
        					</tr>
        				
                  {schedule &&
                  schedule.map(d => (
                    <tr>
                      <td>{d.date}</td>
                      <td>
                     {d.data.map(t=>
                       <div>{t.slot}</div>
                     )}
                     </td> 
                     <td>
                     {d.data.map(t=>
                      <div> {count-t.count}</div>
                     )} 
                     </td>
                      
                     
                     
                     
                    </tr>
                  ))}
        					
        			
        				</table>
        			</div>
        			
        	</div>
        </main>
        </div>

    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    
    getShareData: id => dispatch(getShareData(id)),
   
  };
}
const mapStateToProps = createStructuredSelector({
  schedule: getData(),
  count:getCount(),
  gym: getGym(),
  settings:getSettings()

});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

const withReducer = injectReducer({ key: "Share", reducer });
const withSaga = injectSaga({ key: "Share", saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(Share);
