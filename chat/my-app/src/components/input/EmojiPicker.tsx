import React from "react";

const emojis = ["😀","😅","😂","😉","😊","😍","🤩","😎","😢","😡","👍","🙏","🔥","✨","❤️","🎉"];

const EmojiPicker: React.FC<{ onSelect: (emoji: string) => void }> = ({ onSelect }) => {
  return (
    <div style={{
      background: "var(--panel-alt)", borderRadius: 12, border: "1px solid var(--divider)",
      padding: 8, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4, maxWidth: 360
    }}>
      {emojis.map(e => (
        <button key={e}
          onClick={() => onSelect(e)}
          style={{ fontSize: 20, background: "transparent", border: "none", cursor: "pointer" }}
        >{e}</button>
      ))}
    </div>
  );
};

export default EmojiPicker;
