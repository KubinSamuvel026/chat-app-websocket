export type UserStatus = "online" | "away" | "offline";

export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
  status: UserStatus;
};

export type ReadState = "sending" | "sent" | "delivered" | "read";

export type Attachment = {
  id: string;
  type: "image" | "file" | "audio" | "video";
  url: string;
  name?: string;
  size?: number; // bytes
  thumbnailUrl?: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  attachments?: Attachment[];
  timestamp: number; // ms
  readState: ReadState;
};

export type Conversation = {
  id: string;
  isGroup: boolean;
  title: string;
  participants: string[]; // user ids
  lastMessageId?: string;
  typingUserIds?: string[];
  muted?: boolean;
};

export type Notification = {
  id: string;
  type: "message" | "system";
  text: string;
  timestamp: number;
};

export type ChatState = {
  users: Record<string, User>;
  conversations: Record<string, Conversation>;
  messages: Record<string, Message>;
  activeConversationId?: string;
  me: User;
  theme: "dark" | "light";
  notifications: Notification[];
};

export type ChatActions = {
  setActiveConversation: (id: string) => void;
  sendMessage: (payload: Omit<Message, "id" | "readState" | "timestamp"> & { text?: string }) => void;
  setTyping: (conversationId: string, userId: string, typing: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;
  receiveMessageMock: (msg: Omit<Message, "id" | "readState" | "timestamp">) => void;
  setReadState: (messageId: string, state: ReadState) => void;
  addNotification: (text: string) => void;
};
