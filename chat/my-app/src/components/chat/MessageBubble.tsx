import React from "react";
import type { Message } from "../../store/types";
import { formatTime } from "../../utils/format";
import ReadReceipt from "./ReadReceipt";

const MessageBubble: React.FC<{ message: Message; isMine: boolean }> = ({ message, isMine }) => {
  return (
    <div style={{
      display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", margin: "6px 8px"
    }}>
      <div style={{
        maxWidth: 560,
        background: isMine ? "var(--bubble-sent)" : "var(--bubble-recv)",
        color: "var(--text)",
        borderRadius: 12,
        padding: "8px 10px 4px",
        boxShadow: `0 1px 2px var(--bubble-shadow)`,
        position: "relative",
        animation: "fadeIn .2s ease-out",
      }}>
        {message.text && <div style={{ lineHeight: 1.35 }}>{message.text}</div>}
        {message.attachments?.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginTop: 6 }}>
            {message.attachments.map(att => (
              <div key={att.id} style={{
                background: "var(--panel-alt)", borderRadius: 8, overflow: "hidden", border: "1px solid var(--divider)"
              }}>
                {att.type === "image" || att.thumbnailUrl ? (
                  <img src={att.thumbnailUrl || att.url} alt={att.name || att.type}
                    style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ padding: 8 }}>
                    <strong style={{ fontSize: 13 }}>{att.name || att.type.toUpperCase()}</strong>
                    {!!att.size && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{(att.size / 1024).toFixed(1)} KB</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{formatTime(message.timestamp)}</span>
          {isMine && <ReadReceipt state={message.readState} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
