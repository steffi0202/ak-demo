export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} AK Healthcare</span>
        <nav className="nav">
          <a href="#!" onClick={(e)=>e.preventDefault()}>Impressum</a>
          <a href="#!" onClick={(e)=>e.preventDefault()}>Datenschutz</a>
          <a href="#!" onClick={(e)=>e.preventDefault()}>Kontakt</a>
        </nav>
      </div>
    </footer>
  )
}