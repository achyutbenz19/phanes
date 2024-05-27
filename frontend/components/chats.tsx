"use client";
import { useSocket } from "@/hooks/use-socket-store";
import { processLogs } from "@/lib/process-logs";
import { useEffect, useRef, useState } from "react";
import BotMessage from "./bot-message";

export const sendSocketMessage = (socket: any, message: any) => {
  socket.send(JSON.stringify(message));
};

const Chats = () => {
  const [messages, setMessages] = useState<any>([]);
  const { socket } = useSocket();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: any) => {
      const id = event.target.getAttribute("special-id");

      if (!socket) {
        console.log("No socket to send handleClick");
        return;
      }

      sendSocketMessage(socket, {
        event: "userAction",
        id: id,
        element: "button",
        value: undefined,
      });
    };

    const handleChange = (event: any) => {
      const id = event.target.getAttribute("special-id");

      if (!socket) {
        console.log("No socket to send handleChange");
        return;
      }

      sendSocketMessage(socket, {
        event: "userAction",
        id: id,
        element: "input",
        value: event.currentTarget.value,
      });
    };

    if (!containerRef.current) {
      return;
    }

    const clickables =
      containerRef.current.querySelectorAll("button[special-id]");
    const inputtables =
      containerRef.current.querySelectorAll("input[special-id]");

    clickables.forEach((clickable: Element) => {
      clickable.addEventListener("click", handleClick);
    });

    inputtables.forEach((inputtable: Element) => {
      inputtable.addEventListener("change", handleChange);
    });

    return () => {
      clickables.forEach((clickable: Element) => {
        clickable.removeEventListener("click", handleClick);
      });

      inputtables.forEach((inputtable: Element) => {
        inputtable.removeEventListener("change", handleChange);
      });
    };
  }, [messages, socket]);

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
                ref={containerRef}
                className="flex items-center my-3 justify-center w-fit text-black mx-auto"
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
