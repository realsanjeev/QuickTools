import { useState, useCallback } from 'react'
import { applyStyle, styleNames } from '../utils/unicodeStyles'

const styleKeys = Object.keys(styleNames) as string[]

export default function TextFormatter() {
  const [inputText, setInputText] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('bold-sans')
  const [toast, setToast] = useState('')

  const styledText = useCallback(() => {
    if (!inputText) return ''
    return applyStyle(inputText, selectedStyle)
  }, [inputText, selectedStyle])()

  const charCount = inputText.length

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  const copyToClipboard = async () => {
    if (!styledText) {
      showToast('Nothing to copy!')
      return
    }

    try {
      await navigator.clipboard.writeText(styledText)
      showToast('Copied to clipboard!')
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = styledText
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      showToast('Copied to clipboard!')
    }
  }

  return (
    <div className="container tool-container">
      <div className="tool-header">
        <h1>Text <span className="gradient-text">Formatter</span></h1>
        <p>Transform your text with professional unicode styles for social media.</p>
      </div>

      <div className="card">
        <div className="qr-section">
          <div className="qr-inputs">
            <h3>Input</h3>
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label>Enter Text</label>
              <textarea
                rows={5}
                placeholder="Type your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                {charCount} characters
              </div>
            </div>

            <h3>Select Style</h3>
            <div className="tabs" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
              {styleKeys.map((key) => (
                <button
                  key={key}
                  className={`tab ${selectedStyle === key ? 'active' : ''}`}
                  onClick={() => setSelectedStyle(key)}
                  style={{ marginBottom: '0.5rem' }}
                >
                  {styleNames[key]}
                </button>
              ))}
            </div>
          </div>

          <div className="qr-preview-container">
            <h3>Preview</h3>
            <div style={{ 
              width: '100%', 
              background: '#f9fafb', 
              padding: '1.5rem', 
              borderRadius: 'var(--radius-lg)', 
              minHeight: '150px',
              marginTop: '1rem',
              border: '1px solid var(--border-color)',
              wordBreak: 'break-word',
              fontSize: '1.25rem'
            }}>
              {styledText || <span style={{ color: 'var(--text-muted)' }}>Your styled text will appear here...</span>}
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={copyToClipboard}>
              <i className="fa-solid fa-copy"></i> &nbsp; Copy to Clipboard
            </button>
          </div>
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