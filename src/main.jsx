import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { registerServiceWorker, showInstallPrompt } from './utils/pwaUtils.js';

// Register service worker for PWA functionality
registerServiceWorker();

// Show install prompt for PWA
showInstallPrompt();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);