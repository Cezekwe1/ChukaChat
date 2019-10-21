import React, { Component } from "react";
import { Route, Redirect, Switch, Link, HashRouter } from "react-router-dom";
import Home from "../home/homeContainer";
import LoginSignUpContainer from "../auth/loginSignupContainer";
import NonPrivateRoute from "../../utilities/nonPrivateRoute";
import PrivateRoute from "../../utilities/privateRoute";
import ProfileContainer from "../profile/profileContainer";
import ChatContainer from "../chat/chatContainer";
import Nav from "../nav/navBarContainer";
import io from "socket.io-client";
import * as PeerUtil from "../chat/peerUtil";
import Video from "../chat/videoChat";
import Ringer from "./ringer";
var socket = io();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openRinger: false,
      onCall: false,
      answered: null,
      caller: null,
      incoming: false,
      otherVid: null,
      calling: false
    };
    this.peers = {};
    this.stream = null;
    this.setUpSocket();
  }
  componentWillMount() {
    this.props.checkAuthState();
    this.props.checkCurrentConvo();
  }
  getMyPeer = () => this.myPeer;
  showNavBar() {
    var nav;

    if (this.props.isAuthenticated) {
      nav = <Nav socket={socket} history={this.props.history} />;
    } else {
      nav = "";
    }
    return nav;
  }

  setPeer = (id, val) => {
    this.peers[id] = val;
  };

  setOtherVid = ref => {
    this.setState({
      otherVid: ref
    });
  };

  getRinger = () => {
    var ringer;
    if (this.state.openRinger) {
      ringer = (
        <Ringer answerCall={this.answerCall} caller={this.state.caller} />
      );
    } else {
      ringer = "";
    }
    return ringer;
  };

  setUpSocket = () => {
    socket.on("accept friend request", data => {
      this.props.getMe();
    });
    socket.on("remove friend", data => {
      this.props.getMe();
    });
    socket.on("made conversation",data =>{
      this.props.getMe();
    })
    socket.on("signal", data => {
      let peer = this.peers[data.userId];
      if (peer) {
        peer.signal(data.info);
        return;
      }
      if (this.state.onCall) {
        socket.emit("reject call", { id: data.userId });
        return;
      }

      this.setState({
        onCall: true
      });

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
              this.otherVidId = data.userId;
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
              onCall: false,
              openRinger: false
            });
            socket.emit("reject call", { id: data.userId });
          });
      }
    });
  };

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
    return video;
  };

  answerCall = val => {
    this.setState({
      answered: val,
      openRinger: false
    });
  };

  turnOffVideo = () => {
    this.setState({
      incoming: false,
      calling: false
    });
  };

  setOnCall = val => {
    this.setState({
      onCall: val
    });
  };

  joinVideoChannel = () => {
    if (this.props.isAuthenticated) {
      socket.emit("join video channel", { id: this.props.me._id });
      socket.emit("join notification channel", { id: this.props.me._id });
    }else{
      socket.emit("leave all channels")
    }
  };

  getOnCall = () => {
    return this.state.onCall;
  };

  render() {
    var nav = this.showNavBar();
    var ringer = this.getRinger();
    var video = this.getVideo();
    this.joinVideoChannel();
    return (
      <div className="position-relative">
        {nav}
        {ringer}
        {video}
        <Switch>
          <NonPrivateRoute
            exact
            path="/"
            component={Home}
            isAuthenticated={this.props.isAuthenticated}
          />
          <NonPrivateRoute
            path="/login"
            component={LoginSignUpContainer}
            isAuthenticated={this.props.isAuthenticated}
          />
          <NonPrivateRoute
            path="/signup"
            component={LoginSignUpContainer}
            isAuthenticated={this.props.isAuthenticated}
          />
          <PrivateRoute
            path="/chat"
            component={ChatContainer}
            isAuthenticated={this.props.isAuthenticated}
            socket={socket}
            setOnCall={this.setOnCall}
            setPeer={this.setPeer}
            otherVidId={this.otherVidId}
            setOtherVid={this.setOtherVid}
            getOnCall={this.getOnCall}
            onCall={this.state.onCall}
          />
          <PrivateRoute
            path="/users/:id"
            component={ProfileContainer}
            isAuthenticated={this.props.isAuthenticated}
            socket={socket}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
