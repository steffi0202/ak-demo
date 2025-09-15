import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <strong>Arztkonsultation ak GmbH - Demo</strong>
        <nav className="nav">
          <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
          <a href="#!" onClick={(e)=>e.preventDefault()}>Leistungen</a>
          <a href="#!" onClick={(e)=>e.preventDefault()}>Kontakt</a>
        </nav>
      </div>
    </header>
  )
}