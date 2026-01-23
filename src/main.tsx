import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set CSS custom properties for background images
document.documentElement.style.setProperty('--bg-info-desktop', `url('/images/b2b-info-bg-d.webp')`);
document.documentElement.style.setProperty('--bg-info-mobile', `url('/images/b2b-info-bg-m.webp')`);
document.documentElement.style.setProperty('--bg-steps-desktop', `url('/images/steps-bg-desktop.webp')`);
document.documentElement.style.setProperty('--bg-steps-mobile', `url('/images/steps-bg-mobile.webp')`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
