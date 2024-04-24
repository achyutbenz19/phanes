"use client";
import { useSocket } from "@/hooks/use-socket-store";
import { processLogs } from "@/lib/functions/process-logs";

const Chats = () => {
  const { socket } = useSocket();

  if (socket) {
    socket.onmessage = function (event) {
      console.log(event.data);
      const result = processLogs(event.data);
      console.log(result);
    };
  }

  return <div>Chats</div>;
};

export default Chats;
