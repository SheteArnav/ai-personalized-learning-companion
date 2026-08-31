import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import { LearningProvider } from './context/LearningContext.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LearningProvider>
      <App />
    </LearningProvider>
  </React.StrictMode>
);
