import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Peer, { SimplePeer } from "simple-peer";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

interface IVideo {
  user: IUser;
}

interface IPeerRef {
  peerID: string;
  peer: Peer.Instance;
}

interface IUser {
  peer: Peer.Instance;
  userId: string;
  isVideoPlaying: boolean;
}

const Video = ({ user }: IVideo) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    user.peer.on("stream", (stream) => {
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });
    return () => {
      user.peer.destroy();
    };
  }, [user.peer]);

  // useEffect(() => {
  //   if (user.isVideoPlaying && ref.current?.srcObject) {
  //     const stream = ref.current.srcObject as MediaStream;
  //     user.peer.addStream(stream);
  //   }
  // }, [user.isVideoPlaying, user.peer]);

  return (
    <div>
      {user.isVideoPlaying ? (
        <video className="rounded-lg" playsInline autoPlay ref={ref} />
      ) : (
        <h1>no video</h1>
      )}
    </div>
  );
};

const ProjectCallRoom = ({ projectId }: { projectId: string }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const socketRef = useRef<Socket>();
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<IPeerRef[]>([]);
  const session = useSession();
  const localStreamRef = useRef<MediaStream>();

  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      query: { token: session.data?.access_token },
      autoConnect: true,
    });
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("in media device");
        // socketRef.current?.emit("connection");
        localStreamRef.current = stream;
        if (!userVideo.current || !socketRef.current) return;
        console.log("in media device not reutrned");
        userVideo.current.srcObject = stream;

        try {
          socketRef.current.emit("join room", { projectId });
        } catch (error) {
          console.log({ error });
        }
        socketRef.current.on("all users", (joinedUsers) => {
          console.log("all users");

          const users: IUser[] = [];
          joinedUsers.forEach((userID: string) => {
            if (!socketRef.current?.id) return;
            const peer = createPeer(userID, socketRef.current?.id, stream);
            peer.on("close", () => {
              console.log("closing peer");

              const peerIndex = peersRef.current.findIndex(
                (x) => x.peerID === userID
              );
              // peersRef.current.splice(peerIndex, 1);
              peersRef.current = peersRef.current.filter(
                (x, i) => i !== peerIndex
              );
              setUsers((peers) => peers.filter((x, i) => i !== peerIndex));
            });
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            users.push({ peer, isVideoPlaying: true, userId: userID });
          });
          setUsers(users);
        });

        socketRef.current?.on("user:leave", (userId) => {
          const peerIndex = peersRef.current.findIndex(
            (x) => x.peerID === userId
          );
          console.log({ userId, peersRef: peersRef.current, peerIndex });
          if (peerIndex !== -1) {
            // peersRef.current[peerIndex].peer.destroy();
            // peersRef.current.splice(peerIndex, 1);
            peersRef.current = peersRef.current.filter(
              (x, i) => i !== peerIndex
            );
            console.log({ peersRef });

            // setUsers([...peersRef.current.map((p) => p.peer)]);
            const x = peersRef.current.map((x) => {
              return {
                peer: x.peer,
                isVideoPlaying: true,
                userId: x.peerID,
              };
            });
            setUsers(x);
          }
        });

        socketRef.current.on("user joined", (payload) => {
          console.log("user joined");

          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setUsers((prev) => [
            ...prev,
            { isVideoPlaying: true, peer, userId: payload.callerID },
          ]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item?.peer.signal(payload.signal);
        });

        socketRef.current.on("user:video:toggle", (userId) => {
          // setUsers((prev) => {
          //   return prev.map((x) => {
          //     if (x.userId === userId) {
          //       // Toggle the enabled state of the video track
          //       const videoTrack = x.peer.streams[0].getVideoTracks()[0];
          //       videoTrack.enabled = !videoTrack.enabled;
          //       return { ...x, isVideoPlaying: !x.isVideoPlaying };
          //     }
          //     return x;
          //   });
          // });
          const peer = peersRef.current.find((x) => x.peerID === userId);
          console.log({ foundedpeer: peer });
        });

        window.onbeforeunload = (ev) => {
          console.log("leaving");

          socketRef.current?.emit("room:leave");
        };

        socketRef.current?.on("disconnect", () => {
          // peersRef.current.forEach((peerRef) => {
          //   peerRef.peer.destroy();
          // });
          console.log("im leaging");
          peersRef.current = [];
          setUsers([]);
        });
      })
      .catch((err) => console.log(err));

    return () => {
      socketRef.current?.emit("room:leave");
    };
  }, [projectId]);

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

  const toggleVideo = () => {
    // if (localStreamRef.current) {
    //   localStreamRef.current.getVideoTracks().forEach((track) => {
    //     track.enabled = !track.enabled;
    //   });
    // }
    socketRef.current?.emit("video:toggle", {
      userId: socketRef.current.id,
      room: projectId,
    });
  };

  return (
    <div className="p-5 h-screen w-[90%] grid grid-cols-2 gap-2">
      <video
        className=" rounded-lg"
        muted
        ref={userVideo}
        autoPlay
        playsInline
      />

      {users.map((user, index) => {
        return <Video key={index} user={user} />;
      })}
      <Button onClick={toggleVideo}>disable</Button>
    </div>
  );
};

export default ProjectCallRoom;
