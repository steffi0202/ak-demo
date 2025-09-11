type Props = {
  onSchedule: () => void
  onStart: () => void
}

export default function Home({ onSchedule, onStart }: Props) {
  return (
    <section className="hero">
      <h1>Videosprechstunde</h1>
      <p>Kurz zwei Klicks: Termin anlegen oder direkt starten.</p>
      <div className="actions">
        <button className="btn btn-secondary" onClick={onSchedule}>📅 Videosprechstunde vereinbaren</button>
        <button className="btn btn-primary" onClick={onStart}>▶️ Videosprechstunde starten</button>
      </div>
    </section>
  )
}