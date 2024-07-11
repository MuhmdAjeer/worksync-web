import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Peer, { SimplePeer } from "simple-peer";

interface IVideo {
  peer: Peer.Instance;
}

interface IPeerRef {
  peerID: string;
  peer: Peer.Instance;
}

const Video = (props: IVideo) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      console.log({ ref });
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
  }, []);

  return <video className="h-[40%] w-[50%] rounded-lg" playsInline autoPlay ref={ref} />;
};

// const videoConstraints = {
//   height: window.innerHeight / 2,
//   width: window.innerWidth / 2,
// };

const Room = () => {
  const [peers, setPeers] = useState<Peer.Instance[]>([]);
  const socketRef = useRef<Socket>();
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<IPeerRef[]>([]);
  const roomID = "1234";

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("in media device");
        socketRef.current?.emit("connection");

        if (!userVideo.current || !socketRef.current) return;
        console.log("in media device not reutrned");
        userVideo.current.srcObject = stream;

        try {
          socketRef.current.emit("join room", roomID);
        } catch (error) {
          console.log({ error });
        }
        socketRef.current.on("all users", (users) => {
          console.log("all users");

          const peers: Peer.Instance[] = [];
          users.forEach((userID: string) => {
            if (!socketRef.current?.id) return;
            const peer = createPeer(userID, socketRef.current?.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          console.log("user joined");

          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item?.peer.signal(payload.signal);
        });
      })
      .catch((err) => console.log(err));
  }, []);

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

  function addPeer(incomingSignal: any, callerID: any, stream: MediaStream) {
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
    <div className="p-5 flex h-screen w-[90%] m-auto flex-wrap">
      <video
        className="h-[40%] w-[50%] rounded-lg"
        muted
        ref={userVideo}
        autoPlay
        playsInline
      />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
    </div>
  );
};
// const Container = styled.div`
//   padding: 20px;
//   display: flex;
//   height: 100vh;
//   width: 90%;
//   margin: auto;
//   flex-wrap: wrap;
// `;
export default Room;
