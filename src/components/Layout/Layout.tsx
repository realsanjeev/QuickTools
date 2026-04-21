import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="app-wrapper">
      <header>
        <div className="container nav-content">
          <Link to="/" className="logo">QuickTools</Link>
          <nav>
            {isHome ? (
              <a href="#tools" className="btn">Browse Tools</a>
            ) : (
              <Link to="/" className="btn">Back to Home</Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <p className="footer-text">
            &copy; 2026 QuickTools by <a href="https://bhandarisanjeev.com.np/"
              target="_blank" rel="noopener noreferrer" className="footer-link">(@RealSanjeev) Sanjeev Bhandari</a>
          </p>
        </div>
      </footer>
    </div>
  )
}