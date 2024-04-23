"use server";
import ChatInput from "@/components/chat-input";
import { chatSubmit } from "@/lib/actions/chat-submit";
import React from "react";

const Main = () => {
  return (
    <div>
      <ChatInput handleSubmit={chatSubmit} />
    </div>
  );
};

export default Main;
