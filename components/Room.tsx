import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Peer, { SimplePeer } from "simple-peer";

interface IVideo {
  user: IUser;
}

interface IPeerRef {
  peerID: string;
  peer: Peer.Instance;
}

interface IUser {
  peer: Peer.Instance;
  isVideoPlaying: boolean;
}

const Video = ({ user }: IVideo) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    user.peer.on("stream", (stream) => {
      console.log({ ref });
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
  }, []);

  return (
    <div>
      <video
        className="h-[40%] w-[50%] rounded-lg"
        playsInline
        autoPlay
        ref={ref}
      />
      {user.isVideoPlaying}
    </div>
  );
};

// const videoConstraints = {
//   height: window.innerHeight / 2,
//   width: window.innerWidth / 2,
// };

const Room = ({ projectId }: { projectId: string }) => {
  const [users, setUsers] = useState<IUser[]>([]);
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
        socketRef.current.on("all users", (joinedUsers) => {
          console.log("all users");

          const users: IUser[] = [];
          joinedUsers.forEach((userID: string) => {
            if (!socketRef.current?.id) return;
            const peer = createPeer(userID, socketRef.current?.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            users.push({ isVideoPlaying: true, peer });
          });
          setUsers(users);
        });

        socketRef.current.on("user joined", (payload) => {
          console.log("user joined");

          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setUsers((prev) => [...prev, { isVideoPlaying: true, peer }]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item?.peer.signal(payload.signal);
        });

        window.onbeforeunload = () => handleLeave();

        return () => {
          handleLeave();
        };
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

  const handleLeave = () => {
    socketRef.current?.emit("room:leave");
  };

  return (
    <div className="p-5 flex h-screen w-[90%] m-auto flex-wrap">
      <video
        className="h-[40%] w-[50%] rounded-lg"
        muted
        ref={userVideo}
        autoPlay
        playsInline
      />
      {users.map((user, index) => {
        return <Video key={index} user={user} />;
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
