import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import Peer, { SimplePeer } from "simple-peer";
import { useSession } from "next-auth/react";

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
      if (ref.current) {
        ref.current.srcObject = stream;
      }
    });

    return () => {
      props.peer.destroy();
    };
  }, [props.peer]);

  return (
    <video
      className="h-[40%] w-[50%] rounded-lg"
      playsInline
      autoPlay
      ref={ref}
    />
  );
};

const ProjectCallRoom = ({ projectId }: { projectId: string }) => {
  const [peers, setPeers] = useState<Peer.Instance[]>([]);
  const socketRef = useRef<Socket>();
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<IPeerRef[]>([]);
  const session = useSession();

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

        if (!userVideo.current || !socketRef.current) return;
        console.log("in media device not reutrned");
        userVideo.current.srcObject = stream;

        try {
          socketRef.current.emit("join room", { projectId });
        } catch (error) {
          console.log({ error });
        }
        socketRef.current.on("all users", (users) => {
          console.log("all users");

          const peers: Peer.Instance[] = [];
          users.forEach((userID: string) => {
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
              setPeers((peers) => peers.filter((x, i) => i !== peerIndex));
            });
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
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

            setPeers([...peersRef.current.map((p) => p.peer)]);
          }
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
          setPeers([]);
        });
      })
      .catch((err) => console.log(err));

    return () => {
      socketRef.current?.emit("room:leave");
    };
  }, [projectId]);

  useEffect(() => {
    console.log({ peers: peers.length, ref: peersRef.current.length });
  }, [peers]);

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

export default ProjectCallRoom;
