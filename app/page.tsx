import ChatInput from "@/components/chat-input";
import Chats from "@/components/chats";
import Header from "@/components/header";

export default function Home() {
  return (
    <main>
      <Header />
      <Chats />
      <ChatInput />
    </main>
  );
}
