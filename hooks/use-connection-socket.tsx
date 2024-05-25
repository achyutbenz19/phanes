import { PartialSocketData } from "@/lib/types";
import { useSocket } from "@/providers/socket-provider";
import { useEffect } from "react";

const useConnectionSocket = () => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit("message", JSON.stringify({ event: "start" }));

      socket.on("thought", (data: PartialSocketData) => {
        console.log(data);
        console.log("Thought:", data.thought);
      });

      socket.on("ui", (data: PartialSocketData) => {
        console.log(data);
        console.log("Generated UI:", data.html);
      });

      socket.on("done", () => {
        console.log("Action completed");
      });
    }
    return () => {
      if (socket) {
        socket.off("thought");
        socket.off("ui");
        socket.off("done");
      }
    };
  }, [socket, isConnected]);
};

export default useConnectionSocket;
