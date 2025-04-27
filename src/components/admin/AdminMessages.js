import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card } from '../Card';

const MessagesContainer = styled.div`
  height: calc(100vh - 220px);
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-md);
`;

const UsersList = styled(Card)`
  overflow-y: auto;
  padding: 0;
`;

const UserItem = styled.div`
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #2a2a2a;
  margin-right: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: var(--color-primary);
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const UserLastMessage = styled.div`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

const ChatContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;
`;

const ChatHeader = styled.div`
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
`;

const ChatTitle = styled.div`
  font-weight: 500;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
`;

const Message = styled.div`
  max-width: 70%;
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 18px;
  
  ${props => props.isAdmin ? `
    align-self: flex-end;
    background-color: var(--color-primary);
    color: white;
    border-bottom-right-radius: 4px;
  ` : `
    align-self: flex-start;
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    border-bottom-left-radius: 4px;
  `}
`;

const MessageTime = styled.div`
  font-size: var(--font-size-xs);
  color: ${props => props.isAdmin ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-secondary)'};
  text-align: ${props => props.isAdmin ? 'right' : 'left'};
  margin-top: 2px;
`;

const MessageInput = styled.div`
  padding: var(--spacing-md);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 20px;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-primary);
  outline: none;
  
  &:focus {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const SendButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  margin-left: var(--spacing-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  &:disabled {
    background-color: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  text-align: center;
  padding: var(--spacing-lg);
`;

// Мок данных для демонстрации
const MOCK_USERS = [
  { id: 1, name: 'Иван Петров', lastMessage: 'Как мне купить USDT?', unread: true },
  { id: 2, name: 'Анна Сидорова', lastMessage: 'Спасибо за быстрый ответ!', unread: false },
  { id: 3, name: 'Сергей Иванов', lastMessage: 'Не могу вывести средства', unread: true },
  { id: 4, name: 'Мария Козлова', lastMessage: 'У вас очень удобный интерфейс', unread: false },
  { id: 5, name: 'Алексей Смирнов', lastMessage: 'Когда будет доступен вывод на карту?', unread: false },
];

const MOCK_MESSAGES = {
  1: [
    { id: 1, text: 'Привет! Подскажите, пожалуйста, как мне купить USDT через ваш сервис?', isAdmin: false, timestamp: '10:25' },
    { id: 2, text: 'Здравствуйте! Для покупки USDT вам нужно на главной странице нажать кнопку "Купить USDT" и следовать инструкциям.', isAdmin: true, timestamp: '10:28' },
    { id: 3, text: 'Спасибо! А какие способы оплаты поддерживаются?', isAdmin: false, timestamp: '10:30' },
  ],
  2: [
    { id: 1, text: 'Добрый день! Хотела уточнить, какая комиссия при покупке USDT?', isAdmin: false, timestamp: '09:15' },
    { id: 2, text: 'Здравствуйте! Комиссия составляет 1% от суммы транзакции.', isAdmin: true, timestamp: '09:18' },
    { id: 3, text: 'Спасибо за быстрый ответ!', isAdmin: false, timestamp: '09:20' },
  ],
  3: [
    { id: 1, text: 'Здравствуйте! У меня проблема с выводом средств. Транзакция в статусе "В обработке" уже 2 часа.', isAdmin: false, timestamp: '14:45' },
    { id: 2, text: 'Добрый день! Приносим извинения за неудобства. Пожалуйста, уточните номер транзакции.', isAdmin: true, timestamp: '14:50' },
    { id: 3, text: 'Номер TX-78945612', isAdmin: false, timestamp: '14:52' },
  ],
};

const AdminMessages = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Симуляция загрузки данных
  useEffect(() => {
    // В реальном приложении здесь был бы API-запрос
    setUsers(MOCK_USERS);
  }, []);
  
  // Загрузка сообщений при выборе пользователя
  useEffect(() => {
    if (selectedUser) {
      // В реальном приложении здесь был бы API-запрос
      setMessages(MOCK_MESSAGES[selectedUser.id] || []);
    } else {
      setMessages([]);
    }
  }, [selectedUser]);
  
  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;
    
    const newMsg = {
      id: Date.now(),
      text: newMessage,
      isAdmin: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // В реальном приложении здесь был бы API-запрос
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%' }}
    >
      <MessagesContainer>
        <UsersList>
          {users.map(user => (
            <UserItem
              key={user.id}
              active={selectedUser?.id === user.id}
              onClick={() => setSelectedUser(user)}
            >
              <UserAvatar>{user.name.charAt(0)}</UserAvatar>
              <UserInfo>
                <UserName>{user.name}</UserName>
                <UserLastMessage>{user.lastMessage}</UserLastMessage>
              </UserInfo>
            </UserItem>
          ))}
        </UsersList>
        
        <ChatContainer>
          {selectedUser ? (
            <>
              <ChatHeader>
                <ChatTitle>{selectedUser.name}</ChatTitle>
              </ChatHeader>
              
              <MessagesArea>
                {messages.map(message => (
                  <div key={message.id}>
                    <Message isAdmin={message.isAdmin}>
                      {message.text}
                    </Message>
                    <MessageTime isAdmin={message.isAdmin}>
                      {message.timestamp}
                    </MessageTime>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </MessagesArea>
              
              <MessageInput>
                <Input
                  type="text"
                  placeholder="Введите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <SendButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  →
                </SendButton>
              </MessageInput>
            </>
          ) : (
            <EmptyState>
              <p>Выберите пользователя для начала переписки</p>
            </EmptyState>
          )}
        </ChatContainer>
      </MessagesContainer>
    </motion.div>
  );
};

export default AdminMessages; 