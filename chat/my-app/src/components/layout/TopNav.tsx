import React from "react";
import { useChat } from "../../store/ChatContext";
import PlusMenu from "./pulseicon";
const TopNav: React.FC = () => {
  const { state, actions } = useChat();
  return (
    <header className="nav" style={{ display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
        <img
          src={state.me.avatarUrl || "https://ui-avatars.com/api/?name=You&background=00a884&color=fff"}
          alt="Profile"
          style={{ width: 32, height: 32, borderRadius: "50%" }}
        />
        <strong>Chats</strong>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button title="Theme" onClick={() => actions.setTheme(state.theme === "dark" ? "light" : "dark")}
          style={{ background: "transparent", border: "none", color: "var(--text)", cursor: "pointer" }}>
          {state.theme === "dark" ? "🌙" : "☀️"}
        </button>
        <PlusMenu/>
        <button title="Settings" style={{ background: "transparent", border: "none", color: "var(--text)", cursor: "pointer" }}>⚙︎</button>
      </div>
    </header>
  );
};

export default TopNav;
