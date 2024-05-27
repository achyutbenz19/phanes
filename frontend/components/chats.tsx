import { ChatProps } from "@/lib/types";

const Chats = ({ messages }: ChatProps) => {
  return (
    <div className="m-3 max-h-[calc(100vh-150px)] w-full flex flex-col gap-2 overflow-y-scroll">
      {messages.map((message: any, index: number) => (
        <div key={index}>{message.display && message.display}</div>
      ))}
    </div>
  );
};

export default Chats;
