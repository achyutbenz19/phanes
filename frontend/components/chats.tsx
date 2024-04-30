"use client";
import { useSocket } from "@/hooks/use-socket-store";
import { processLogs } from "@/lib/functions/process-logs";
import { useRef, useState } from "react";

const Chats = () => {
  const [messages, setMessages] = useState<any>([]);
  const containerRef = useRef<HTMLDivElement>(null)
  const { socket } = useSocket();

  const handleClick = () => {
    console.log(containerRef)
  }

  if (socket) {
    socket.onmessage = function (event) {
      const { html, thought } = processLogs(event.data);
      setMessages((currentMessages: any) => [
        ...currentMessages,
        {
          display: thought ? (
            <div>{thought}</div>
          ) : html ? (
            <div className="border" onClick={handleClick} ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />
          ) : null,
        },
      ]);
    };
  }

  return (
    <div>
      {messages.map((message: any, index: number) => (
        <div key={index}>{message.display}</div>
      ))}
    </div>
  );
};

export default Chats;
