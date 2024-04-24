"use client";
import { FormEvent, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ArrowUp, Mic } from "lucide-react";
import { useSocket } from "@/hooks/use-socket-store";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { socket } = useSocket();

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!socket) return;
    if (message.trim() !== "") return;
    socket.send(JSON.stringify({ event: "prompt", prompt: message }));
    setMessage("");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 p-4">
      <form
        className="flex items-center w-full max-w-3xl mx-auto rounded-lg bg-neutral-900 p-2"
        onSubmit={handleFormSubmit}
      >
        <div className="px-2 cursor-pointer">
          <Mic className="text-white h-5 w-5" />
        </div>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-gray-500"
          placeholder="Type your message here"
        />
        <Button disabled={!message} className="px-2">
          <ArrowUp className="text-white h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
