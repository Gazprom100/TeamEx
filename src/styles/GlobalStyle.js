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
    --shadow: ${props => props.theme.shadow};
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: var(--bg-primary);
    color: var(--text-primary);
    overflow-x: hidden;
  }

  button, input, select, textarea {
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
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
  }
  
  img.loaded {
    opacity: 1;
  }
`;

export default GlobalStyle; 