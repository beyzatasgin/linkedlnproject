import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/feed" className="navbar-brand">
          in
        </Link>
        {isAuthenticated ? (
          <div className="navbar-links">
            <Link to="/feed" className="nav-link">Akış</Link>
            <Link to="/connections" className="nav-link">Bağlantılar</Link>
            <Link to="/profile" className="nav-link">Profilim</Link>
            <span className="nav-user">@{user?.username}</span>
            <button onClick={handleLogout} className="btn-logout">
              Çıkış
            </button>
          </div>
        ) : (
          <div className="navbar-links">
            <Link to="/login" className="btn-ghost">Giriş</Link>
            <Link to="/register" className="btn-primary">Kayıt Ol</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

