import React from "react";
import ChatHeader from "../chat/ChatHeader";
import MessageList from "../chat/MessageList";
import InputBar from "../input/InputBar";
// import { ChatProvider } from "../../store/ChatContext";

const ChatPane: React.FC = () => {
  return (
    <section className="chat" style={{ display: "grid", gridTemplateRows: "60px 1fr auto" }}>
      <ChatHeader />
      <MessageList />
      <InputBar />
    </section>
    
  );
};

export default ChatPane;
