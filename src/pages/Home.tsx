import { Link } from 'react-router-dom'
import JsonLd from '../components/JsonLd'
import { getHomeSchema } from '../utils/seo'

export default function Home() {
  return (
    <>
      <JsonLd schema={getHomeSchema()} />
      <section className="hero">
        <div className="container">
          <span className="hero-badge">
            <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
            Privacy-First Browser Utilities
          </span>
          <h1>
            The Ultimate <span className="gradient-text">Utility Toolbox</span>
          </h1>
          <p>
            A fast, zero-tracking suite of developer and content tools that run 100% locally in your browser.
          </p>
        </div>
      </section>

      <section id="tools" className="container tools-section">
        <div className="tool-grid">
          {/* QR Generator */}
          <article className="tool-card">
            <div className="tool-icon">
              <i className="fa-solid fa-qrcode" aria-hidden="true"></i>
            </div>
            <h3>Advanced QR Generator</h3>
            <p>
              Create high-resolution SVG and PNG QR codes for URLs, WiFi networks, Contact Cards (vCard), Email, and SMS with custom colors.
            </p>
            <Link to="/qr-generator" className="btn btn-primary" aria-label="Open Advanced QR Generator tool">
              Open Tool
            </Link>
          </article>

          {/* Bold Text */}
          <article className="tool-card">
            <div className="tool-icon">
              <i className="fa-solid fa-bold" aria-hidden="true"></i>
            </div>
            <h3>Unicode Text Formatter</h3>
            <p>
              Transform plain text into bold, italic, script, gothic, and monospace Unicode styles ready to copy for social media posts.
            </p>
            <Link to="/text-formatter" className="btn btn-primary" aria-label="Open Unicode Text Formatter tool">
              Open Tool
            </Link>
          </article>

          {/* AI Text Humanizer */}
          <article className="tool-card">
            <div className="tool-icon">
              <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
            </div>
            <h3>AI Text Humanizer</h3>
            <p>
              Detect and normalize LLM typography quirks—including em-dashes, smart quotes, and hidden zero-width characters—in one click.
            </p>
            <Link to="/ai-text-humanizer" className="btn btn-primary" aria-label="Open AI Text Humanizer tool">
              Open Tool
            </Link>
          </article>

          {/* Password Generator */}
          <article className="tool-card">
            <div className="tool-icon">
              <i className="fa-solid fa-key" aria-hidden="true"></i>
            </div>
            <h3>Random Password Generator</h3>
            <p>
              Generate cryptographically secure passwords with custom length, character pools, and real-time entropy scoring in your browser.
            </p>
            <Link to="/password-generator" className="btn btn-primary" aria-label="Open Random Password Generator tool">
              Open Tool
            </Link>
          </article>

          {/* Placeholder for future tools */}
          <article className="tool-card tool-card-placeholder">
            <div className="tool-icon tool-icon-muted">
              <i className="fa-solid fa-plus" aria-hidden="true"></i>
            </div>
            <h3>More Utilities Coming Soon</h3>
            <p>
              New client-side tools are regularly added to help you format, inspect, and ship faster without leaving your browser.
            </p>
            <button className="btn btn-disabled" disabled>
              Stay Tuned
            </button>
          </article>
        </div>
      </section>
    </>
  )
}
