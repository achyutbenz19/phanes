"use client";
import ChatInput from "@/components/chat-input";
import Chats from "@/components/chats";
import Header from "@/components/header";
import { useSocket } from "@/hooks/use-socket-store";
import { useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

export default function Home() {
  const { setSocket } = useSocket();

  useEffect(() => {
    const rws = new ReconnectingWebSocket(
      "ws://localhost:8000/ws?client_id=client-id",
    );
    setSocket(rws);
  }, []);

  return (
    <main>
      <Header />
      <Chats />
      <ChatInput />
    </main>
  );
}
