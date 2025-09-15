// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ScheduleDialog from './pages/ScheduleDialog'
import VideoSection from './pages/VideoSection'
import { BFF_BASE, IFRAME_ORIGIN, SCOPE_EMAIL } from './config'

const API_BASE = (BFF_BASE || '').replace(/\/+$/, '')
function buildJoinUrl(callId: string, tidB64: string) {
  return `${IFRAME_ORIGIN}/video/${encodeURIComponent(callId)}?tid=${encodeURIComponent(tidB64)}`
}
async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
    credentials: 'omit',
    ...init,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} – ${await res.text().catch(()=>'')}`)
  return res.json()
}

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [lastCallId, setLastCallId] = useState<string | null>(null)
  const [joinUrl, setJoinUrl] = useState<string | null>(null)
  const hasCall = !!lastCallId;

  async function createCall(payload: { tan_username: string; tan_email?: string; tan_phone?: string }) {
    const data = await jsonFetch<{ callId: string }>(`${API_BASE}/api/bff/calls`, {
      method: 'POST',
      body: JSON.stringify({
        forUserId: 212365,
        tanUsername: payload.tan_username,
        tanEmail: payload.tan_email,
        tanPhone: payload.tan_phone,
      }),
    })
    const id = String(data.callId)
    setLastCallId(id)
    return id
  }

  async function startVideo() {
    if (!lastCallId) { alert('Bitte zuerst „Vereinbaren“ klicken.'); return }
    const data = await jsonFetch<{ tokenB64: string; joinUrl?: string }>(
      `${API_BASE}/api/bff/calls/${encodeURIComponent(lastCallId)}/token`,
      { method: 'POST', body: JSON.stringify({ email: SCOPE_EMAIL }) }
    )
    const url = data.joinUrl || buildJoinUrl(lastCallId, data.tokenB64)
    if (!url.startsWith(IFRAME_ORIGIN)) { alert('Ungültige Video-URL.'); return }
    setJoinUrl(url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Home bleibt schmal in der Container-Breite */}
                <div className="container">
                  <Home onSchedule={() => setDialogOpen(true)} onStart={startVideo} hasCall={hasCall} />
                  
                </div>

                {/* Video ist full-width und unabhängig von .container */}
                <VideoSection callId={lastCallId} url={joinUrl} />
              </>
            }
          />
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