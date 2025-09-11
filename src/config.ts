// src/config.ts
export const BFF_BASE = import.meta.env.VITE_BFF_BASE as string; // z. B. "https://your-bff.example.com"
export const IFRAME_ORIGIN = 'https://demo.arztkonsultation.de';
export const SCOPE_EMAIL = import.meta.env.VITE_SCOPE_EMAIL as string; 

if (!BFF_BASE) console.warn('VITE_BFF_BASE ist nicht gesetzt – bitte .env.production konfigurieren!');
if (!SCOPE_EMAIL) console.warn('VITE_SCOPE_EMAIL ist nicht gesetzt – bitte .env.production konfigurieren!');