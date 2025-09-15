import { NavLink } from "react-router-dom"
import logo from "../assets/logo_large_web.svg"

export default function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        {/* 👉 Statt Text jetzt ein Bild */}
        <div className="logo">
          <img src={logo} alt="Arztkonsultation ak GmbH - Demo" className="logo-img" />
        </div>

        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          <NavLink to="/leistungen" className={({ isActive }) => isActive ? "active" : ""}>Leistungen</NavLink>
          <NavLink to="/kontakt" className={({ isActive }) => isActive ? "active" : ""}>Kontakt</NavLink>
        </nav>
      </div>
    </header>
  )
}