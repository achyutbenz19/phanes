"use client";
import { useSocket } from "@/hooks/use-socket-store";
import { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

const Init = () => {
  const { socket, setSocket } = useSocket();
  const index = false;

  useEffect(() => {
    const rws = new ReconnectingWebSocket(
      "ws://localhost:8000/ws?client_id=client-id",
    );
    setSocket(rws);
  }, [index]);

  return (
    <div className="absolute top-0 right-0 m-3">
      {socket ? "connected" : "not connected"}
    </div>
  );
};

export default Init;
