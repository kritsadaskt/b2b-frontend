import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set CSS custom properties for background images
const base = import.meta.env.BASE_URL;
document.documentElement.style.setProperty('--bg-info-desktop', `url('${base}images/b2b-info-bg-d.webp')`);
document.documentElement.style.setProperty('--bg-info-mobile', `url('${base}images/b2b-info-bg-m.webp')`);
document.documentElement.style.setProperty('--bg-steps-desktop', `url('${base}images/steps-bg-desktop.webp')`);
document.documentElement.style.setProperty('--bg-steps-mobile', `url('${base}images/steps-bg-mobile.webp')`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
