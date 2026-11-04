import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErroGeral from './componentes/ErroGeral.jsx';
import './estilos/global.css';
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode>
    <ErroGeral>
      <App />
    </ErroGeral>
  </React.StrictMode>);
