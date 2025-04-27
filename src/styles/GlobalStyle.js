import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* Colors */
    --text-primary: ${props => props.theme.textPrimary};
    --text-secondary: ${props => props.theme.textSecondary};
    
    --accent-primary: ${props => props.theme.accentPrimary};
    --accent-secondary: ${props => props.theme.accentSecondary};
    --danger: ${props => props.theme.danger};
    --warning: ${props => props.theme.warning};
    --info: ${props => props.theme.info};
    
    --accent-primary-rgb: ${props => props.theme.accentPrimaryRGB};
    
    --bg-primary: ${props => props.theme.background};
    --card-primary: ${props => props.theme.cardPrimary};
    --card-secondary: ${props => props.theme.cardSecondary};
    --card-border: ${props => props.theme.cardBorder};
    
    /* Spacing & Sizing */
    --border-radius: ${props => props.theme.borderRadius};
    --border-radius-sm: calc(${props => props.theme.borderRadius} * 0.5);
    --border-radius-lg: calc(${props => props.theme.borderRadius} * 1.5);
    --shadow: ${props => props.theme.shadow};
    
    /* Breakpoints */
    --breakpoint-xs: 0px;
    --breakpoint-sm: 576px;
    --breakpoint-md: 768px;
    --breakpoint-lg: 992px;
    --breakpoint-xl: 1200px;
    
    /* Spacing system */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-xxl: 3rem;
    
    /* Typography */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.25rem;
    --font-size-xl: 1.5rem;
    --font-size-xxl: 2rem;
    
    /* Z-index layers */
    --z-background: -10;
    --z-base: 1;
    --z-menu: 10;
    --z-modal: 100;
    --z-toast: 1000;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    
    @media (max-width: 768px) {
      font-size: 15px;
    }
    
    @media (max-width: 576px) {
      font-size: 14px;
    }
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow-x: hidden;
    line-height: 1.5;
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: var(--font-size-md);
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.2s ease, color 0.2s ease;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: var(--spacing-md);
  }
  
  h1 {
    font-size: var(--font-size-xxl);
    
    @media (max-width: 576px) {
      font-size: 1.75rem;
    }
  }
  
  h2 {
    font-size: var(--font-size-xl);
  }
  
  h3 {
    font-size: var(--font-size-lg);
  }
  
  p {
    margin-bottom: var(--spacing-md);
  }
  
  /* Responsive container */
  .container {
    width: 100%;
    padding-right: var(--spacing-md);
    padding-left: var(--spacing-md);
    margin-right: auto;
    margin-left: auto;
    
    @media (min-width: 576px) {
      max-width: 540px;
    }
    
    @media (min-width: 768px) {
      max-width: 720px;
    }
    
    @media (min-width: 992px) {
      max-width: 960px;
    }
    
    @media (min-width: 1200px) {
      max-width: 1140px;
    }
  }
  
  /* Исправление для предотвращения ошибок с hover и привязкой событий */
  @media (hover: hover) {
    a:hover, button:hover {
      opacity: 0.8;
    }
  }
  
  /* Для мобильных устройств без поддержки hover */
  @media (hover: none) {
    a:active, button:active {
      opacity: 0.8;
    }
    
    /* Улучшенные правила для сенсорных устройств */
    button, 
    [role="button"],
    .button,
    a.button {
      min-height: 44px; /* Apple's recommended minimum touch target size */
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  /* Предотвращаем анимации при первой загрузке для устранения ошибок */
  .no-animation {
    animation: none !important;
    transition: none !important;
  }
  
  /* Плавная загрузка изображений */
  img {
    opacity: 0;
    transition: opacity 0.3s ease;
    max-width: 100%;
    height: auto;
  }
  
  img.loaded {
    opacity: 1;
  }
  
  /* Стилизация скроллбара */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--accent-primary);
    border-radius: 4px;
  }
  
  /* Темное выделение текста */
  ::selection {
    background: var(--accent-primary);
    color: #fff;
  }
  
  /* Улучшенные фокус-стили для доступности */
  :focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }
`;

export default GlobalStyle; 