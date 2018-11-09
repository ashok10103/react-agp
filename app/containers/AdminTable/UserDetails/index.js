import React, { Component } from "react";
import TrainerDetails from "./trainerDetails";
import GymDetails from "./gymDetails";
import UserProfile from "./userProfile";
let count = 240;
export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "OWNER",
      edittt: this.props.edit,
      editttGym: this.props.edittt,
      editttUser: this.props.edittt,
      editttTrainer: this.props.editttTrainer
    };
    this.editState = this.editState.bind(this);
  }
  editState(type) {
    this.setState({ [type]: !this.state[type] });
  }
  componentDidMount() {
    this.props.getInitialData(this.props.typee, this.props.id);
  }

  render() {
    return (
      <div>
        <UserProfile
          {...this.props}
          editInside={this.state.edittt || this.state.editttUser}
          editt={this.editState}
          userProfile={this.props.userProfile}
          sendUser={this.props.sendUser}
        />
        {this.props.typee == "OWNER" ? (
          <GymDetails
            {...this.props}
            editt={this.editState}
            edit={this.props.edit || this.state.editttGym}
            gymProfile={this.props.gymProfile}
          />
        ) : (
          ""
        )}
        {this.props.typee == "TRAINER" ? (
          <TrainerDetails
            {...this.props}
            editInside={this.state.edittt}
            editt={this.editState}
            edit={this.props.edit || this.state.editttTrainer}
            trainerProfile={this.props.trainerProfile}
          />
        ) : (
          ""
        )}
        {this.props.edit ||
        this.state.editttGym ||
        this.state.editttUser ||
        this.state.editttTrainer ? (
          <div className="btn-wrp text-right">
            <a
              onClick={() =>
                this.props.updateData(
                  this.props.typee,
                  this.props.id,
                  this.state.edittt
                )
              }
              className="edit btn btn-primary gradient-primary btn-update"
            >
              Update
            </a>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
