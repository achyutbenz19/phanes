"use client";
import BotMessage from "@/components/bot-message";
import ChatInput from "@/components/chat-input";
import Chats from "@/components/chats";
import Header from "@/components/header";
import { useSocket } from "@/hooks/use-socket-store";
import { processLogs } from "@/lib/process-logs";
import { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

export default function Home() {
  const { socket, setSocket } = useSocket();
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    if (!socket) {
      const rws = new ReconnectingWebSocket(
        "ws://localhost:8000/ws?client_id=client-id",
      );
      setSocket(rws);
    }
  }, [socket, setSocket]);

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
    <main>
      <Header />
      <Chats messages={messages} />
      <ChatInput />
    </main>
  );
}
