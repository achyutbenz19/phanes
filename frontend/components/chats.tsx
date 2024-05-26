"use client";
import { useSocket } from "@/hooks/use-socket-store";
import { processLogs } from "@/lib/process-logs";
import { useState } from "react";

const Chats = () => {
  const [messages, setMessages] = useState<any>([]);
  const { socket } = useSocket();

  console.log(messages);

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
              <div
                className="border"
                dangerouslySetInnerHTML={{ __html: html }}
              />
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
