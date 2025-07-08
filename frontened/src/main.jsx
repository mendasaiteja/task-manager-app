import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './Components/App.jsx';
import { BrowserRouter } from 'react-router-dom';
import StoreProvider from './Components/StoreContext/Context.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreProvider>
      <App />
    </StoreProvider>
  </BrowserRouter>
);
