import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('React probeert nu te mounten op #root');

const rootEl = document.getElementById('root');

if (!rootEl) {
  console.error('❌ #root element niet gevonden in index.html');
  document.body.innerHTML = 
    '<div style="background:red;color:white;padding:20px;font-family:sans-serif;">' +
    '<h1>❌ Fout: #root niet gevonden</h1>' +
    '<p>Controleer of index.html een div heeft met id="root".</p>' +
    '</div>';
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
