import React from 'react';
import { BookProvider } from "./context/books";
import App from './App';
import './index.css';
import { CartProvider } from './context/cart';
import '@aws-amplify/ui-react/styles.css';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <BookProvider>
    <CartProvider>
      <React.StrictMode>
          <App />
      </React.StrictMode>
    </CartProvider>
  </BookProvider>
);

