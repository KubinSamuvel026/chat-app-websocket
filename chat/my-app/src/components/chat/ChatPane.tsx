import React, { useEffect, useMemo, useState } from "react";
import { useChatSocket } from "../../components/useChatSocket";
import { useChat } from "../../store/ChatContext";
import MessageBubble from "./MessageBubble";


const MessageList = () => {
  const { state, actions } = useChat();

  const conv = state.activeConversationId
    ? state.conversations[state.activeConversationId]
    : undefined;

  const messages = useMemo(() => {
    if (!conv) return [];
    return Object.values(state.messages)
      .filter(m => m.conversationId === conv.id)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [state.messages, conv?.id]
  );

  // Placeholder; render elsewhere. Return null to avoid TS/JSX parse errors.
  return null;
};

const ChatPane: React.FC = () => {
  const { state, actions } = useChat();
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get active conversation
  const activeConversation = state.activeConversationId ? state.conversations[state.activeConversationId] : null;
  const conversationMessages = activeConversation
    ? Object.values(state.messages).filter(m => m.conversationId === activeConversation.id)
    : [];

  const { sendMessage } = useChatSocket(activeConversation?.id ?? null, (msg: any) => {
    actions.receiveMessageMock(msg);
  });

  // Scroll to bottom of messages when they change
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages]);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      conversationId: activeConversation!.id,
      createdAt: new Date().toISOString(),
    };

    actions.addMessage(newMessage);

    // send over websocket
    sendMessage?.({
      conversation_id: newMessage.conversationId,
      sender_id: "me",
      text: newMessage.text,
    });

    setMessageText("");
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: Date.now().toString(),
        text: "This is a response from the bot.",
        sender: "bot",
        conversationId: activeConversation!.id,
        createdAt: new Date().toISOString(),
      };
      actions.addMessage(botMessage);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="chat-pane">
      <div className="messages">
        {conversationMessages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <div className="loading">Loading...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-area">
        <textarea
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={handleSend} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPane;
