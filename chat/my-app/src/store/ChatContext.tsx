import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Attachment, ChatActions, ChatState, Conversation, Message, ReadState, User } from "./types";
import { chatAPI, groupAPI } from "../services/api";
import { messageAPI } from "../services/api";

const ChatContext = createContext<{ state: ChatState; actions: ChatActions } | null>(null);

const seedUsers: Record<string, User> = {
  me: { id: "me", name: "You", status: "online", avatarUrl: "" },
};

const seedConvos: Record<string, Conversation> = {};
const seedMessages: Record<string, Message> = {};

function id() {
  return Math.random().toString(36).slice(2, 9);
}

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ChatState>({
    users: seedUsers,
    conversations: seedConvos,
    messages: seedMessages,
    activeConversationId: null,
    me: seedUsers.me,
    theme: "dark",
    notifications: [],
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  // Auto-fetch contacts and conversations on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        const chatsResponse = await chatAPI.getChats();

        let groupsResponse = [];
        try {
          groupsResponse = await groupAPI.getGroups();
        } catch (e) {
          // ignore group fetch errors
        }

        const newUsers: Record<string, User> = { ...seedUsers };
        const newConversations: Record<string, Conversation> = {};
        
        const chatsList = Array.isArray(chatsResponse) ? chatsResponse : [];
        
        chatsList.forEach((chat: any) => {
          const chatIdKey = chat.number ?? chat.id ?? Math.random().toString(36).slice(2,8);
          const userId = `u_${chatIdKey}`;
          const convId = `chat_${chatIdKey}`;

          if (!newUsers[userId]) {
            newUsers[userId] = {
              id: userId,
              name: chat.name || "Unknown",
              status: "offline",
              avatarUrl: "",
            };
          }
          newConversations[convId] = {
            id: convId,
            isGroup: false,
            title: chat.name || "Unknown",
            participants: ["me", userId],
            typingUserIds: [],
            metadata: {
              number: chat.number,
              chatId: chatIdKey,
              lastActivity: chat.updated_at ? Date.parse(chat.updated_at) : (chat.created_at ? Date.parse(chat.created_at) : 0)
            }
          };
        });

        // Process groups
        const groupsList = Array.isArray(groupsResponse) ? groupsResponse : groupsResponse?.data || groupsResponse?.groups || [];
        groupsList.forEach((group: any, index: number) => {
          const memberIds = ["me"];
          const members = group.members || [];
          members.forEach((member: any) => {
            const userId = `u_${member.id ?? member.number ?? Math.random().toString(36).slice(2,8)}`;
            if (!newUsers[userId]) {
              newUsers[userId] = {
                id: userId,
                name: member.name || "Unknown",
                status: "offline",
                avatarUrl: "",
              };
            }
            memberIds.push(userId);
          });
          
          const convId = `group_${group.id ?? index}`;
          const lastActivity = group.updated_at ? Date.parse(group.updated_at) : (group.created_at ? Date.parse(group.created_at) : 0);
          newConversations[convId] = {
            id: convId,
            isGroup: true,
            title: group.name || "Group",
            participants: memberIds,
            typingUserIds: [],
            metadata: {
              groupId: group.id,
              lastActivity: Number.isNaN(lastActivity) ? 0 : lastActivity,
            }
          };
        });
        
        // ensure 'me' user object is present in users map (key 'me', id 'me')
        newUsers.me = newUsers.me ?? seedUsers.me;
        
        setState(s => ({
          ...s,
          users: newUsers,
          conversations: newConversations,
          activeConversationId: null,
        }));
      } catch (error) {
        // keep state unchanged on error
        setState(s => ({ ...s }));
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const generateUserId = () => {
    const existingDynamic = Object.keys(state.users).filter(k => k.startsWith("un"));
    const nextIndex = existingDynamic.length + 1;
    return `un${nextIndex}`;
  };

  const actions: ChatActions = useMemo(() => ({
    setActiveConversation: (id: string) => {
      setState(s => ({ ...s, activeConversationId: id }));
    },

loadMessages: async (conversationId: string): Promise<void> => {
  const data = await messageAPI.getMessages(conversationId);

  setState(s => {
    const msgs = { ...s.messages };

    data.forEach((m: any) => {
      const msgId = String(m.id);
      msgs[msgId] = {
        id: msgId,
        conversationId: m.conversation_id,
        senderId: m.sender_id,
        text: m.text,
        timestamp: new Date(m.timestamp).getTime(),
        readState: "read",
      };
    });

    return { ...s, messages: msgs };
  });
},



    // NEW: rename a conversation title (updates chat panel title)
    renameConversation: (conversationId: string, newTitle: string) => {
      setState(s => {
        const conv = s.conversations[conversationId];
        if (!conv) return s;
        return { ...s, conversations: { ...s.conversations, [conversationId]: { ...conv, title: newTitle } } };
      });
    },
    // NEW: update a user's name (Conversation shows user name when available)
    updateUserName: (userId: string, newName: string) => {
      setState(s => {
        const user = s.users[userId];
        if (!user) return s;
        return { ...s, users: { ...s.users, [userId]: { ...user, name: newName } } };
      });
    },
    setTheme: (theme: "dark" | "light") => {
      setState(s => ({ ...s, theme }));
    },
    addNotification: (text: string) => {
      const n = { id: id(), type: "message" as const, text, timestamp: Date.now() };
      setState(s => ({ ...s, notifications: [n, ...s.notifications].slice(0, 4) }));
    },
    setTyping: (conversationId: string, userId: string, typing: boolean) => {
      setState(s => {
        const conv = s.conversations[conversationId];
        if (!conv) return s;
        const list = new Set(conv.typingUserIds ?? []);
        typing ? list.add(userId) : list.delete(userId);
        return {
          ...s,
          conversations: { ...s.conversations, [conversationId]: { ...conv, typingUserIds: Array.from(list) } },
        };
      });
    },
    setReadState: (messageId: string, readState: ReadState) => {
      setState(s => {
        const msg = s.messages[messageId];
        if (!msg) return s;
        const updated = { ...msg, readState };
        return { ...s, messages: { ...s.messages, [messageId]: updated } };
      });
    },
    sendMessage: async (payload: { conversationId: string; text: string; attachments?: Attachment[] }) => {
  const tempId = id();

  // 1️⃣ Add message immediately to UI (optimistic update)
  const newMsg: Message = {
    id: tempId,
    conversationId: payload.conversationId,
    senderId: "me",
    text: payload.text,
    attachments: payload.attachments,
    timestamp: Date.now(),
    readState: "sending",
  };

  setState(s => {
    const conv = s.conversations[payload.conversationId];
    return {
      ...s,
      messages: { ...s.messages, [tempId]: newMsg },
      conversations: {
        ...s.conversations,
        [conv.id]: { ...conv, lastMessageId: tempId },
      },
    };
  });

  // 2️⃣ Save to backend
try {
  const saved = await messageAPI.saveMessage({
    conversation_id: payload.conversationId,
    sender_id: "me",
    text: payload.text,
  });

  setState(s => {
    const msgs = { ...s.messages };
    delete msgs[tempId]; // ❌ remove temp message

    msgs[String(saved.id)] = {
      id: String(saved.id),
      conversationId: saved.conversation_id,
      senderId: saved.sender_id,
      text: saved.text,
      timestamp: new Date(saved.timestamp).getTime(),
      readState: "sent",
    };

    return { ...s, messages: msgs };
  });
} catch (e) {
  actions.setReadState(tempId, "failed");
}


},



    receiveMessageMock: (payload: { conversationId: string; senderId: string; text: string; attachments?: Attachment[] }) => {
      const newMsg: Message = {
        id: id(),
        conversationId: payload.conversationId,
        senderId: payload.senderId,
        text: payload.text,
        attachments: payload.attachments,
        timestamp: Date.now(),
        readState: "delivered",
      };
      setState(s => {
        const conv = s.conversations[payload.conversationId];
        const messages = { ...s.messages, [newMsg.id]: newMsg };
        const conversations = { ...s.conversations, [conv.id]: { ...conv, lastMessageId: newMsg.id } };
        return { ...s, messages, conversations };
      });
      actions.addNotification(`New message in ${state.conversations[payload.conversationId].title}`);
    },
    addUser: (user: Omit<User, "id">) => {
      const newId = generateUserId();
      const newUser: User = { ...user, id: newId };
      setState(s => ({
        ...s,
        users: { ...s.users, [newId]: newUser },
      }));
    },
    createChat: async (name: string, number: string) => {
      try {
        const response = await chatAPI.createChat({ name, number });
        
        const chatId = response.id || response.chat_id || id();
        const userId = `u_${chatId}`;
        
        // Add user
        const newUser: User = {
          id: userId,
          name: name,
          status: "offline",
          avatarUrl: "",
        };
        
        // Create conversation
        const convId = `chat_${chatId}`;
        const newConvo: Conversation = { id: convId, isGroup: false, title: name, participants: ["me", userId], typingUserIds: [], metadata: { chatId: chatId, number: number, } };
        
        setState(s => ({
          ...s,
          users: { ...s.users, [userId]: newUser },
          conversations: { ...s.conversations, [convId]: newConvo },
          activeConversationId: convId,
        }));
        
        actions.addNotification(`Chat with ${name} created`);
        return newConvo;
      } catch (error) {
        actions.addNotification(`Error creating chat: ${error instanceof Error ? error.message : "Unknown error"}`);
        throw error;
      }
    },
    createGroup: async (groupName: string, members: Array<{ name: string; number: string }>) => {
      try {
        const response = await groupAPI.createGroup({ name: groupName, members });
        
        const groupId = response.id || response.group_id || id();
        const memberIds = ["me"];
        const newUsers: Record<string, User> = {};
        
        // Add all members as users
        const returnedMembers = response.members || members;
        returnedMembers.forEach((member: any, index: number) => {
          const memberId = member.id || `temp_${index}`;
          const userId = `u_${memberId}`;
          newUsers[userId] = {
            id: userId,
            name: member.name,
            status: "offline",
            avatarUrl: "",
          };
          memberIds.push(userId);
        });
        
        // Create group conversation
        const convId = `group_${groupId}`;
        const newConvo: Conversation = {
          id: convId,
          isGroup: true,
          title: groupName,
          participants: memberIds,
          typingUserIds: [],
          metadata: {
            groupId: groupId,
          }
        };
        
        setState(s => ({
          ...s,
          users: { ...s.users, ...newUsers },
          conversations: { ...s.conversations, [convId]: newConvo },
          activeConversationId: convId,
        }));
        
        actions.addNotification(`Group ${groupName} created with ${members.length} members`);
        return newConvo;
      } catch (error) {
        actions.addNotification(`Error creating group: ${error instanceof Error ? error.message : "Unknown error"}`);
        throw error;
      }
    },
    refreshContacts: async () => {
      try {
        // <-- CALL SITE: refresh (manual) — again calls chatAPI.getChats()
        const chatsResponse = await chatAPI.getChats();
        const groupsResponse = await groupAPI.getGroups();
        
        const newUsers: Record<string, User> = { me: state.users.me };
        const newConversations: Record<string, Conversation> = {};
        
        const chatsList = Array.isArray(chatsResponse) ? chatsResponse : chatsResponse?.data || chatsResponse?.chats || [];
        chatsList.forEach((chat: any, index: number) => {
          // Use chat.id if available, otherwise use number as unique identifier
          const chatId = chat.id || chat.number || `chat_${index}`;
          const userId = `u_${chatId}`;
          
          if (!newUsers[userId]) {
            newUsers[userId] = {
              id: userId,
              name: chat.name || "Unknown",
              status: "offline",
              avatarUrl: "",
            };
          }
          const convId = `chat_${chatId}`;
          newConversations[convId] = {
            id: convId,
            isGroup: false,
            title: chat.name || "Unknown",
            participants: ["me", userId],
            typingUserIds: [],
            metadata: {
              chatId: chatId,
              number: chat.number,
            }
          };
        });
        
        const groupsList = Array.isArray(groupsResponse) ? groupsResponse : groupsResponse?.data || groupsResponse?.groups || [];
        groupsList.forEach((group: any) => {
          const memberIds = ["me"];
          const members = group.members || [];
          members.forEach((member: any) => {
            const userId = `u_${member.id}`;
            if (!newUsers[userId]) {
              newUsers[userId] = {
                id: userId,
                name: member.name || "Unknown",
                status: "offline",
                avatarUrl: "",
              };
            }
            memberIds.push(userId);
          });
          const convId = `group_${group.id}`;
          newConversations[convId] = {
            id: convId,
            isGroup: true,
            title: group.name || "Group",
            participants: memberIds,
            typingUserIds: [],
            metadata: {
              groupId: group.id,
            }
          };
        });
        
        setState(s => ({
          ...s,
          users: newUsers,
          conversations: newConversations,
        }));
        
        actions.addNotification("Contacts refreshed");
      } catch (error) {
        actions.addNotification(`Error refreshing: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    },
  }), [state.theme, state.conversations, state.users]);

  return (
    <ChatContext.Provider value={{ state, actions }}>
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '16px',
          color: '#666'
        }}>
          Loading contacts...
        </div>
      ) : (
        children
      )}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("ChatContext not found");
  return ctx;
};