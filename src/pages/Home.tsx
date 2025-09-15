type Props = {
  onSchedule: () => void
  onStart: () => void
  hasCall: boolean
}

export default function Home({ onSchedule, onStart, hasCall }: Props) {
  return (
    <section className="hero">
      <h1>Videosprechstunde</h1>
      <p>Kurz zwei Klicks: Termin anlegen oder direkt starten.</p>
      <div className="actions">
        <button className="btn btn-primary" onClick={onSchedule}>
          📅 Videosprechstunde vereinbaren
        </button>

        {hasCall && (
          <button className="btn btn-secondary" onClick={onStart}>
            ▶️ Videosprechstunde starten
          </button>
        )}
      </div>
    </section>
  )
}