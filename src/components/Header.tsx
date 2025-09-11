import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <strong>AK Healthcare</strong>
        <nav className="nav">
          <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink>
          <a href="#!" onClick={(e)=>e.preventDefault()}>Leistungen</a>
          <a href="#!" onClick={(e)=>e.preventDefault()}>Kontakt</a>
        </nav>
      </div>
    </header>
  )
}