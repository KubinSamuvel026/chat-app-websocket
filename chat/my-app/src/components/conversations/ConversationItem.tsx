import React, { useMemo } from "react";
import type { Conversation } from "../../store/types";
import { useChat } from "../../store/ChatContext";
import { formatTime, truncate } from "../../utils/format";
import StatusBadge from "../chat/StatusBadge";

const ConversationItem: React.FC<{ conversation: Conversation }> = ({ conversation }) => {
  const { state, actions } = useChat();

  const lastMessage = conversation.lastMessageId ? state.messages[conversation.lastMessageId] : undefined;
  const primaryUserId = conversation.isGroup ? undefined : conversation.participants.find(id => id !== state.me.id);
  const primaryUser = primaryUserId ? state.users[primaryUserId] : undefined;

  const title = conversation.isGroup ? conversation.title : (primaryUser?.name ?? conversation.title);

  const subtitle = useMemo(() => {
    if (!lastMessage) return "No messages yet";
    const sender = state.users[lastMessage.senderId]?.name ?? "Unknown";
    const prefix = conversation.isGroup && lastMessage.senderId !== state.me.id ? `${sender}: ` : "";
    return truncate(prefix + (lastMessage.text ?? (lastMessage.attachments?.[0]?.name ?? "Attachment")));
  }, [lastMessage, conversation.isGroup, state.users, state.me.id]);

  const isActive = state.activeConversationId === conversation.id;

  return (
    <button
      onClick={() => { actions.setActiveConversation(conversation.id); 
        actions.loadMessages(conversation.id);
      }}
      style={{
        width: "100%", 
        textAlign: "left", 
        display: "grid",
        gridTemplateColumns: "56px 1fr 60px", 
        gap: 12, 
        padding: 12,
        background: isActive ? "var(--hover)" : "transparent", 
        border: "none", 
        borderBottom: "1px solid var(--divider)",
        cursor: "pointer"
      }}
    >
      <div style={{ position: "relative" }}>
        <img
          src={primaryUser?.avatarUrl || 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=2d3a40&color=fff`}
          alt={title}
          style={{ width: 44, height: 44, borderRadius: "50%" }}
        />
        {!conversation.isGroup && primaryUser && (
          <StatusBadge status={primaryUser.status} />
        )}
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </strong>
          {conversation.isGroup && (
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Group</span>
          )}
        </div>
        <span style={{ 
          color: "var(--text-muted)", 
          whiteSpace: "nowrap", 
          overflow: "hidden", 
          textOverflow: "ellipsis" 
        }}>
          {subtitle}
        </span>
        {!!(conversation.typingUserIds?.length) && (
          <span style={{ color: "var(--accent)", fontSize: 12 }}>typing…</span>
        )}
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
          {lastMessage ? formatTime(lastMessage.timestamp) : ""}
        </span>
        {conversation.muted && (
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>🔕</span>
        )}
      </div>
    </button>
  );
};

export default ConversationItem;