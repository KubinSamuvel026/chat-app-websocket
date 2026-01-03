import React from "react";
import type{ ReadState } from "../../store/types";

const ReadReceipt: React.FC<{ state: ReadState }> = ({ state }) => {
  const color = state === "read" ? "var(--accent-strong)" : "var(--text-muted)";
  const ticks = state === "sending" ? "…" : state === "sent" ? "✓" : "✓✓";
  return (
    <span style={{ fontSize: 12, color }}>{ticks}</span>
  );
};

export default ReadReceipt;
