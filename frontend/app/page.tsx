"use client";
import ChatInput from "@/components/chat-input";
import Chats from "@/components/chats";
import Header from "@/components/header";
import { useSocket } from "@/hooks/use-socket-store";
import { useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

export default function Home() {
  const { socket, setSocket } = useSocket();

  useEffect(() => {
    if (!socket) {
      const rws = new ReconnectingWebSocket(
        "ws://localhost:8000/ws?client_id=client-id"
      );
      setSocket(rws);
    }
  }, [socket, setSocket]);

  return (
    <main>
      <Header />
      <Chats />
      <ChatInput />
    </main>
  );
}
