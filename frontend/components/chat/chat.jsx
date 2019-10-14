import React, { Component } from "react";
import { Collection } from "mongoose";
import io from "socket.io-client";
import Video from "./videoChat";
import Peer from "simple-peer";
import * as PeerUtil from "./peerUtil";
var socket = io();

export class Chat extends Component {
  constructor(props) {
    
    super(props);
    this.friendsObj = {};
    this.state = {
      currentConvo: null,
      text: "",
      calling: false,
      otherId: null,
      incoming: false,
      otherVid: null,
      openRinger: false,
      answered: null,
      caller: null,
      onCall: false
    };
    this.friendsObj[this.props.me._id] = "Me";
    this.stream = null;
    this.process();
    this.peers = {};
    socket.on("receive message", data => {
      if (this.state.currentConvo) {
        props.addMessage(data.message);
      }
    });
    socket.emit("join video channel", {id: this.props.me._id})
    this.setUpSocket();
  }

  

  setPeer = (id, val) => {
    this.peers[id] = val;
  };

  setOtherVid = ref => {
    this.setState({
      otherVid: ref
    });
  };

  setUpSocket = () => {
    socket.on("signal", data => {

      let peer = this.peers[data.userId];
      
      console.log("signal i got ",peer)
      if (peer) {
        console.log("back in here")
        peer.signal(data.info);
      }

      if(this.state.oncall){
        socket.emit("reject call", {id:data.userId})
        return
      }

      if (peer === undefined) {
        this.setRinger(data.username, true)
          .then(promise => {
            
            clearInterval(promise.interval);
            clearTimeout(promise.timer);
            this.setState({
              answered: null
            });
            PeerUtil.getUserMedia().then(stream => {
              this.stream = stream;
              this.setState({
                calling: true,
                incoming: true,
                onCall: true
              });
              this.otherVidId = data.userId
              peer = PeerUtil.createPeer(
                data.userId,
                false,
                this.stream,
                this.state.otherVid,
                this.setPeer,
                this.props.me._id,
                socket
              );
              this.myPeer = peer;
              this.peers[data.userId] = peer;
              peer.signal(data.info);
            });
          })
          .catch(promise => {
            clearInterval(promise.interval);
            clearTimeout(promise.timer);
            this.setState({
              answered: null,
              onCall: false
            });
            socket.emit('reject call',{id: data.userId})
          });
      }
    });
  };

  getMyPeer = () => this.myPeer;

  setRinger = (name, val) => {
    this.setState({
      caller: name,
      openRinger: val
    });

    return new Promise((resolve, reject) => {
      let timer;
      let interval = setInterval(() => {
        
        if (this.state.answered) {
          resolve({ interval, timer });
        } else if (this.state.answered === false) {
          reject({ timer, interval });
        }
      }, 10);
      timer = setTimeout(() => {
        reject({ timer, interval });
      }, 60000);
    });
  };

  process = () => {
    this.props.friends.forEach(el => {
      this.friendsObj[el._id] = el.username;
    });
  };

  handleChange = e => {
    this.setState({
      text: e.target.value
    });
  };

  setOnCall = (val) =>{
    this.setState({
      onCall: val 
    })
  }

  handleSubmit = () => {
    if (this.state.currentConvo) {
      this.props
        .sendMessage({
          text: this.state.text,
          receiver: this.state.currentConvo.other,
          conversation: this.state.currentConvo._id
        })
        .then(res => {
          socket.emit("send message", {
            conversation: this.state.currentConvo._id,
            message: res.payload
          });
        });
    }
  };

  setConvo = convo => {
    var other = (convo.target != this.props.me._id)? convo.target : convo.starter;
    var obj = { _id: convo._id, other };

    return e => {
      socket.emit("join conversation", { conversation: convo._id });

      this.props.getAllMessages(convo._id);
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

  answerCall = val => {
    this.setState({
      answered: val,
      openRinger: false
    });
  };
  getRinger = () => {
    var ringer;
    if (this.state.openRinger) {
      ringer = (
        <div className="card">
          <button
            onClick={() => this.answerCall(true)}
            className="btn btn-md btn-success"
          >
            Answer
          </button>
          <button
            onClick={() => this.answerCall(false)}
            className="btn btn-md btn-warning"
          >
            Decline
          </button>
        </div>
      );
    } else {
      ringer = "";
    }
    return ringer;
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
          socket={socket}
          stream={this.stream}
          otherId={this.state.otherId}
          setPeer={this.setPeer}
          id={this.props.me._id}
          setOtherVid={this.setOtherVid}
          incoming={this.state.incoming}
          getPeer={this.getMyPeer}
          turnOffVideo={this.turnOffVideo}
          setOnCall={this.setOnCall}
          otherVidId={this.otherVidId}
        />
      );
    } else {
      video = "";
    }
    return { video };
  };

  getCallBtn = () => {
    if (this.state.currentConvo) {
      return (
        <button
          onClick={() => {
            this.setState({ calling: true });
          }}
        ></button>
      );
    } else {
      return "";
    }
  };
  render() {
    let { video } = this.getVideo();
    let callBtn = this.getCallBtn();
    let ringer = this.getRinger();
    return (
      <div className="container-fluid max-height">
        <div className="row max-height">
          <div className="bg-light col-2 p-0">
            Conversations
            <ul>
              {this.props.conversations.map(convo => {
                return (
                  <li key={convo._id} onClick={this.setConvo(convo)}>{`${
                    this.friendsObj[convo.starter]
                  },${this.friendsObj[convo.target]}`}</li>
                );
              })}
            </ul>
            Friends
            <ul>
              {this.props.friends
                .filter(friend => {
                  return this.convoFilter(friend);
                })
                .map(person => {
                  return (
                    <li
                      onClick={() => this.props.makeConvo(person._id)}
                      key={person._id}
                    >
                      {person.username}
                    </li>
                  );
                })}
            </ul>
          </div>
          <div className="col-10 p-0">
            <h1>
              {this.state.currentConvo
                ? this.friendsObj[this.state.currentConvo.other]
                : "Pick a Convo"}
            </h1>
            <div className="max-height">
              {this.props.messages.map((message, idx) => {
                return (
                  <div
                    key={idx}
                    className={
                      message.sender == this.props.me._id
                        ? "sender"
                        : "receiver"
                    }
                  >
                    {message.text}
                  </div>
                );
              })}
              {ringer}
              {callBtn}
              {video}
            </div>
            <div className="input-group">
              <input
                onChange={this.handleChange}
                type="text"
                className="form-control"
              />
              <div className="input-group-append">
                <span
                  onClick={this.handleSubmit}
                  className="input-group-text"
                  id="basic-addon2"
                >
                  @example.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
