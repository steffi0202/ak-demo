import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ScheduleDialog from './pages/ScheduleDialog'
import VideoSection from './pages/VideoSection'
import { BFF_BASE, IFRAME_ORIGIN, SCOPE_EMAIL } from './config'

// Basis-URL robust machen: trailing slashes entfernen -> vermeidet 308 Redirects -> vermeidet 405
const API_BASE = (BFF_BASE || '').replace(/\/+$/, '')

// baut https://demo.arztkonsultation.de/video/<callId>?tid=<tokenB64>
function buildJoinUrl(callId: string, tidB64: string) {
  return `${IFRAME_ORIGIN}/video/${encodeURIComponent(callId)}?tid=${encodeURIComponent(tidB64)}`
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  console.log('FETCH →', url, init?.method ?? 'GET') // Diagnose
  const res = await fetch(url, {
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
    credentials: 'omit', // keine Cookies mitschicken
    ...init,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('FETCH ERROR', res.status, res.statusText, text)
    throw new Error(`${res.status} ${res.statusText}${text ? ` – ${text}` : ''}`)
  }
  return res.json()
}

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [lastCallId, setLastCallId] = useState<string | null>(null)
  const [joinUrl, setJoinUrl] = useState<string | null>(null)

  // 1) Termin anlegen -> BFF /api/bff/calls => { callId }
  async function createCall(payload: { tan_username: string; tan_email?: string; tan_phone?: string }) {
    const body = {
      forUserId: 212365, // ggf. später dynamisch laden
      tanUsername: payload.tan_username,
      tanEmail: payload.tan_email,
      tanPhone: payload.tan_phone,
    }
    const data = await jsonFetch<{ callId: string }>(`${API_BASE}/api/bff/calls`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    setLastCallId(String(data.callId))
    return String(data.callId)
  }

  // 2) Starten -> BFF /api/bff/calls/:id/token { email } => { tokenB64 }
  async function startVideo() {
    if (!lastCallId) { alert('Bitte zuerst „Vereinbaren“ klicken.'); return }

    const data = await jsonFetch<{ tokenB64: string; joinUrl?: string }>(
      `${API_BASE}/api/bff/calls/${encodeURIComponent(lastCallId)}/token`,
      { method: 'POST', body: JSON.stringify({ email: SCOPE_EMAIL }) }
    )

    const url = data.joinUrl || buildJoinUrl(lastCallId, data.tokenB64)
    if (!url.startsWith(IFRAME_ORIGIN)) {
      alert('Ungültige Video-URL (Origin nicht erlaubt).')
      return
    }

    setJoinUrl(url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Header />

      <main className="container">
        <Routes>
          <Route path="/" element={
            <>
              <Home onSchedule={() => setDialogOpen(true)} onStart={startVideo} />
              <VideoSection callId={lastCallId} url={joinUrl} onClose={() => setJoinUrl(null)} />
            </>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />

      <ScheduleDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={createCall}
      />
    </>
  )
}