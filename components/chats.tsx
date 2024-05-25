"use client";
import useConnectionSocket from "@/hooks/use-connection-socket";
import { useSocket } from "@/providers/socket-provider";
import React, { useEffect, useState } from "react";

const Chats: React.FC = () => {
  useConnectionSocket();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const handleThought = (data: any) => {
      setMessages((prevMessages) => [...prevMessages, data.thought]);
    };

    if (socket && isConnected) {
      socket.on("thought", handleThought);

      return () => {
        socket.off("thought", handleThought);
      };
    }
  }, [socket, isConnected]);

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chats;
