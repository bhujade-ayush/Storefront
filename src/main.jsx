import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AssistantProvider } from './context/AssistantContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <AssistantProvider>
          <App />
        </AssistantProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
