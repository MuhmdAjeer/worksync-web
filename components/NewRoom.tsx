import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Peer from "simple-peer";

// const Container = styled.div`
//   height: 100vh;
//   width: 20%;
// `;

// const Controls = styled.div`
//   margin: 3px;
//   padding: 5px;
//   height: 27px;
//   width: 98%;
//   background-color: rgba(255, 226, 104, 0.1);
//   margin-top: -8.5vh;
//   filter: brightness(1);
//   z-index: 1;
//   border-radius: 6px;
// `;

// const ControlSmall = styled.div`
//   margin: 3px;
//   padding: 5px;
//   height: 16px;
//   width: 98%;
//   margin-top: -6vh;
//   filter: brightness(1);
//   z-index: 1;
//   border-radius: 6px;
//   display: flex;
//   justify-content: center;
// `;

// const ImgComponent = styled.img`
//   cursor: pointer;
//   height: 25px;
// `;

// const ImgComponentSmall = styled.img`
//   height: 15px;
//   text-align: left;
//   opacity: 0.5;
// `;

// const StyledVideo = styled.video`
//   width: 100%;
//   position: static;
//   border-radius: 10px;
//   overflow: hidden;
//   margin: 1px;
//   border: 5px solid gray;
// `;

interface IVideo {
  peer: Peer.Instance;
}

const Video = (props: IVideo) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
  }, []);

  return <video playsInline autoPlay ref={ref} />;
};

interface IPeer {
  peerID: string;
  peer: Peer.Instance;
}

const NewRoom = ({ room }: { room: string }) => {
  const [peers, setPeers] = useState<IPeer[]>([]);
  const [audioFlag, setAudioFlag] = useState(true);
  const [videoFlag, setVideoFlag] = useState(true);
  const [userUpdate, setUserUpdate] = useState([]);
  const socketRef = useRef<Socket>();
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<IPeer[]>([]);
  const roomID = "321321";
  const videoConstraints = {
    minAspectRatio: 1.333,
    minFrameRate: 60,
    height: window.innerHeight / 1.8,
    width: window.innerWidth / 2,
  };
  useEffect(() => {
    socketRef.current = io("localhost:8000");
    createStream();
  }, []);

  function createStream() {
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        if (!userVideo.current || !socketRef.current) return;
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomID);
        socketRef.current.on("all users", (users) => {
          console.log(users);
          const peers: IPeer[] = [];
          if (!socketRef.current?.id) return;
          users.forEach((userID: string) => {
            const peer = createPeer(userID, socketRef?.current?.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push({
              peerID: userID,
              peer,
            });
          });
          setPeers(peers);
        });
        socketRef.current.on("user joined", (payload) => {
          console.log("==", payload);
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });
          const peerObj = {
            peer,
            peerID: payload.callerID,
          };
          setPeers((users) => [...users, peerObj]);
        });

        socketRef.current.on("user left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peers);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          if (!item) return;
          item.peer.signal(payload.signal);
        });

        socketRef.current.on("change", (payload) => {
          setUserUpdate(payload);
        });
      });
  }

  function createPeer(
    userToSignal: string,
    callerID: string,
    stream: MediaStream
  ) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      if (!socketRef.current) return;
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(
    incomingSignal: string,
    callerID: string,
    stream: MediaStream
  ) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      if (!socketRef.current) return;
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div>
      <video muted ref={userVideo} autoPlay playsInline />
      <div>
        <img
          //   src={videoFlag ? webcam : webcamoff}
          onClick={() => {
            if (userVideo.current?.srcObject) {
              // @ts-ignore
              userVideo.current.srcObject.getTracks().forEach(function (track) {
                if (track.kind === "video") {
                  if (track.enabled) {
                    socketRef.current?.emit("change", [
                      ...userUpdate,
                      {
                        id: socketRef.current.id,
                        videoFlag: false,
                        audioFlag,
                      },
                    ]);
                    track.enabled = false;
                    setVideoFlag(false);
                  } else {
                    socketRef.current?.emit("change", [
                      ...userUpdate,
                      {
                        id: socketRef.current.id,
                        videoFlag: true,
                        audioFlag,
                      },
                    ]);
                    track.enabled = true;
                    setVideoFlag(true);
                  }
                }
              });
            }
          }}
        />
        &nbsp;&nbsp;&nbsp;
        <img
          //   src={audioFlag ? micunmute : micmute}
          onClick={() => {
            if (userVideo.current?.srcObject) {
              // @ts-ignore
              userVideo.current.srcObject.getTracks().forEach(function (track) {
                if (track.kind === "audio") {
                  if (track.enabled) {
                    socketRef.current?.emit("change", [
                      ...userUpdate,
                      {
                        id: socketRef.current.id,
                        videoFlag,
                        audioFlag: false,
                      },
                    ]);
                    track.enabled = false;
                    setAudioFlag(false);
                  } else {
                    socketRef.current?.emit("change", [
                      ...userUpdate,
                      {
                        id: socketRef.current.id,
                        videoFlag,
                        audioFlag: true,
                      },
                    ]);
                    track.enabled = true;
                    setAudioFlag(true);
                  }
                }
              });
            }
          }}
        />
      </div>
      {peers.map((peer, index) => {
        let audioFlagTemp = true;
        let videoFlagTemp = true;
        if (userUpdate) {
          userUpdate.forEach((entry) => {
            // @ts-ignore
            if (peer && peer.peerID && peer.peerID === entry.id) {
              // @ts-ignore
              audioFlagTemp = entry.audioFlag;
              // @ts-ignore
              videoFlagTemp = entry.videoFlag;
            }
          });
        }
        return (
          <div key={peer.peerID}>
            <Video peer={peer.peer} />
            <div>
              {/* <img src={videoFlagTemp ? webcam : webcamoff} /> */}
              &nbsp;&nbsp;&nbsp;
              {/* <img src={audioFlagTemp ? micunmute : micmute} /> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewRoom;
