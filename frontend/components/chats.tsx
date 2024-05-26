"use client";
import { useSocket } from "@/hooks/use-socket-store";
import { processLogs } from "@/lib/process-logs";
import { useState } from "react";
import BotMessage from "./bot-message";

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
            <BotMessage>{thought}</BotMessage>
          ) : html ? (
            <div className="flex justify-center">
              <div
                className="flex items-center my-3 justify-center w-fit text-black border mx-auto"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          ) : null,
        },
      ]);
    };
  }

  return (
    <div className="m-3 max-h-[calc(100vh-150px)] w-full flex flex-col gap-2 overflow-y-scroll">
      {messages.map((message: any, index: number) => (
        <div key={index}>{message.display && message.display}</div>
      ))}
    </div>
  );
};

export default Chats;
