import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    console.log('🎯 DFCraft: Mounting React app...');
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } else {
    console.error('Root element not found!');
  }
});

// Also try immediate render in case DOM is already ready
const rootElement = document.getElementById('root');
if (rootElement) {
  console.log('🎯 DFCraft: Mounting React app immediately...');
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}