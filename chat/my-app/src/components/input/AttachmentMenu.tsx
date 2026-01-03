import React, { useRef } from "react";
import type { Attachment } from "../../store/types";

function makeId() { return Math.random().toString(36).slice(2, 9); }

const AttachmentMenu: React.FC<{ onAdd: (att: Attachment) => void }> = ({ onAdd }) => {
  const imgInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList, type: Attachment["type"]) => {
    Array.from(files).forEach(f => {
      const att: Attachment = {
        id: makeId(),
        type,
        url: URL.createObjectURL(f),
        name: f.name,
        size: f.size,
        thumbnailUrl: type === "image" ? URL.createObjectURL(f) : undefined,
      };
      onAdd(att);
    });
  };

  return (
    <div style={{
      background: "var(--panel-alt)", borderRadius: 12, border: "1px solid var(--divider)",
      padding: 8, display: "flex", gap: 8, alignItems: "center", maxWidth: 480
    }}>
      <button onClick={() => imgInput.current?.click()} style={{ background: "transparent", border: "none", color: "var(--text)", cursor: "pointer" }}>📷 Image</button>
      <button onClick={() => fileInput.current?.click()} style={{ background: "transparent", border: "none", color: "var(--text)", cursor: "pointer" }}>📄 File</button>
      <input ref={imgInput} type="file" accept="image/*" multiple hidden onChange={(e) => {
        if (e.target.files) addFiles(e.target.files, "image");
      }} />
      <input ref={fileInput} type="file" multiple hidden onChange={(e) => {
        if (e.target.files) addFiles(e.target.files, "file");
      }} />
    </div>
  );
};

export default AttachmentMenu;
