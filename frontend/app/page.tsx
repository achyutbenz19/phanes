import ChatInput from "@/components/chat-input";
import Chats from "@/components/chats";
import Init from "@/components/init";

const Main = () => {
  return (
    <div>
      <Init />
      <Chats />
      <ChatInput />
    </div>
  );
};

export default Main;
