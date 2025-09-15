export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} Arztkonsultation ak GmbH</span>
        <nav className="nav">
          <a href="https://arztkonsultation.de/impressum/" onClick={(e)=>e.preventDefault()}>Impressum</a>
          <a href="https://arztkonsultation.de/datenschutz/" onClick={(e)=>e.preventDefault()}>Datenschutz</a>
          <a href="https://arztkonsultation.de/" onClick={(e)=>e.preventDefault()}>Kontakt</a>
        </nav>
      </div>
    </footer>
  )
}