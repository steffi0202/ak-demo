import { useRef, useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onCreate: (payload: { tan_username: string; tan_email?: string; tan_phone?: string }) => Promise<string>
}

export default function ScheduleDialog({ open, onClose, onCreate }: Props) {
  const dlgRef = useRef<HTMLDialogElement>(null)
  const [msg, setMsg] = useState<string>('')

  if (open && dlgRef.current && !dlgRef.current.open) dlgRef.current.showModal()
  if (!open && dlgRef.current?.open) dlgRef.current.close()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg('Lege Termin an…')

    const fd = new FormData(e.currentTarget)
    const tan_username = String(fd.get('tan_username') || '').trim()
    const tan_email = String(fd.get('tan_email') || '').trim() || undefined
    const tan_phone = String(fd.get('tan_phone') || '').trim() || undefined
    if (!tan_username) { setMsg('Bitte Patientenname angeben.'); return }

    try {
      const callId = await onCreate({ tan_username, tan_email, tan_phone })
      setMsg(`Call erstellt (ID: ${callId}).`)
      setTimeout(onClose, 700)
   } catch (err: any) {
  console.error(err);
  setMsg(`Fehler beim Anlegen: ${err?.message ?? 'unbekannt'}`);
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