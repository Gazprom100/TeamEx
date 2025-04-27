import React, { useState, useEffect, ErrorBoundary } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import Home from './pages/Home';
import Exchange from './pages/Exchange';
import { lightTheme, darkTheme } from './styles/theme';

// Компонент для обработки ошибок
class ErrorFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Приложение поймало ошибку:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          backgroundColor: '#240000', 
          color: 'white',
          borderRadius: '10px' 
        }}>
          <h2>Что-то пошло не так</h2>
          <p>Мы уже работаем над исправлением проблемы. Пожалуйста, перезагрузите страницу.</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#3772FF', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Перезагрузить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Инициализация приложения выделена в отдельный эффект
  useEffect(() => {
    const initApp = async () => {
      try {
        // Задержка для инициализации DOM перед анимациями
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Предзагрузка иконок (с проверкой доступности)
        const preloadIcons = async () => {
          const iconUrls = ['/favicon.ico', '/logo192.png', '/logo512.png'];
          const promises = iconUrls.map(url => {
            return new Promise(resolve => {
              const img = new Image();
              img.onload = () => resolve(true);
              img.onerror = () => {
                console.warn(`Не удалось загрузить иконку: ${url}`);
                resolve(false);
              };
              img.src = url;
            });
          });
          
          await Promise.allSettled(promises);
        };
        
        // Инициализация Telegram WebApp
        const { user, colorScheme } = initTelegramWebApp();
        
        // Предзагрузка иконок 
        await preloadIcons();
        
        // Устанавливаем пользователя
        if (user) {
          setTelegramUser(user);
        }
        
        // Устанавливаем тему в зависимости от настроек Telegram
        setTheme(colorScheme === 'light' ? lightTheme : darkTheme);
        
        // Отмечаем, что приложение инициализировано
        setIsInitialized(true);
      } catch (error) {
        console.error('Произошла ошибка при инициализации приложения:', error);
        // Продолжаем инициализацию даже при ошибке
        setIsInitialized(true);
      }
    };
    
    initApp();
    
    // Глобальный обработчик ошибок
    const errorHandler = (event) => {
      console.error('Caught error:', event.error || event.message);
      // Можно отправить ошибку на сервер для анализа
    };
    
    // Прерываем обработку ошибок в Framer Motion, которые не влияют на работу
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Игнорируем специфические ошибки Framer Motion
      if (args[0] && typeof args[0] === 'string' && 
         (args[0].includes('addEventListener') || 
          args[0].includes('framer-motion'))) {
        return;
      }
      originalConsoleError.apply(console, args);
    };
    
    window.addEventListener('error', errorHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
      console.error = originalConsoleError;
    };
  }, []);
  
  // Показываем загрузку, пока приложение инициализируется
  if (!isInitialized) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Container>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div>Загрузка...</div>
          </div>
        </Container>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <ErrorFallback>
        <Container>
          <Router>
            <Routes>
              <Route path="/" element={<Home telegramUser={telegramUser} />} />
              <Route path="/exchange" element={<Exchange telegramUser={telegramUser} />} />
              {/* Здесь могут быть дополнительные маршруты */}
            </Routes>
          </Router>
        </Container>
      </ErrorFallback>
    </ThemeProvider>
  );
}

export default App; 