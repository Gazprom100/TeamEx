import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    /* Основная цветовая палитра */
    --dark-background: #0c0e14;
    --dark-background-lighter: #151929;
    --dark-card: #1a1f35;
    --accent-primary: #3772ff;
    --accent-secondary: #0284c7;
    --accent-success: #00b775;
    --accent-warning: #ffc34a;
    --accent-danger: #f53b57;
    --text-primary: #ffffff;
    --text-secondary: #a1a8c2;
    --text-tertiary: #646e8f;
    --border-color: rgba(255, 255, 255, 0.1);
    
    /* Неоновые акценты */
    --neon-blue: #3772ff;
    --neon-purple: #8a3ffc;
    --neon-green: #00d09c;
    --neon-pink: #e552ff;
    
    /* Градиенты */
    --gradient-blue: linear-gradient(135deg, #3772ff 0%, #0284c7 100%);
    --gradient-green: linear-gradient(135deg, #00b775 0%, #00d09c 100%);
    --gradient-purple: linear-gradient(135deg, #9e2bff 0%, #4364f7 100%);
    --gradient-gold: linear-gradient(135deg, #f8b500 0%, #ffd966 100%);
    
    /* Карты и компоненты */
    --card-radius: 16px;
    --button-radius: 12px;
    --input-radius: 12px;
    --transition-fast: 0.2s ease;
    --transition-medium: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    /* Тени */
    --shadow-soft: 0 8px 30px rgba(0, 0, 0, 0.12);
    --shadow-strong: 0 10px 40px rgba(0, 0, 0, 0.2);
    --shadow-neon-blue: 0 0 20px rgba(55, 114, 255, 0.5);
    --shadow-neon-green: 0 0 20px rgba(0, 208, 156, 0.5);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Montserrat', 'Roboto', sans-serif;
    background: var(--dark-background);
    color: var(--text-primary);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  button {
    cursor: pointer;
    font-family: 'Montserrat', sans-serif;
    background: none;
    border: none;
    outline: none;
    transition: var(--transition-fast);
  }

  input, textarea, select {
    font-family: 'Montserrat', sans-serif;
    background: var(--dark-card);
    border: 1px solid var(--border-color);
    border-radius: var(--input-radius);
    padding: 14px 16px;
    color: var(--text-primary);
    outline: none;
    transition: var(--transition-fast);
    
    &:focus {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 3px rgba(55, 114, 255, 0.2);
    }

    &::placeholder {
      color: var(--text-tertiary);
    }
  }

  a {
    text-decoration: none;
    color: var(--accent-primary);
    transition: var(--transition-fast);
    
    &:hover {
      color: var(--accent-secondary);
    }
  }

  ul, ol {
    list-style: none;
  }
  
  /* Стилизация полосы прокрутки */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--dark-background);
  }
  
  ::-webkit-scrollbar-thumb {
    background: var(--text-tertiary);
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: var(--accent-primary);
  }
  
  /* Стилизация выделения текста */
  ::selection {
    background: var(--accent-primary);
    color: white;
  }
`;

export default GlobalStyles; 