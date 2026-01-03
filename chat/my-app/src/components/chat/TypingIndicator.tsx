import React from "react";

const TypingIndicator: React.FC<{ names: string[] }> = ({ names }) => {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, margin: "8px 16px", color: "var(--accent)" }}>
      <span style={{ fontSize: 12 }}>{names.join(", ")} typing</span>
      <span aria-hidden="true" style={{ display: "inline-flex", gap: 4 }}>
        <Dot /> <Dot /> <Dot />
      </span>
    </div>
  );
};

const Dot: React.FC = () => (
  <span style={{
    width: 6, height: 6, borderRadius: "50%", background: "var(--accent)",
    display: "inline-block", animation: "typing 1s infinite ease-in-out"
  }} />
);

export default TypingIndicator;
