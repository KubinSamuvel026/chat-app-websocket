import React, { useMemo, useState } from "react";
import { useChat } from "../../store/ChatContext";
import EmojiPicker from "./EmojiPicker";
import AttachmentMenu from "./AttachmentMenu";
import MediaPreviewStrip from "./MediaPreviewStrip";
import type{ Attachment } from "../../store/types";

const InputBar: React.FC = () => {
  const { state, actions } = useChat();
  const convId = state.activeConversationId!;
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Allow sending only when there's text or attachments
  const canSend = useMemo(
    () => value.trim().length > 0 || attachments.length > 0,
    [value, attachments.length]
  );

  // ✅ onSend handler (moved sendMessage call here only)
  const onSend = () => {
    if (!canSend) return;

    // ✅ Added senderId to match Message type
    actions.sendMessage({
      senderId: state.activeConversationId ?? "me", // fallback if not defined
      conversationId: convId,
      text: value.trim() || undefined,
      attachments: attachments.length ? attachments : undefined,
    });

    // Reset input and UI
    setValue("");
    setAttachments([]);
    setShowEmoji(false);
    setShowAttach(false);
  };

  // Handle Enter key
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={{ borderTop: "1px solid var(--divider)", padding: 8, display: "grid", gap: 8 }}>
      {attachments.length > 0 && (
        <MediaPreviewStrip
          attachments={attachments}
          onRemove={(id) => setAttachments((a) => a.filter((x) => x.id !== id))}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          title="Attach"
          onClick={() => setShowAttach((s) => !s)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text)",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          📎
        </button>
        <button
          title="Emoji"
          onClick={() => setShowEmoji((s) => !s)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text)",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          😊
        </button>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 24,
            border: "none",
            background: "var(--panel-alt)",
            color: "var(--text)",
          }}
        />
        <button
          title="Send"
          onClick={onSend}
          disabled={!canSend}
          style={{
            background: canSend ? "var(--accent-strong)" : "var(--hover)",
            color: "#fff",
            border: "none",
            borderRadius: 24,
            padding: "8px 14px",
            cursor: canSend ? "pointer" : "not-allowed",
          }}
        >
          ➤
        </button>
      </div>

      {showEmoji && <EmojiPicker onSelect={(emoji) => setValue((v) => v + emoji)} />}
      {showAttach && <AttachmentMenu onAdd={(att) => setAttachments((a) => [att, ...a])} />}
    </div>
  );
};

export default InputBar;
