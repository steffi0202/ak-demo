// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ScheduleDialog from './pages/ScheduleDialog'
import VideoSection from './pages/VideoSection'
import { BFF_BASE, IFRAME_ORIGIN, SCOPE_EMAIL } from './config'

function buildJoinUrl(callId: string, tidB64: string) {
  return `${IFRAME_ORIGIN}/video/${encodeURIComponent(callId)}?tid=${encodeURIComponent(tidB64)}`
}

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'content-type': 'application/json', ...(init?.headers || {}) },
    credentials: 'omit',
    ...init,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}${text ? ` – ${text}` : ''}`)
  }
  return res.json()
}

type CreatePayload = {
  tan_username: string
  tan_email?: string
  tan_phone?: string
  begin: number // Unix-Sekunden
}

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [lastCallId, setLastCallId] = useState<string | null>(null)
  const [joinUrl, setJoinUrl] = useState<string | null>(null)
  const hasCall = !!lastCallId

  // 1) Termin anlegen -> BFF /api/bff/calls (camelCase)
  async function createCall(payload: CreatePayload) {
    const base = BFF_BASE || ''
    const data = await jsonFetch<{ callId: string }>(`${base}/api/bff/calls`, {
      method: 'POST',
      body: JSON.stringify({
        forUserId: 212365,
        callType: 'tan',
        tanUsername: payload.tan_username,
        tanEmail: payload.tan_email,
        tanPhone: payload.tan_phone,
        tanDataAgreed: true,
        begin: payload.begin,
      }),
    })
    const id = String(data.callId)
    setLastCallId(id)
    return id
  }

  // 2) Starten -> BFF /api/bff/calls/:id/token { email } => { tokenB64 }
  async function startVideo() {
    if (!lastCallId) {
      alert('Bitte zuerst „Vereinbaren“ klicken.')
      return
    }
    const base = BFF_BASE || ''
    const data = await jsonFetch<{ tokenB64: string; joinUrl?: string }>(
      `${base}/api/bff/calls/${encodeURIComponent(lastCallId)}/token`,
      { method: 'POST', body: JSON.stringify({ email: SCOPE_EMAIL }) }
    )
    const url = data.joinUrl || buildJoinUrl(lastCallId, data.tokenB64)
    if (!url.startsWith(IFRAME_ORIGIN)) {
      alert('Ungültige Video-URL.')
      return
    }
    setJoinUrl(url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="container">
                  <Home onSchedule={() => setDialogOpen(true)} onStart={startVideo} hasCall={hasCall} />
                </div>

                <VideoSection
                  callId={lastCallId}
                  url={joinUrl}
                  onClose={() => {
                    setJoinUrl(null)
                    setLastCallId(null)
                  }}
                />
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
    </div>
  )
}