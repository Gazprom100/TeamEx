import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --dark-background: #111820;
    --dark-background-lighter: #1e2630;
    --main-green: #376f53;
    --light-green: #5da980;
    --text-white: #ffffff;
    --text-gray: #a0a0a0;
    --button-green: #264939;
    --button-hover: #3a7057;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background: var(--dark-background);
    color: var(--text-white);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    background: none;
    border: none;
    outline: none;
  }

  input {
    font-family: 'Roboto', sans-serif;
    background: none;
    border: none;
    outline: none;
    color: var(--text-white);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }
`;

export default GlobalStyles; 