import { useState } from 'react'
import { applyStyle, styleNames } from '../utils/unicodeStyles'

const styleKeys = Object.keys(styleNames) as string[]

export default function TextFormatter() {
  const [inputText, setInputText] = useState('Hello World!')
  const [toast, setToast] = useState('')

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  const copyToClipboard = async (text: string) => {
    if (!text) {
      showToast('Nothing to copy!')
      return
    }

    await navigator.clipboard.writeText(text)
    showToast('Copied to clipboard!')
  }

  return (
    <div className="container tool-container">
      <div className="tool-header">
        <h1>Text <span className="gradient-text">Formatter</span></h1>
        <p>Transform your text with professional unicode styles for social media.</p>
      </div>

      <div className="card">
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label>Enter Your Text</label>
          <textarea
            rows={4}
            placeholder="Type or paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ fontSize: '1.25rem', padding: '1rem' }}
          />
          <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {inputText.length} characters
          </div>
        </div>

        <div className="results-grid">
          {styleKeys.map((key) => {
            const styledText = applyStyle(inputText || 'Sample Text', key)
            return (
              <div key={key} className="result-item">
                <div style={{ flex: 1, marginRight: '1rem' }}>
                  <span className="style-label">{styleNames[key]}</span>
                  <div className="result-text">{styledText}</div>
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={() => copyToClipboard(styledText)}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <i className="fa-solid fa-copy"></i> &nbsp; Copy
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  )
}