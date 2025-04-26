import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { setupTelegramWebApp } from './services/api';

// Компоненты
import Home from './pages/Home';
import Exchange from './pages/Exchange';
import Header from './components/Header';
import Footer from './components/Footer';

// Стилизованные компоненты
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #0E131A 0%, #151E2A 100%);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  
  /* Адаптация под Telegram темы */
  [data-theme="dark"] & {
    background: linear-gradient(135deg, #0E131A 0%, #151E2A 100%);
  }
  
  [data-theme="light"] & {
    background: linear-gradient(135deg, #F5F7FA 0%, #E9EDF5 100%);
    color: #121212;
  }
`;

const Content = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

function App() {
  const [telegramUser, setTelegramUser] = useState(null);
  const [telegramTheme, setTelegramTheme] = useState('dark');
  
  useEffect(() => {
    // Инициализация Telegram WebApp
    const tg = setupTelegramWebApp();
    
    if (tg) {
      // Сохраняем информацию о пользователе если есть
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setTelegramUser(tg.initDataUnsafe.user);
      }
      
      // Устанавливаем тему
      setTelegramTheme(tg.colorScheme || 'dark');
      
      // Добавляем слушатель изменения темы
      tg.onEvent('themeChanged', () => {
        setTelegramTheme(tg.colorScheme);
      });
    }
  }, []);

  return (
    <AppContainer>
      <Router>
        <Header telegramUser={telegramUser} />
        <Content>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exchange" element={<Exchange telegramUser={telegramUser} />} />
            {/* Добавьте здесь новые маршруты */}
          </Routes>
        </Content>
        <Footer />
      </Router>
    </AppContainer>
  );
}

export default App; 