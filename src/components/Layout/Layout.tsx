import { Link, Outlet, useLocation } from 'react-router-dom'
import { ModeToggle } from '@/components/ui/mode-toggle'

const TOOL_LINKS = [
  { path: '/qr-generator', label: 'QR Code', icon: 'fa-qrcode' },
  { path: '/text-formatter', label: 'Text Formatter', icon: 'fa-bold' },
  { path: '/ai-text-humanizer', label: 'AI Humanizer', icon: 'fa-wand-magic-sparkles' },
  { path: '/password-generator', label: 'Password Gen', icon: 'fa-key' },
]

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="app-wrapper">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header>
        <div className="container nav-content">
          <Link to="/" className="brand-link" aria-label="QuickTools Home">
            <span className="brand-mark">QT</span>
            <span className="logo">
              QuickTools<span className="logo-dot">.</span>
            </span>
          </Link>

          <nav className="nav-pills" aria-label="Quick tool navigation">
            {TOOL_LINKS.map((tool) => {
              const isActive = location.pathname === tool.path
              return (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`nav-pill ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <i className={`fa-solid ${tool.icon}`} aria-hidden="true"></i>
                  <span>{tool.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="nav-controls">
            {!isHome && (
              <Link to="/" className="btn btn-secondary btn-nav-home">
                All Tools
              </Link>
            )}
            <ModeToggle />
          </div>
        </div>
      </header>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <p className="footer-text">
            &copy; {new Date().getFullYear()} QuickTools by{' '}
            <a
              href="https://bhandarisanjeev.com.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Sanjeev Bhandari (@realsanjeev)
            </a>
          </p>
          <nav className="footer-nav" aria-label="Footer navigation">
            {TOOL_LINKS.map((tool) => (
              <Link key={tool.path} to={tool.path}>
                {tool.label}
              </Link>
            ))}
            <a href="https://bhandarisanjeev.com.np/" target="_blank" rel="noopener noreferrer">
              Portfolio ↗
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
