import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { setupSafeConsole } from './utils/errorUtils';

// Set up sanitized console logging
setupSafeConsole();

// Override window.onerror to sanitize error logs
window.onerror = (message, source, lineno, colno, error) => {
  console.error(new Error(message));
  return false;
};

// Override unhandled promise rejection handler
window.onunhandledrejection = (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
