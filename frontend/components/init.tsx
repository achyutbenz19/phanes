"use client";
import { useSocket } from "@/hooks/use-socket-store";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
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
    <div className="absolute top-0 right-0 mt-5 m-3">
      <span
        className={cn(
          "p-2 rounded-md border",
          socket ? "text-green-700 bg-green-300" : "text-red-800 bg-red-300",
        )}
      >
        {socket ? "Connected" : "Disonnected"}
      </span>
    </div>
  );
};

export default Init;
