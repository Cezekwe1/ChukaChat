import React, { Component } from "react";
import { throwStatement } from "@babel/types";

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { user: {}, pending_org: false, pending_friend: false };
  }

  componentWillMount() {
    this.props.getProfile(this.props.id).then(() => {
      this.setState({
        user: this.props.profile,
        pending_friend: this.props.profile.pending_friend,
        pending_org: this.props.profile.pending_org
      });
    });
  }

  componentWillReceiveProps(nextProps, oldProps) {
   
    if (nextProps.id != nextProps.profile._id) {
      this.props.getProfile(this.props.id).then(() => {
        this.setState({
          user: this.props.profile,
          pending_friend: this.props.profile.pending_friend,
          pending_org: this.props.profile.pending_org
        });
      });
    }
    if (nextProps.profile != this.state.user) {
      this.setState({
        user: nextProps.profile,
        pending_friend: nextProps.profile.pending_friend,
        pending_org: nextProps.profile.pending_org
      });
    }
    
  }

  actionButtons() {
    var addToOrganization,
      addFriend,
      removeFriend,
      removeMember = "";
    if (this.props.currentUser.user._id != this.state.user._id) {
      if (this.props.areFriends) {
        removeFriend = (
          <button
            onClick={() => this.props.removeFriend(this.state.user._id)}
            className="btn mt-5 mr-2 btn-primary"
          >
            Remove Friend
          </button>
        );
      } else {
        if (this.state.pending_friend) {
          addFriend = (
            <button className="btn mt-5 mr-2 btn-secondary disabled">
              Add Friend
            </button>
          );
        } else {
          addFriend = (
            <button
              onClick={() => this.props.sendFriendRequest(this.state.user._id)}
              className="btn mt-5 mr-2 btn-success"
            >
              Add Friend
            </button>
          );
        }
      }
    }

    if (this.props.currentUser.current_organization) {
      if (this.state.user.is_member) {
        if (!this.state.user.is_admin) {
          if (this.props.currentUser.current_organization.is_admin) {
            addToOrganization = (
              <button
                onClick={() => {
                  this.props.makeAdmin({
                    organization_id: this.props.currentUser.current_organization
                      .id,
                    target_id: this.state.user.id
                  });
                }}
                className="btn mt-5 mr-2 btn-primary"
              >
                Make Admin
              </button>
            );
          }
        }

        if (this.props.currentUser.current_organization.is_admin) {
          removeMember = (
            <button
              onClick={() =>
                this.props.removeMember({
                  target_id: this.state.user.id,
                  organization: this.props.currentUser.current_organization.id
                })
              }
              className="btn mt-5 mr-2 btn-primary"
            >
              Remove Member
            </button>
          );
        }
      } else {
        if (this.state.pending_org) {
          addToOrganization = (
            <button className="btn mt-5 mr-2 btn-secondary disabled">
              {" "}
              Add Member
            </button>
          );
        } else {
          if (this.props.currentUser.current_organization.is_admin) {
            addToOrganization = (
              <button
                onClick={() => this.props.sendOrgInvite(this.state.user.id)}
                className="btn mt-5 mr-2 btn-primary"
              >
                {" "}
                Add Member{" "}
              </button>
            );
          }
        }
      }
    }

    return { addToOrganization, addFriend, removeFriend, removeMember };
  }
  render() {
    var {
      addToOrganization,
      addFriend,
      removeFriend,
      removeMember
    } = this.actionButtons();
    return (
      <div className="h-100">
        <div className="card card-block w-50  mt-5 h-50 mx-auto ">
          <div className="card-body text-center">
            <h2>{this.state.user.username}</h2>
            <h6>{this.state.user.email}</h6>
            <h6>{this.state.user.is_admin ? "administrator" : ""}</h6>
            {addToOrganization}
            {removeMember}
            {addFriend}
            {removeFriend}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
