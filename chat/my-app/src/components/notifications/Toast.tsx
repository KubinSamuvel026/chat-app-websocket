import React, { useEffect, useState } from "react";
import { useChat } from "../../store/ChatContext";

const Toast: React.FC = () => {
  const { state } = useChat();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (state.notifications.length > 0) {
      setVisible(true);
      const audio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA="); // silent placeholder
      audio.play().catch(() => {});
      const t = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(t);
    }
  }, [state.notifications.length]);

  if (!state.notifications.length || !visible) return null;
  const current = state.notifications[0];

  return (
    <div style={{
      position: "fixed", bottom: 16, left: 16, background: "var(--panel-alt)",
      border: "1px solid var(--divider)", borderRadius: 12, padding: "8px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
    }}>
      <strong style={{ marginRight: 8 }}>Notification</strong>
      <span style={{ color: "var(--text-muted)" }}>{current.text}</span>
    </div>
  );
};

export default Toast;
