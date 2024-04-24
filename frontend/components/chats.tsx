"use client";
import { useSocket } from "@/hooks/use-socket-store";

const Chats = () => {
  const { socket } = useSocket();

  if (socket) {
    socket.onmessage = function (event) {
      console.log(event.data);
    };
  }

  return <div>Chats</div>;
};

export default Chats;
