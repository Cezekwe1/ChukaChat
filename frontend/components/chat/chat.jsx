import React, { Component } from "react";
import { Collection } from "mongoose";
import Video from "./videoChat";
import Peer from "simple-peer";
import * as PeerUtil from "./peerUtil";
import { thisExpression } from "@babel/types";

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.friendsObj = { length: 0 };
    this.state = {
      currentConvo: this.props.currentConvo,
      text: "",
      calling: false,
      otherId: null,
      incoming: false,
      otherVid: null,
      openRinger: false,
      answered: null,
      caller: null,
      onCall: false,
      notifications: {}
    };
    this.friendsObj[this.props.me._id] = "Me";
    this.stream = null;

    this.process();

    this.props.socket.on("receive message", data => {
      if (this.state.currentConvo) {
        props.addMessage(data.message);
        this.scrollToBottom();
      }
    });

    this.props.socket.on("receive notification", data => {
      this.checkFor(data).then(() => {
        if (
          !this.state.currentConvo ||
          data.conversation != this.state.currentConvo._id
        ) {
          this.setNotifications(data.conversation, true);
        }
      });
    });
    this.peers = {};
  }
  componentWillMount() {
    this.props.getMe();
  }
  componentDidMount() {
    if (this.state.currentConvo) {
      this.setConvo(this.state.currentConvo)();
    }
  }

  componentWillUpdate() {
    if (this.props.friends.length > this.friendsObj.length) {
      let last = this.props.friends.length - 1;
      let el = this.props.friends[last];
      this.friendsObj[el._id] = el.username;
      this.friendsObj.length += 1;
    }
  }

  checkFor = data => {
    return new Promise((resolve, reject) => {
      for (let convo of this.props.conversations) {
        if (data.conversation == convo._id) {
          resolve();
        }
      }
      this.props
        .getMe()
        .then(res => {
          resolve();
        })
        .catch(() => reject());
    });
  };

  setNotifications = (convo, val) => {
    this.state.notifications[convo] = val;
    let newState = this.state.notifications;
    this.setState({
      notifications: newState
    });
  };
  setLastConvo = () => {
    this.setConvo(
      this.props.conversations[this.props.conversations.length - 1]
    )();
  };

  setPeer = (id, val) => {
    this.peers[id] = val;
  };

  setOtherVid = ref => {
    this.setState({
      otherVid: ref
    });
  };

  getMyPeer = () => this.myPeer;

  process = () => {
    this.friendsObj.length = 0;
    this.props.friends.forEach(el => {
      this.friendsObj[el._id] = el.username;
      this.friendsObj.length += 1;
    });
  };

  handleChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  setOnCall = val => {
    this.setState({
      onCall: val
    });
  };

  enterKeySubmit = e => {
    if (e.keyCode == 13) {
      this.handleSubmit(e);
    }
  };

  getSplash = () => {
    var img = "";
    if (!this.state.currentConvo) {
      img = <img className="splash-screen" src="../images/new_cover.png" />;
    }
    return img;
  };

  handleSubmit = e => {
    if (this.state.currentConvo) {
      this.props
        .sendMessage({
          text: this.state.text,
          receiver: this.state.currentConvo.other,
          conversation: this.state.currentConvo._id
        })
        .then(res => {
          this.props.socket.emit("send message", {
            conversation: this.state.currentConvo._id,
            message: res.payload,
            sender: this.props.me._id
          });
          this.setState({
            text: ""
          });
          this.scrollToBottom();
        });
    }
  };

  setConvo = convo => {
    var other =
      convo.target != this.props.me._id ? convo.target : convo.starter;
    var obj = {
      _id: convo._id,
      other,
      target: convo.target,
      starter: convo.starter
    };

    return e => {
      if (this.state.currentConvo) {
        this.props.socket.emit("leave conversation", {
          conversation: this.state.currentConvo._id
        });
      }
      this.setNotifications(convo._id, false);
      this.props.socket.emit("join conversation", { conversation: convo._id });
      this.props.setCurrentConvo(obj);
      this.props.getAllMessages(convo._id).then(() => {
        this.scrollToBottom();
      });
      this.setState({
        currentConvo: obj,
        otherId: other
      });
    };
  };

  convoFilter = person => {
    for (let i in this.props.conversations) {
      var convo = this.props.conversations[i];
      if (person._id == convo.target || person._id == convo.starter) {
        return false;
      }
    }
    return true;
  };

  turnOffVideo = () => {
    this.setState({
      incoming: false,
      calling: false
    });
  };

  getVideo = () => {
    var video;
    if (this.state.calling) {
      video = (
        <Video
          socket={this.props.socket}
          stream={this.stream}
          otherId={this.state.otherId}
          setPeer={this.props.setPeer}
          id={this.props.me._id}
          username={this.props.me.username}
          setOtherVid={this.props.setOtherVid}
          incoming={this.state.incoming}
          getPeer={this.getMyPeer}
          turnOffVideo={this.turnOffVideo}
          setOnCall={this.props.setOnCall}
          otherVidId={this.otherVidId}
        />
      );
    } else {
      video = "";
    }
    return video;
  };

  setInputBtn = () => {
    var bottomInputGroup = "";
    if (this.state.currentConvo) {
      bottomInputGroup = (
        <div className="bottom-input input-group">
          <input
            onChange={this.handleChange}
            type="text"
            className="form-control"
            value={this.state.text}
            onKeyDown={this.enterKeySubmit}
          />
          <div className="input-group-append">
            <span
              onClick={this.handleSubmit}
              className="clickable input-group-text"
              id="basic-addon2"
            >
              Send
            </span>
          </div>
        </div>
      );
    }
    return bottomInputGroup;
  };

  scrollToBottom = () => {
    var height = this.refs.messages.scrollHeight;
    this.refs.messages.scrollTop = height;
  };

  getCallBtn = () => {
    if (this.state.currentConvo && !this.props.onCall) {
      return (
        <button
          className="rounded-pill btn-outline-success call-btn p-3 shadow-lg"
          onClick={() => {
            this.setState({ calling: true });
          }}
        >
          Call
        </button>
      );
    } else {
      return "";
    }
  };

  onListItemEnter = (e) =>{
    if(e.target.children && e.target.children[0]){
      e.target.children[0].classList.remove("d-none")
    }
  }

  onListItemLeave = (e) =>{
    if(e.target.children && e.target.children[0]){
      e.target.children[0].classList.add("d-none")
    }
  }
  

  deleteFriend = person => {
    return e => {
      e.stopPropagation();
      this.props.deleteFriend(person._id).then(() => {
        this.props.socket.emit("remove friend", { id: person._id });
      });
    };
  };

  deleteConversation = convo => {
    return e => {
      e.stopPropagation();
      if (this.state.currentConvo && this.state.currentConvo._id == convo._id) {
        this.setState({
          currentConvo: null
        });
        this.props.socket.emit("leave conversation", {
          conversation: this.state.currentConvo._id
        });
        this.props.setCurrentConvo(null)
        this.props.socket.emit("remove friend", { id: convo.other });
      }
      this.props.deleteConversation(convo._id);
      let other = (convo.target == this.props.me._id) ? convo.starter : convo.target
      this.props.socket.emit("remove friend", { id: other });
    };
  };
  render() {
    let video = this.getVideo();
    let callBtn = this.getCallBtn();
    let bottomInputGroup = this.setInputBtn();
    let splash = this.getSplash();
    return (
      <section className="container-fluid p-0 m-0 row max-height">
        <aside className="bg-light border-right col-2 pt-5 p-0" align="center">
          Conversations
          <ul className="mt-3 mb-4 text-secondary">
            {this.props.conversations.map(convo => {
              return (
                <li
                  onMouseEnter={this.onListItemEnter}
                  onMouseLeave={this.onListItemLeave}
                  className={
                    this.state.notifications[convo._id]
                      ? "clickable text-primary"
                      : "clickable"
                  }
                  key={convo._id}
                  onClick={() => this.setConvo(convo)()}
                >
                  {`${this.friendsObj[convo.starter]},${" "}${
                    this.friendsObj[convo.target]
                  }`}

                  <span
                    onClick={this.deleteConversation(convo)}
                    className="close text-danger d-none icon mr-2"
                  >
                    &times;
                  </span>
                </li>
              );
            })}
          </ul>
          Friends
          <ul className="mt-3">
            {this.props.friends
              .filter(friend => {
                return this.convoFilter(friend);
              })
              .map(person => {
                return (
                  <li
                    onMouseEnter={this.onListItemEnter}
                    onMouseLeave={this.onListItemLeave}
                    className="clickable"
                    onClick={() =>
                      this.props.makeConvo(person._id).then(() => {
                        this.setLastConvo();
                        this.props.socket.emit("made conversation",{id: person._id})
                      })
                    }
                    key={person._id}
                  >
                    {person.username}
                    <span
                      onClick={this.deleteFriend(person)}
                      className="close text-danger d-none icon mr-2"
                    >
                      &times;
                    </span>
                  </li>
                );
              })}
          </ul>
        </aside>
        <section
          className="max-height  position-relative col-10 p-0"
          align="center"
        >
          <h1 className=" messaging-header position-absolute">
            {this.state.currentConvo
              ? this.friendsObj[this.state.currentConvo.other]
                  .charAt(0)
                  .toUpperCase() +
                this.friendsObj[this.state.currentConvo.other].slice(1)
              : ""}
          </h1>

          <div ref="messages" className="h-100 text-center overflow-auto p-5">
            {splash}
            {this.props.messages.map((message, idx) => {
              return (
                <div
                  key={idx}
                  className={
                    message.sender == this.props.me._id
                      ? "sender  rounded-pill shadow d-block w-15 p-2 mb-3"
                      : "receiver rounded-pill shadow d-block w-15 p-2 mb-3"
                  }
                >
                  {message.text}
                </div>
              );
            })}
            {callBtn}
            {video}
          </div>
          {bottomInputGroup}
        </section>
      </section>
    );
  }
}

export default Chat;
