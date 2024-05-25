"use client";
import useConnectionSocket from "@/hooks/use-connection-socket";
import { useSocket } from "@/providers/socket-provider";
import React, { useEffect, useState } from "react";

type ThoughtData = {
  thought: string;
};

const Chats: React.FC = () => {
  useConnectionSocket();
  const { socket } = useSocket();
  const [thoughts, setThoughts] = useState<string[]>([]);

  useEffect(() => {
    const handleThought = (data: ThoughtData) => {
      console.log("Received thought:", data);
      setThoughts((prevThoughts) => [...prevThoughts, data.thought]);
    };

    if (socket) {
      socket.on("thought", handleThought);

      return () => {
        socket.off("thought", handleThought);
      };
    }
  }, [socket]);

  const emitDummyData = async () => {
    try {
      const response = await fetch("/api/socket/connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log("Dummy data emitted:", result);
    } catch (error) {
      console.error("Error emitting dummy data:", error);
    }
  };

  return (
    <div>
      <h1>Chats</h1>
      <button onClick={emitDummyData}>Emit Dummy Thought</button>
      <ul>
        {thoughts.map((thought, index) => (
          <li key={index}>{thought}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chats;
