import React, { Component } from "react";
import Peer from "simple-peer";
import * as PeerUtil from "./peerUtil";

export class VideoChat extends Component {
  constructor(props) {
    super(props);
    this.state = { src: "" };
  }

  componentDidMount() {
    this.props.setOtherVid(this.refs.video2);
    if (!this.props.incoming) {
      this.startVideo();
    } else {
      this.displayVideo();
    }

    this.setUpCallSocket();
  }

  setUpCallSocket = () => {
    this.props.socket.on("reject call", () => {
      
      this.close();
    });
  };

  callUser = () => {
    this.props.setOnCall(true);
    this.myPeer = PeerUtil.createPeer(
      this.props.otherId,
      true,
      this.stream,
      this.refs.video2,
      this.props.setPeer,
      this.props.id,
      this.props.socket,
      this.props.username
    );

    this.props.setPeer(this.props.otherId, this.myPeer);
  };

  displayVideo = () => {
    this.refs.video.srcObject = this.props.stream;
    this.refs.video.play();
  };

  startVideo = () => {
    PeerUtil.getUserMedia().then(stream => {
      this.stream = stream;
      this.refs.video.srcObject = this.stream;
      this.refs.video.play();
      this.callUser();
    });
  };

  close = () => {
    if (this.props.incoming) {
      let interval = setInterval(() => {
        let peer = this.props.getPeer();
        if (peer) {
          peer.destroy();

          clearInterval(interval);
        }
      });
      this.props.setPeer(this.props.otherVidId, undefined);
      // this.props.socket.emit('reject call',{id: this.props.id})
      this.props.stream.getTracks()[0].stop();
      this.props.stream.getTracks()[1].stop();
    } else {
      if (this.myPeer) {
        this.myPeer.destroy();
      }
      this.stream.getTracks()[0].stop();
      this.stream.getTracks()[1].stop();
      this.props.setPeer(this.props.otherId, undefined);
      // this.props.socket.emit('reject call',{myId: true,  id: this.props.otherId})
    }
    this.props.socket.off("reject call");
    this.props.turnOffVideo();
    this.props.setOnCall(false);
  };

  render() {
    return (
      <div className="video-container">
        <button className="video-close-btn btn btn-outline-danger" onClick={this.close}>Hang Up</button>
        <video muted="muted" className="inner-video" ref="video"></video>
        <video className="outer-video" ref="video2"></video>
      </div>
    );
  }
}

export default VideoChat;
