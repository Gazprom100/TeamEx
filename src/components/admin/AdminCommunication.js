import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Styled Components
const Container = styled.div`
  display: flex;
  height: calc(100vh - 120px);
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
`;

const UsersList = styled.div`
  width: 300px;
  background: #242424;
  border-right: 1px solid #333;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }
`;

const SearchInput = styled.input`
  width: calc(100% - 32px);
  margin: 16px;
  padding: 8px 16px;
  background: #333;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #666;
  }
  
  &::placeholder {
    color: #888;
  }
`;

const UserItem = styled(motion.div)`
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #333;
  background: ${props => props.active ? '#333' : 'transparent'};
  
  &:hover {
    background: ${props => props.active ? '#333' : '#2a2a2a'};
  }
`;

const UserName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const LastMessage = styled.div`
  font-size: 13px;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
`;

const ChatHeader = styled.div`
  padding: 16px;
  background: #242424;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }
`;

const Message = styled(motion.div)`
  max-width: 70%;
  margin: 8px 0;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${props => props.isAdmin ? '#2a5fb4' : '#333'};
  align-self: ${props => props.isAdmin ? 'flex-end' : 'flex-start'};
  word-wrap: break-word;
`;

const MessageTime = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
`;

const InputArea = styled.div`
  padding: 16px;
  background: #242424;
  border-top: 1px solid #333;
  display: flex;
  gap: 12px;
`;

const MessageInput = styled.textarea`
  flex: 1;
  padding: 12px;
  background: #333;
  border: 1px solid #444;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  resize: none;
  min-height: 24px;
  max-height: 120px;
  
  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const SendButton = styled.button`
  padding: 0 24px;
  background: #2a5fb4;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #3570d4;
  }
  
  &:disabled {
    background: #444;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 16px;
`;

// Mock data for development
const mockUsers = [
  { id: 1, name: 'Иван Петров', lastMessage: 'Здравствуйте, у меня вопрос по обмену' },
  { id: 2, name: 'Анна Сидорова', lastMessage: 'Спасибо за помощь!' },
  { id: 3, name: 'Михаил Иванов', lastMessage: 'Когда будет обработана моя заявка?' },
];

const mockMessages = {
  1: [
    { id: 1, text: 'Здравствуйте, у меня вопрос по обмену', isAdmin: false, timestamp: new Date(2024, 2, 15, 14, 30) },
    { id: 2, text: 'Добрый день! Как я могу помочь?', isAdmin: true, timestamp: new Date(2024, 2, 15, 14, 32) },
  ],
  2: [
    { id: 1, text: 'Спасибо за помощь!', isAdmin: false, timestamp: new Date(2024, 2, 15, 15, 45) },
  ],
  3: [
    { id: 1, text: 'Когда будет обработана моя заявка?', isAdmin: false, timestamp: new Date(2024, 2, 15, 16, 20) },
  ],
};

const AdminCommunication = () => {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      setMessages(mockMessages[selectedUser.id] || []);
      scrollToBottom();
    }
  }, [selectedUser]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const newMsg = {
      id: messages.length + 1,
      text: newMessage.trim(),
      isAdmin: true,
      timestamp: new Date(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    // Update last message in users list
    const updatedUsers = users.map(user =>
      user.id === selectedUser.id
        ? { ...user, lastMessage: newMessage.trim() }
        : user
    );
    setUsers(updatedUsers);

    // Scroll to bottom after message is sent
    setTimeout(scrollToBottom, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container>
      <UsersList>
        <SearchInput
          placeholder="Поиск пользователей..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <AnimatePresence>
          {filteredUsers.map(user => (
            <UserItem
              key={user.id}
              active={selectedUser?.id === user.id}
              onClick={() => handleUserSelect(user)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <UserName>{user.name}</UserName>
              <LastMessage>{user.lastMessage}</LastMessage>
            </UserItem>
          ))}
        </AnimatePresence>
      </UsersList>
      
      <ChatArea>
        {selectedUser ? (
          <>
            <ChatHeader>
              <h3>{selectedUser.name}</h3>
            </ChatHeader>
            
            <MessagesContainer>
              <AnimatePresence>
                {messages.map(message => (
                  <Message
                    key={message.id}
                    isAdmin={message.isAdmin}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    {message.text}
                    <MessageTime>
                      {format(message.timestamp, 'HH:mm, d MMMM', { locale: ru })}
                    </MessageTime>
                  </Message>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </MessagesContainer>
            
            <InputArea>
              <MessageInput
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите сообщение..."
                rows={1}
              />
              <SendButton
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                Отправить
              </SendButton>
            </InputArea>
          </>
        ) : (
          <EmptyState>
            Выберите пользователя для начала общения
          </EmptyState>
        )}
      </ChatArea>
    </Container>
  );
};

export default AdminCommunication; 