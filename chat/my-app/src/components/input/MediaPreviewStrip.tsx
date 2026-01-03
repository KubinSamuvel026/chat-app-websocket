import React from "react";
import type{ Attachment } from "../../store/types";

const MediaPreviewStrip: React.FC<{
  attachments: Attachment[];
  onRemove: (id: string) => void;
}> = ({ attachments, onRemove }) => {
  return (
    <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
      {attachments.map(att => (
        <div key={att.id} style={{ position: "relative", border: "1px solid var(--divider)", borderRadius: 8, overflow: "hidden" }}>
          {att.type === "image" ? (
            <img src={att.thumbnailUrl || att.url} alt={att.name || "image"} style={{ width: 120, height: 80, objectFit: "cover" }} />
          ) : (
            <div style={{ width: 120, height: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--panel-alt)" }}>
              <span style={{ fontSize: 12 }}>{att.name || "file"}</span>
            </div>
          )}
          <button
            onClick={() => onRemove(att.id)}
            title="Remove"
            style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer" }}
          >✕</button>
        </div>
      ))}
    </div>
  );
};

export default MediaPreviewStrip;
