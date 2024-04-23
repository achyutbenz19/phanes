"use server";
import ChatInput from "@/components/chat-input";
import Init from "@/components/init";
import { chatSubmit } from "@/lib/actions/chat-submit";
import React from "react";

const Main = () => {
  return (
    <div>
      <Init />
      <ChatInput handleSubmit={chatSubmit} />
    </div>
  );
};

export default Main;
