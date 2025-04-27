import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import Home from './pages/Home';
import Exchange from './pages/Exchange';
import { lightTheme, darkTheme } from './styles/theme';

// Сохраняем оригинальный метод addEventListener
let originalAddEventListener;

// Компонент для обработки ошибок
class ErrorFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Когда происходит ошибка, устанавливаем глобальный флаг для отключения всех анимаций
    window.DISABLE_ALL_ANIMATIONS = true;
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
    // В автономном режиме сразу отключаем сложные анимации
    window.DISABLE_COMPLEX_ANIMATIONS = true;
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
    window.DISABLE_COMPLEX_ANIMATIONS = true;
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

// Расширенный патч для Framer Motion, отключающий проблемные функции
const patchFramerMotion = () => {
  // Глобальный флаг для отключения всех анимаций
  window.DISABLE_ALL_ANIMATIONS = false;
  
  // Дополнительный флаг для отключения только сложных анимаций (hover, drag)
  window.DISABLE_COMPLEX_ANIMATIONS = false;
  
  // Проверка, существует ли элемент в DOM
  const isElementAttached = (element) => {
    if (!element) return false;
    try {
      return element instanceof Element && document.contains(element);
    } catch (e) {
      return false;
    }
  };
  
  // Перехват создания обработчиков событий
  originalAddEventListener = Element.prototype.addEventListener;
  Element.prototype.addEventListener = function(type, listener, options) {
    // Полная блокировка всех анимаций
    if (window.DISABLE_ALL_ANIMATIONS) {
      return;
    }
    
    // Блокировка только сложных анимаций (hover, drag)
    if (window.DISABLE_COMPLEX_ANIMATIONS && 
        (type.includes('mouse') || type.includes('pointer') || type.includes('touch'))) {
      return;
    }
    
    // Защита от попытки добавить обработчик к несуществующему элементу
    if (!this || !isElementAttached(this)) {
      return;
    }
    
    try {
      return originalAddEventListener.call(this, type, listener, options);
    } catch (error) {
      console.warn('Failed to add event listener:', type, error);
      return null;
    }
  };
  
  // Патч для HTMLElement.prototype.attachShadow
  const originalAttachShadow = HTMLElement.prototype.attachShadow;
  if (originalAttachShadow) {
    HTMLElement.prototype.attachShadow = function(...args) {
      try {
        return originalAttachShadow.apply(this, args);
      } catch (error) {
        console.warn('Failed to attach shadow DOM:', error);
        return null;
      }
    };
  }
};

function App() {
  const [theme, setTheme] = useState(darkTheme);
  const [telegramUser, setTelegramUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Инициализация приложения выделена в отдельный эффект
  useEffect(() => {
    // Патчим Framer Motion
    patchFramerMotion();
    
    const initApp = async () => {
      try {
        // Задержка для инициализации DOM перед анимациями
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
      // Отключаем анимации при первой ошибке
      window.DISABLE_ALL_ANIMATIONS = true;
    };
    
    // Прерываем обработку ошибок в Framer Motion, которые не влияют на работу
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Игнорируем специфические ошибки Framer Motion
      if (args[0] && typeof args[0] === 'string') {
        if (args[0].includes('addEventListener') || args[0].includes('framer-motion')) {
          // Если ошибка связана с hover или drag, отключаем сложные анимации
          if (args[0].includes('hover') || args[0].includes('drag') || 
              args[0].includes('pointer') || args[0].includes('mouse')) {
            window.DISABLE_COMPLEX_ANIMATIONS = true;
          }
          
          // Отключаем все анимации только при серьезных ошибках
          if (args[0].includes('addEventListener')) {
            window.DISABLE_ALL_ANIMATIONS = true;
          }
          return;
        }
      }
      originalConsoleError.apply(console, args);
    };
    
    window.addEventListener('error', errorHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
      console.error = originalConsoleError;
      // Восстанавливаем оригинальный addEventListener
      if (Element.prototype.addEventListener !== originalAddEventListener) {
        Element.prototype.addEventListener = originalAddEventListener;
      }
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