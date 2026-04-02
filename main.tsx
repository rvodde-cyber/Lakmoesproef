import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App.tsx';
import './src/index.css';

console.log('React probeert nu te mounten op #root (root main.tsx)');

const rootEl = document.getElementById('root');

if (!rootEl) {
  console.error('❌ #root element niet gevonden in index.html');
  document.body.innerHTML =
    '<div style="background:red;color:white;padding:20px;font:16px system-ui;">❌ #root element niet gevonden</div>';
} else {
  ReactDOM.createRoot(rootEl).render(<App />);
}
