import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <div className="home-intro">
        <h1>Welcome to QuickTools</h1>
        <p>
          A collection of useful utilities for everyday tasks. Generate QR codes, 
          style your text with unicode characters, and more.
        </p>
      </div>

      <div className="tools-grid">
        <Link to="/qr-generator" className="tool-card">
          <div className="tool-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="3" height="3" />
              <rect x="18" y="14" width="3" height="3" />
              <rect x="14" y="18" width="3" height="3" />
              <rect x="18" y="18" width="3" height="3" />
            </svg>
          </div>
          <h3>QR Code Generator</h3>
          <p>Create QR codes for URLs, text, emails, SMS, WiFi, and more. Customize colors and download as PNG or SVG.</p>
        </Link>

        <Link to="/text-formatter" className="tool-card">
          <div className="tool-card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7V4h16v3" />
              <path d="M9 20h6" />
              <path d="M12 4v16" />
            </svg>
          </div>
          <h3>Text Formatter</h3>
          <p>Transform your text with 15+ unicode styles. Copy to clipboard with one click.</p>
        </Link>
      </div>
    </div>
  )
}