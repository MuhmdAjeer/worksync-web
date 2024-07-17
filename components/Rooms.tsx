import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { Socket, io } from "socket.io-client";
import { RemoteVideo } from "./Room"; // Assuming this component exists

const Rooms = ({ room }: { room: string }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<
    Record<string, SimplePeer.Instance>
  >({});
  const peers = useRef<Record<string, SimplePeer.Instance>>({});
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000", { autoConnect: true });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.current?.emit("join-room", room);

        socket.current?.on("connect", () => {
          console.log("Connected to signaling server");
        });

        socket.current?.on("signal", ({ peerId, signalData }) => {
          if (peers.current[peerId]) {
            peers.current[peerId].signal(signalData);
          }
        });

        socket.current?.on("joined-room", ({ peerId }) => {
          initializePeer(true, peerId);
        });

        socket.current?.on("peer-disconnected", (peerId) => {
          cleanupPeer(peerId);
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
        alert(
          "Could not access your camera and microphone. Please ensure they are connected and enabled."
        );
      });

    return () => {
      socket.current?.disconnect();
      cleanupPeers();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [room]);

  function initializePeer(isInitiator = false, peerId: string) {
    if (!localStreamRef.current) return;

    const peer = new SimplePeer({
      initiator: isInitiator,
      trickle: false,
      stream: localStreamRef.current,
    });

    peer.on("signal", (signalData) => {
      socket.current?.emit("signal", { peerId, signalData });
    });

    peer.on("stream", (stream) => {
      addRemoteStream(peer, peerId, stream);
    });

    peer.on("data", (data) => {
      console.log("Received message:", data.toString());
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    peers.current[peerId] = peer;
    setRemoteStreams((prev) => ({
      ...prev,
      [peerId]: peer,
    }));
  }

  function addRemoteStream(
    peer: SimplePeer.Instance,
    peerId: string,
    stream: MediaStream
  ) {
    setRemoteStreams((prev) => ({
      ...prev,
      [peerId]: peer,
    }));
  }

  function cleanupPeer(peerId: string) {
    if (peers.current[peerId]) {
      peers.current[peerId].destroy();
      delete peers.current[peerId];
      setRemoteStreams((prev) => {
        const updatedStreams = { ...prev };
        delete updatedStreams[peerId];
        return updatedStreams;
      });
    }
  }

  function cleanupPeers() {
    Object.keys(peers.current).forEach((peerId) => {
      peers.current[peerId].destroy();
    });
    peers.current = {};
    setRemoteStreams({});
  }

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted className="local-video" />
      {Object.values(remoteStreams).map((peer, index) => (
        <RemoteVideo key={index} peer={peer} />
      ))}
    </div>
  );
};

export default Rooms;
