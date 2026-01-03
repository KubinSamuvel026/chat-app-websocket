import React, { useEffect, useMemo, useRef } from "react";
import { useChat } from "../../store/ChatContext";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const MessageList: React.FC = () => {
  const { state, actions } = useChat();

  const conv = state.activeConversationId
    ? state.conversations[state.activeConversationId]
    : undefined;

  const messages = useMemo(() => {
    if (!conv) return [];
    return Object.values(state.messages)
      .filter(m => m.conversationId === conv.id)
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [state.messages, conv?.id]);

  const scrollerRef = useRef<HTMLDivElement>(null);

  // ✅ 1. Load messages on refresh / conversation change
  useEffect(() => {
    if (conv?.id) {
      actions.loadMessages(conv.id);
    }
  }, [conv?.id]);

  // ✅ 2. Auto-scroll when messages update
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  if (!conv) return null;

  return (
    <div
      ref={scrollerRef}
      className="scroll"
      style={{ padding: "16px 8px 24px" }}
    >
      {messages.map(m => (
        <MessageBubble
          key={m.id}
          message={m}
          isMine={m.senderId === state.me.id}
        />
      ))}

      {!!(conv.typingUserIds?.length) && (
        <TypingIndicator
          names={conv.typingUserIds.map(
            id => state.users[id]?.name ?? "Someone"
          )}
        />
      )}
    </div>
  );
};

export default MessageList;
