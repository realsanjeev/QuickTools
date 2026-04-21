import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>The Ultimate <span className="gradient-text">Utility Toolbox</span></h1>
          <p>A collection of high-quality, privacy-focused tools for your daily digital needs. No tracking, just
            speed.</p>
        </div>
      </section>

      <section id="tools" className="container" style={{ paddingBottom: '5rem' }}>
        <div className="tool-grid">
          {/* QR Generator */}
          <div className="tool-card">
            <div className="tool-icon">
              <i className="fa-solid fa-qrcode"></i>
            </div>
            <h3>Advanced QR Generator</h3>
            <p>Create professional QR codes for URLs, WiFi, Contact Cards, and more. Customize colors and add
              logos.</p>
            <Link to="/qr-generator" className="btn btn-primary" aria-label="Open Advanced QR Generator tool">Open Tool</Link>
          </div>

          {/* Bold Text */}
          <div className="tool-card">
            <div className="tool-icon">
              <i className="fa-solid fa-bold"></i>
            </div>
            <h3>Facebook Bold Text</h3>
            <p>Transform your text into bold, italic, and stylish Unicode fonts perfect for social media posts.
            </p>
            <Link to="/text-formatter" className="btn btn-primary" aria-label="Open Facebook Bold Text formatter tool">Open Tool</Link>
          </div>

          {/* Placeholder for future tools */}
          <div className="tool-card" style={{ opacity: 0.6, borderStyle: 'dashed' }}>
            <div className="tool-icon" style={{ background: '#e5e7eb', color: '#9ca3af' }}>
              <i className="fa-solid fa-plus"></i>
            </div>
            <h3>More Coming Soon</h3>
            <p>We are constantly adding new tools to help you work faster. Stay tuned for updates!</p>
            <button className="btn" disabled style={{ background: '#e5e7eb', color: '#9ca3af', cursor: 'not-allowed' }}>Stay
              Tuned</button>
          </div>
        </div>
      </section>
    </>
  )
}