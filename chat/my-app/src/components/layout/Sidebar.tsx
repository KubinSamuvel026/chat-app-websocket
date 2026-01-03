import React from "react";
import ConversationList from "../conversations/ConversationList";
// import ContactList from "./democontat";
// import { ChatProvider } from "../../store/ChatContext";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 12, borderBottom: "1px solid var(--divider)" }}>
        <input
          placeholder="Search or start new chat"
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 8, border: "none",
            background: "var(--panel-alt)", color: "var(--text)"
          }}
        />
      </div>
        <ConversationList />
   
      {/* <ContactList/> */}
    </aside>
  );
};

export default Sidebar;
