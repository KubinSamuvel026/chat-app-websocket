import { useState } from "react";
import { useChat } from "../../store/ChatContext";

function PlusMenu() {
  const { actions } = useChat();
  const [open, setOpen] = useState(false);
  const [showChatForm, setShowChatForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  
  // Chat form state
  const [chatName, setChatName] = useState("");
  const [chatNumber, setChatNumber] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  
  // Group form state
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [memberNumber, setMemberNumber] = useState("");
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupError, setGroupError] = useState("");

  const handleNewChat = () => {
    setOpen(false);
    setShowChatForm(true);
    setChatError("");
  };

  const handleNewGroup = () => {
    setOpen(false);
    setShowGroupForm(true);
    setGroupError("");
  };
const handleNumberChange = (e) => {
  const value = e.target.value;

  // Allow only digits
  if (/^\d*$/.test(value)) {
    setChatNumber(value);
  }
};
const validateNumber = () => {
  const phoneRegex = /^[0-9]{10}$/;   // 10-digit mobile number

  if (!phoneRegex.test(chatNumber)) {
    alert("Enter a valid 10-digit mobile number");
    return false;
  }
  return true;
};

  const handleChatSubmit = async (e) => {
  if (!validateNumber()) return;
    e.preventDefault();
    setChatError("");
    setChatLoading(true);


    try {
      await actions.createChat(chatName, chatNumber);
      // Reset form
      setChatName("");
      setChatNumber("");
      setShowChatForm(false);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Failed to create chat");
    } finally {
      setChatLoading(false);
    }
  };

  const handleAddMember = () => {
    if (memberName && memberNumber) {
      setMembers([...members, { name: memberName, number: memberNumber }]);
      setMemberName("");
      setMemberNumber("");
    }
  };

  const handleRemoveMember = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleGroupSubmit = async (e) => {
    e.preventDefault();
    setGroupError("");
    setGroupLoading(true);

    try {
      await actions.createGroup(groupName, members);
      // Reset form
      setGroupName("");
      setMembers([]);
      setShowGroupForm(false);
    } catch (error) {
      setGroupError(error instanceof Error ? error.message : "Failed to create group");
    } finally {
      setGroupLoading(false);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        title="New chat"
        style={{
          background: "transparent",
          border: "none",
          color: "var(--text)",
          cursor: "pointer",
          fontSize: "20px"
        }}
        onClick={() => setOpen(!open)}
      >
        ✚
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "35px",
            right: 0,
            background: "var(--panel)",
            padding: "10px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 100
          }}
        >
          <button
            style={{
              background: "var(--glass)",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              color: "var(--text)"
            }}
            onClick={handleNewChat}
          >
            🗨️ New Chat
          </button>

          <button
            style={{
              background: "var(--glass)",
              border: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              color: "var(--text)"
            }}
            onClick={handleNewGroup}
          >
            👥 New Group
          </button>
        </div>
      )}

      {/* New Chat Form Modal */}
      {showChatForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setShowChatForm(false)}
        >
          <div
            style={{
              background: "var(--panel)",
              padding: "24px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 20px 0", color: "var(--text)" }}>New Chat</h2>
            
            {chatError && (
              <div style={{
                marginBottom: "16px",
                padding: "10px",
                background: "#f44336",
                color: "white",
                borderRadius: "6px",
                fontSize: "14px"
              }}>
                {chatError}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text)" }}>
                  Name
                </label>
                <input
                  type="text"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  disabled={chatLoading}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--glass)",
                    background: "var(--glass)",
                    color: "var(--text)",
                    fontSize: "14px"
                  }}
                  placeholder="Enter name"
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text)" }}>
                  Number
                </label>
                <input
                  type="tel"
                  value={chatNumber}
                  onChange={handleNumberChange}
                  disabled={chatLoading}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--glass)",
                    background: "var(--glass)",
                    color: "var(--text)",
                    fontSize: "14px"
                  }}
                  placeholder="Enter phone number"
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  onClick={handleChatSubmit}
                  disabled={chatLoading || !chatName || !chatNumber}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    border: "none",
                    background: (chatLoading || !chatName || !chatNumber) ? "#666" : "#4CAF50",
                    color: "white",
                    cursor: (chatLoading || !chatName || !chatNumber) ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  {chatLoading ? "Creating..." : "Submit"}
                </button>
                <button
                  onClick={() => setShowChatForm(false)}
                  disabled={chatLoading}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--glass)",
                    background: "transparent",
                    color: "var(--text)",
                    cursor: chatLoading ? "not-allowed" : "pointer",
                    fontSize: "14px"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Group Form Modal */}
      {showGroupForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setShowGroupForm(false)}
        >
          <div
            style={{
              background: "var(--panel)",
              padding: "24px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "500px",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 20px 0", color: "var(--text)" }}>New Group</h2>
            
            {groupError && (
              <div style={{
                marginBottom: "16px",
                padding: "10px",
                background: "#f44336",
                color: "white",
                borderRadius: "6px",
                fontSize: "14px"
              }}>
                {groupError}
              </div>
            )}
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text)" }}>
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  disabled={groupLoading}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--glass)",
                    background: "var(--glass)",
                    color: "var(--text)",
                    fontSize: "14px"
                  }}
                  placeholder="Enter group name"
                />
              </div>

              <div style={{ 
                padding: "16px", 
                background: "var(--glass)", 
                borderRadius: "8px",
                border: "1px dashed rgba(255,255,255,0.2)"
              }}>
                <h3 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "16px" }}>
                  Add Members
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input
                    type="text"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    disabled={groupLoading}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(0,0,0,0.2)",
                      color: "var(--text)",
                      fontSize: "14px"
                    }}
                    placeholder="Member name"
                  />
                  
                  <input
                    type="tel"
                    value={memberNumber}
                    onChange={(e) => setMemberNumber(e.target.value)}
                    disabled={groupLoading}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(0,0,0,0.2)",
                      color: "var(--text)",
                      fontSize: "14px"
                    }}
                    placeholder="Member number"
                  />
                  
                  <button
                    onClick={handleAddMember}
                    disabled={groupLoading}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#2196F3",
                      color: "white",
                      cursor: groupLoading ? "not-allowed" : "pointer",
                      fontSize: "14px"
                    }}
                  >
                    + Add Member
                  </button>
                </div>
              </div>

              {members.length > 0 && (
                <div>
                  <h3 style={{ margin: "0 0 12px 0", color: "var(--text)", fontSize: "16px" }}>
                    Members ({members.length})
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {members.map((member, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px",
                          background: "var(--glass)",
                          borderRadius: "6px"
                        }}
                      >
                        <div>
                          <div style={{ color: "var(--text)", fontWeight: "500" }}>
                            {member.name}
                          </div>
                          <div style={{ color: "var(--text)", opacity: 0.7, fontSize: "12px" }}>
                            {member.number}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveMember(index)}
                          disabled={groupLoading}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            border: "none",
                            background: "#f44336",
                            color: "white",
                            cursor: groupLoading ? "not-allowed" : "pointer",
                            fontSize: "12px"
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  onClick={handleGroupSubmit}
                  disabled={groupLoading || !groupName || members.length === 0}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    border: "none",
                    background: (groupLoading || !groupName || members.length === 0) ? "#666" : "#4CAF50",
                    color: "white",
                    cursor: (groupLoading || !groupName || members.length === 0) ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  {groupLoading ? "Creating..." : "Create Group"}
                </button>
                <button
                  onClick={() => setShowGroupForm(false)}
                  disabled={groupLoading}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid var(--glass)",
                    background: "transparent",
                    color: "var(--text)",
                    cursor: groupLoading ? "not-allowed" : "pointer",
                    fontSize: "14px"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlusMenu;