"use client";
import { FormEventHandler, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
import Microphone from "./microphone";
import { useSocket } from "@/hooks/use-socket-store";
import Suggestions from "./suggestions";
import { ChatInputProps } from "@/lib/types";

const ChatInput = ({ messages }: ChatInputProps) => {
  const { socket } = useSocket();
  const [message, setMessage] = useState("");

  const handleTranscription = async (transcription: string) => {
    setMessage(transcription);
    await submit(transcription);
  };

  const submit = async (message: string) => {
    if (!socket) return;
    if (message.trim() === "") return;
    socket.send(JSON.stringify({ event: "prompt", prompt: message }));
    setMessage("");
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await submit(message);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 p-4">
      {!messages && (
        <div className="max-w-3xl mx-auto">
          <Suggestions handleClick={submit} />
        </div>
      )}
      <form
        className="flex items-center mt-3 w-full max-w-3xl mx-auto rounded-lg bg-neutral-900 p-2"
        onSubmit={handleSubmit}
      >
        <Microphone onTranscription={handleTranscription} />
        <Input
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
