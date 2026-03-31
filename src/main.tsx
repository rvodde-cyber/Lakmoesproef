import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('💥 Fatale render fout:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h1>Oeps! Er ging iets mis.</h1>
        <p>De Lakmoesproef kon niet geladen worden. Ververs de pagina of probeer het later opnieuw.</p>
      </div>
    `;
  }
}