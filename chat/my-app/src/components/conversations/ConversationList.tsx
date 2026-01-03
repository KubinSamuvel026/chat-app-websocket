import React from 'react';
import { ChatProvider, useChat } from '../../store/ChatContext';
import ConversationItem from './ConversationItem';

const ConversationList: React.FC = () => {
  const { state } = useChat();

  // defensive: handle undefined conversations
  const conversations = Object.values(state.conversations || {});

  const getActivity = (conv: any) => {
    if (!conv) return 0;
    if (conv.metadata?.lastActivity && typeof conv.metadata.lastActivity === "number") return conv.metadata.lastActivity;
    if (conv.lastMessageId) return state.messages[conv.lastMessageId]?.timestamp ?? 0;
    return 0;
  };

  const sortedConversations = conversations.slice().sort((a, b) => {
    return getActivity(b) - getActivity(a);
  });

  return (
    
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      {sortedConversations.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
          No conversations yet
        </div>
      ) : (
        sortedConversations.map(conversation => (
          
          <ConversationItem 
            key={conversation.id} 
            conversation={conversation} 
          />
        ))
      )}
    </div>
    
  );
};

export default ConversationList;