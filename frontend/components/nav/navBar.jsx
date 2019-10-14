import React, { Component } from "react";
import { withRouter } from "react-router";
import { NavLink } from "react-router-dom";
export class NavBar extends Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.goToProfile = this.goToProfile.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      filteredMembers: this.props.filteredMembers,
      notifications: false,
      friendRequests: [],
      acceptedFriendRequests: [],
      seen: false,
      menu: false
    };
    this.openNotificationsList = this.openNotificationsList.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  search() {
    return e => {
      var val = e.target.value;
      if (val.match(/^[a-zA-Z]+$/)) {
        this.props.search(val).then(() => {
          this.setState({
            filteredMembers: this.props.filteredMembers
          });
        });
      } else {
        this.props.clearOutSearch();
        this.setState({
          filteredMembers: []
        });
      }
    };
  }

  componentWillMount() {
    this.props.getNotifications().then(() => {
      this.setState({
        orgInvites: this.props.notifications.orgInvites,
        friendRequests: this.props.notifications.friendRequests,
        acceptedFriendRequests: this.props.notifications.acceptedFriendRequests
      });
    });
  }


  componentDidUpdate(nextProps, prevProps) {
    if (nextProps.filteredMembers != prevProps.filteredMembers) {
      this.setState({
        filteredMembers: nextProps.filteredMembers
      });
    }
  }

  goToProfile(id) {
    return e => {
      this.props.history.push(`/users/${id}`);
      this.props.clearOutSearch();
      this.setState({ filteredMembers: [] });
    };
  }


 

  emptyNotification() {
  }

  showNotifications() {
    var notificationsList;
    var length =
      this.state.friendRequests.length +
      this.state.acceptedFriendRequests.length;
    if (this.state.notifications && length > 0) {
      notificationsList = (
        <ul className="list-group pop position-absolute">
          {this.state.friendRequests.map(invite => {
            return (
              <li className="list-group-item">
                {invite.inviter.username} wants to be friends{" "}
                <button
                  onClick={() =>
                    this.props.respondFriendRequest({
                      id: invite._id,
                      accepted: true
                    })
                  }
                  className="btn btn-success"
                >
                  Accept
                </button>{" "}
                <button
                  onClick={() =>
                    this.props.respondFriendRequest({
                      id: invite._id,
                      accepted: false
                    })
                  }
                  className="btn btn-danger"
                >
                  Reject
                </button>{" "}
              </li>
            );
          })}
          {this.state.acceptedFriendRequests.map(invite => {
            return (
              <li className="list-group-item">
                {invite.target.username} has accepted your friend request
              </li>
            );
          })}
        </ul>
      );
    } else {
      notificationsList = "";
    }
    return notificationsList;
  }

  logout() {
    this.props.clearOutSearch();
    this.props.logout()
    this.props.history.push("/");
  
  }

  loadMenu() {
    var menu;
    if (this.state.menu) {
      menu = (
        <ul className="list-group w-100 pop  mt-1 position-absolute">
          <li className="list-group-item" onClick={this.logout}>
            Logout
          </li>
        </ul>
      );
    } else {
      menu = "";
    }
    return menu;
  }
  toggleMenu() {
    this.setState({
      menu: !this.state.menu
    });
  }

  openNotificationsList() {
    this.setState({
      notifications: !this.state.notifications
    });
    this.emptyNotification();
  }

  render() {
    var notifications = this.showNotifications();
    var menu = this.loadMenu();
    return (
      <nav className="navbar  navbar-light bg-light">
        <div className="position-relative">
          <form className="form-inline w-100">
            <input
              onChange={this.search()}
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </form>
          <ul className="list-group w-100 pop  mt-1 position-absolute ">
            {this.state.filteredMembers.map(member => {
              
              return (
                <li
                  onClick={this.goToProfile(member._id)}
                  className="list-group-item"
                >
                  {member.username}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="position-relative">
          <button
            onClick={this.openNotificationsList}
            type="button"
            className="btn btn-primary"
          >
            Notifications{" "}
            <span className="badge badge-light">
              {this.state.seen == false
                ?
                  this.state.friendRequests.length 
                : 0}
            </span>
          </button>
          {notifications}
        </div>
        <div className="position-relative">
          <button
            onClick={this.toggleMenu}
            className="btn btn-lg btn-primary py-1 px-5"
          >
            Menu
          </button>
          {menu}
        </div>
      </nav>
    );
  }
}

export default withRouter(NavBar);
