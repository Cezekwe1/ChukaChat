import Peer from 'simple-peer'
export const createPeer = (userId, initiator, myStream, video,setPeer,myId,socket,username="friend") => {
  const peer = new Peer({
    initiator,
    stream: myStream,
    trickle: false
  });

  peer.on("signal", data => {
    

    socket.emit("signal", { userId: myId, info: data, id: userId, username});
  });

  peer.on("stream", stream => {

    video.srcObject = stream;
    video.play();
  });

  peer.on("close", () => {
    
    if (peer){
        peer.destroy()
    }
    socket.emit('leave video channel',{id: userId})
    setPeer(userId,undefined)
  });
  return peer;
};

export const getUserMedia = () => navigator.mediaDevices.getUserMedia({video: true, audio: false})