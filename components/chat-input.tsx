"use client";
import { FormEventHandler, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";
import Microphone from "./microphone";

const ChatInput = () => {
  const [message, setMessage] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setMessage("");
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
    <div className="fixed inset-x-0 bottom-0 p-4">
      <form
        className="flex items-center w-full max-w-3xl mx-auto rounded-lg bg-neutral-900 p-2"
        onSubmit={handleSubmit}
      >
        <Microphone />
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
