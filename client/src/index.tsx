import React, { useContext, useEffect } from "react";
import ReactDOM from "react-dom";
// import styles from '@Style.module.css';
import "./tailwind.css";
import styles from "./Style.module.css";

import ChatLink from "./pages/chatlink";
import Messaging from "./pages/messaging";
import { ThemeProvider, ThemeContext } from "./ThemeContext";
import { setConfig } from "@chat-e2ee/service";
import { getServerURL } from "./utils/serverConfig";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import WebCryptoGuard from "./WebCryptoGuard";

const serverURL = getServerURL();
setConfig({
  apiURL: serverURL,
  socketURL: serverURL
});

const App = () => {
  const [darkMode] = useContext(ThemeContext);

  useEffect(() => {
    const body = document.body;
    body.classList.toggle("light-theme", !darkMode);
    body.classList.toggle("dark-theme", darkMode);
  }, [darkMode]);

  return (
    <div
      style={{ background: "transparent" }}
      className={`${styles.defaultMode} ${!darkMode && styles.lightMode} `}
    >
      <Router>
        <div className={styles.bodyContent}>
          <Routes>
            <Route path="/" element={<ChatLink />} />
            <Route path="/chat/:channelID" element={<Messaging />} />
            <Route path="/:channelID" element={<Messaging />} />
            <Route path="*" element={<ChatLink />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

ReactDOM.render(
  <ThemeProvider>
    <React.StrictMode>
      <ErrorBoundary>
        <WebCryptoGuard>
          <App />
        </WebCryptoGuard>
      </ErrorBoundary>
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById("root")
);
