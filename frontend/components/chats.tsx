"use client";
import { useSocket } from "@/hooks/use-socket-store";
import { processLogs } from "@/lib/functions/process-logs";
import { useState } from "react";

const Chats = () => {
  const [messages, setMessages] = useState<any>([]);
  const { socket } = useSocket();

  if (socket) {
    socket.onmessage = function (event) {
      const { html, thought } = processLogs(event.data);
      setMessages((currentMessages: any) => [
        ...currentMessages,
        {
          display: thought ? (
            <div>{thought}</div>
          ) : html ? (
            <div>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
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
