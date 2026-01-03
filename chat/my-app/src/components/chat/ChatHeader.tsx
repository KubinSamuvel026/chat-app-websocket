import React from "react";
import { useChat } from "../../store/ChatContext";
import StatusBadge from "./StatusBadge";

const ChatHeader: React.FC = () => {
  const { state } = useChat();
  
  const conv = state.activeConversationId ? state.conversations[state.activeConversationId] : undefined;
  if (!conv) return null;

  const isGroup = conv.isGroup;
  const primaryUserId = !isGroup ? conv.participants.find(id => id !== state.me.id) : undefined;
  const primaryUser = primaryUserId ? state.users[primaryUserId] : undefined;

  const title = !isGroup ? (primaryUser?.name ?? conv.title) : conv.title;
  const subtitle = isGroup
    ? `${conv.participants.length} participants`
    : primaryUser?.status;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 16px", borderBottom: "1px solid var(--divider)" }}>
      <img
        src={primaryUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=2d3a40&color=fff`}
        alt={title}
        style={{ width: 36, height: 36, borderRadius: "50%" }}
      />
      
      <div style={{ display: "flex", flexDirection: "column" }}>
        <strong>{title}</strong>
        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{subtitle}</span>
      </div>
      {!isGroup && primaryUser && (
        <StatusBadge status={primaryUser.status} size={10} style={{ marginLeft: "auto" }} />
      )}
      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        <button title="Search" style={{ background: "transparent", border: "none", color: "var(--text)", cursor: "pointer" }}>🔍</button>
        <button title="Menu" style={{ background: "transparent", border: "none", color: "var(--text)", cursor: "pointer" }}>⋮</button>
      </div>
    </div>
  );
};

export default ChatHeader;
