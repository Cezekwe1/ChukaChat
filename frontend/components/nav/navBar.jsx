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
      menu: false,
      searchText:"",
    };
    this.openNotificationsList = this.openNotificationsList.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.props.socket.on("receive friend request",data =>{
      
      this.props.getNotifications().then((res)=>{
        this.setState({
          friendRequests: this.props.notifications.friendRequests
        })
        
      })})
  }

  search() {
    return e => {
      var val = e.target.value;
      this.setState({
        searchText: val
      })
      if (val.match(/^[a-zA-Z0-9]+$/)) {
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
      this.setState({
        searchText: ""
      })
      this.props.history.push(`/users/${id}`);
      this.props.clearOutSearch();
      this.setState({ filteredMembers: [], menu: false });
    };
  }

  emptyNotification() {}

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
              <li key={invite._id} className="list-group-item notifications">
                {invite.inviter.username} wants to be friends{" "}
                <span
                  onClick={() => {
                    this.props.respondFriendRequest({
                      id: invite._id,
                      accepted: true
                    }).then(()=>{
                      this.props.socket.emit('accept friend request',{ id: invite.inviter._id});
                    });
                  }}
                  className="text-success"
                >
                  Accept
                </span>{" "}
                <span
                  onClick={() =>
                    this.props.respondFriendRequest({
                      id: invite._id,
                      accepted: false
                    })
                  }
                  className="text-danger"
                >
                  Reject
                </span>{" "}
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
    this.props.logout();
    this.props.clearConvo();
    this.props.history.push("/");
  }

  goToChat = () => {
    this.props.history.push("/chat");
    this.setState({
      menu: false
    });
  };

  loadMenu() {
    var menu;
    if (this.state.menu) {
      menu = (
        <ul className="list-group w-100 pop  mt-1 position-absolute">
          <li className="list-group-item" onClick={this.goToChat}>
            Chat
          </li>
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
      <nav className="navbar border-bottom navbar-light bg-light">
        <h4 onClick={this.goToChat} className="text-capitalize home-link">{this.props.auth.user.username}</h4>
        <div className="position-relative">
          <form className="form-inline mb-0 w-100">
            <input
              onChange={this.search()}
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={this.state.searchText}
            />
          </form>
          <ul className="list-group w-100 pop position-absolute ">
            {this.state.filteredMembers.map(member => {
              return (
                <li
                  key={member._id}
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
              {this.state.seen == false ? this.state.friendRequests.length : 0}
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
