# ak-demo – Demo-Frontend für die Videosprechstunde

Ein schlankes React/Vite-Frontend, das Termine (Calls) anlegt, den Videocall startet und beim Event `CALL_CLOSED` das iFrame schließt.  
Das Frontend spricht **immer** mit der BFF (`ak-bff`), die Authentifizierung & Mapping übernimmt.

---

## Tech-Stack
- React + Vite + TypeScript
- HashRouter (für GitHub Pages)
- Eigenes CSS (keine UI-Framework-Abhängigkeit)



---

## Environments

### `.env.development`
```env
VITE_BFF_BASE=
VITE_IFRAME_ORIGIN=http://localhost:5173
VITE_SCOPE_EMAIL=peter.niemann+demo@arztkonsultation.de
```
- `VITE_BFF_BASE` bleibt **leer** → der Dev-Server proxyt auf die BFF.

### `.env.production`
```env
VITE_BFF_BASE=https://<deine-bff>.vercel.app
VITE_IFRAME_ORIGIN=https://demo.arztkonsultation.de
VITE_SCOPE_EMAIL=peter.niemann+demo@arztkonsultation.de
```

---

## Development & Build
```bash
# Node 18+ empfohlen
npm install

# lokaler Dev-Server (http://localhost:5173)
npm run dev

# Production-Build
npm run build

# Lokale Vorschau des Builds
npm run preview
```

---

## Proxy (Dev)
In `vite.config.ts` ist der Dev-Proxy auf die BFF konfiguriert:
```ts
server: {
  proxy: {
    '/api/bff': {
      target: 'https://<deine-bff>.vercel.app',
      changeOrigin: true,
      secure: true,
    },
  },
}
```

---

## Routing / Deployment (GitHub Pages)
- Es wird der **HashRouter** verwendet → funktioniert auch unter  
  `https://<user>.github.io/ak-demo/#/`.
- In `vite.config.ts` ist `base` auf `'/ak-demo/'` gesetzt, sobald `NODE_ENV=production`.

---

## iFrame-Events
Die App lauscht auf `window.postMessage`-Events aus dem iFrame.  
Bei `CALL_CLOSED` wird das iFrame geschlossen (State `joinUrl=null`).

