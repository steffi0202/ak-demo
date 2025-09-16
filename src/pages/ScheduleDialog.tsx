import { useRef, useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onCreate: (payload: {
    tan_username: string
    tan_email?: string
    tan_phone?: string
    begin: number
  }) => Promise<string>
}

export default function ScheduleDialog({ open, onClose, onCreate }: Props) {
  const dlgRef = useRef<HTMLDialogElement>(null)
  const [msg, setMsg] = useState<string>('')

  if (open && dlgRef.current && !dlgRef.current.open) dlgRef.current.showModal()
  if (!open && dlgRef.current?.open) dlgRef.current.close()

  // optional: default jetzt+30min gerundet auf 5min für das Input
  function defaultBeginLocal() {
    const d = new Date()
    d.setMinutes(d.getMinutes() + 30)
    d.setSeconds(0, 0)
    const m = d.getMinutes()
    d.setMinutes(m - (m % 5)) // auf 5-Minuten runden
    const pad = (n: number) => String(n).padStart(2, '0')
    const yyyy = d.getFullYear()
    const mm = pad(d.getMonth() + 1)
    const dd = pad(d.getDate())
    const hh = pad(d.getHours())
    const mi = pad(d.getMinutes())
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg('Lege Termin an…')

    const fd = new FormData(e.currentTarget)
    const tan_username = String(fd.get('tan_username') || '').trim()
    const tan_email = String(fd.get('tan_email') || '').trim() || undefined
    const tan_phone = String(fd.get('tan_phone') || '').trim() || undefined

    const beginStr = String(fd.get('begin') || '').trim()
    // WICHTIG: datetime-local ist **lokal** (z.B. Europe/Berlin). new Date() interpretiert das korrekt als lokale Zeit.
    const beginDate = beginStr ? new Date(beginStr) : null
    const begin = beginDate ? Math.floor(beginDate.getTime() / 1000) : NaN

    if (!tan_username) { setMsg('Bitte Patientenname angeben.'); return }
    if (!beginStr || !isFinite(begin)) { setMsg('Bitte gültigen Terminbeginn wählen.'); return }

    try {
      const callId = await onCreate({ tan_username, tan_email, tan_phone, begin })
      setMsg(`Call erstellt (ID: ${callId}).`)
      setTimeout(onClose, 700)
    } catch (err: any) {
      console.error(err)
      setMsg(`Fehler beim Anlegen: ${err?.message ?? 'unbekannt'}`)
    }
  }

  return (
    <dialog ref={dlgRef} className="dialog" onClose={onClose}>
      <form method="dialog" onSubmit={handleSubmit} className="dialog-content">
        <h3>Videosprechstunde vereinbaren</h3>

        <div className="grid">
          <label className="field">
            <span>Patientenname (TAN Username)</span>
            <input name="tan_username" required placeholder="z. B. Max Mustermann" />
          </label>

          <label className="field">
            <span>Terminbeginn</span>
            <input
              type="datetime-local"
              name="begin"
              required
              defaultValue={defaultBeginLocal()}
              step={300} /* 5-Minuten-Schritte */
            />
          </label>

          <label className="field">
            <span>E-Mail (optional)</span>
            <input type="email" name="tan_email" placeholder="max@mustermann.de" />
          </label>

          <label className="field">
            <span>Telefon (optional, +49…)</span>
            <input name="tan_phone" placeholder="+491234567890" />
          </label>
        </div>

        <div className="dialog-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary">Anlegen</button>
        </div>

        <p className="muted">{msg}</p>
      </form>
    </dialog>
  )
}