import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import Home from './pages/Home';
import Exchange from './pages/Exchange';
import { lightTheme, darkTheme } from './styles/theme';

// Установка функций для работы с Telegram WebApp API
const initTelegramWebApp = () => {
  if (!window.Telegram || !window.Telegram.WebApp) {
    console.log('Telegram WebApp not available, running in standalone mode');
    return { user: null, webApp: null };
  }
  
  try {
    const webApp = window.Telegram.WebApp;
    
    // Расширяем WebApp на весь экран
    webApp.expand();
    
    // Применяем тему Telegram
    const colorScheme = webApp.colorScheme || 'dark';
    
    // Готовность WebApp
    webApp.ready();
    
    console.log('Telegram WebApp initialized:', webApp.initDataUnsafe);
    
    return {
      user: webApp.initDataUnsafe?.user || null,
      webApp,
      colorScheme
    };
  } catch (error) {
    console.error('Error initializing Telegram WebApp:', error);
    return { user: null, webApp: null };
  }
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textPrimary};
`;

function App() {
  const [theme, setTheme] = useState(darkTheme);
  const [telegramUser, setTelegramUser] = useState(null);
  
  useEffect(() => {
    // Загружаем иконки предварительно для предотвращения ошибок
    const preloadIcons = () => {
      const iconUrls = ['/favicon.ico', '/logo192.png', '/logo512.png'];
      iconUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };
    
    // Инициализируем Telegram WebApp
    const { user, colorScheme } = initTelegramWebApp();
    
    // Устанавливаем пользователя
    if (user) {
      setTelegramUser(user);
    }
    
    // Устанавливаем тему в зависимости от настроек Telegram
    if (colorScheme === 'light') {
      setTheme(lightTheme);
    } else {
      setTheme(darkTheme);
    }
    
    // Предзагрузка иконок
    preloadIcons();
    
    // Добавляем обработчик ошибок
    const errorHandler = (event) => {
      console.error('Caught error:', event.error || event.message);
      // Можно отправить ошибку на сервер для анализа
    };
    
    window.addEventListener('error', errorHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Router>
          <Routes>
            <Route path="/" element={<Home telegramUser={telegramUser} />} />
            <Route path="/exchange" element={<Exchange telegramUser={telegramUser} />} />
            {/* Здесь могут быть дополнительные маршруты */}
          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App; 