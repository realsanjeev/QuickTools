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
    <div>
      <div className="page-header">
        <h2>Text Formatter</h2>
        <p>Transform your text with unicode characters</p>
      </div>

      <div className="tool-layout">
        <div className="tool-form">
          <h3>Input</h3>
          <div className="form-group">
            <label>Enter Text</label>
            <textarea
              className="form-input"
              placeholder="Type your text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="char-count">{charCount} characters</div>
          </div>

          <h3>Style</h3>
          <div className="style-buttons">
            {styleKeys.map((key) => (
              <button
                key={key}
                className={`style-btn ${selectedStyle === key ? 'active' : ''}`}
                onClick={() => setSelectedStyle(key)}
              >
                {styleNames[key]}
              </button>
            ))}
          </div>
        </div>

        <div className="preview-panel">
          <h3>Preview</h3>
          <div className="text-preview">
            {styledText || 'Your formatted text will appear here...'}
          </div>

          <div className="btn-group" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" onClick={copyToClipboard}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy to Clipboard
            </button>
          </div>

          <p style={{ marginTop: 20, fontSize: 13, color: '#6b7280' }}>
            Note: Some styles may not display correctly on all devices. 
            Unsupported characters will remain unstyled.
          </p>
        </div>
      </div>

      {toast && (
        <div className="toast success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  )
}