import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  html, body {
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: white;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  ol, ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  a, button {
    cursor: pointer;
  }

  input, button {
    margin: 0;
    padding: 0;
    border: none;
    background-color: transparent;
  }
`;
