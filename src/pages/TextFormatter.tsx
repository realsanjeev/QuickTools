import { useState, useMemo, memo } from 'react'
import { applyStyle, styleNames } from '../utils/unicodeStyles'

const styleKeys = Object.keys(styleNames) as string[]

const CATEGORIES = {
  ALL: 'All',
  BOLD: 'Bold',
  ITALIC: 'Italic',
  DECORATIVE: 'Decorative',
  SYSTEM: 'System'
}

const CATEGORY_MAP: Record<string, string[]> = {
  [CATEGORIES.BOLD]: ['bold-serif', 'bold-sans', 'bold-italic-serif', 'bold-italic-sans', 'bold-script', 'gothic-bold'],
  [CATEGORIES.ITALIC]: ['italic-serif', 'italic-sans', 'bold-italic-serif', 'bold-italic-sans'],
  [CATEGORIES.DECORATIVE]: ['script', 'bold-script', 'double-struck', 'gothic', 'gothic-bold', 'bubble', 'square', 'circled', 'squared', 'squared-negative', 'circled-negative', 'fraktur'],
  [CATEGORIES.SYSTEM]: ['monospace', 'small-caps', 'superscript', 'subscript', 'underline', 'strikethrough']
}

interface ResultItemProps {
  styleName: string;
  styledText: string;
  onCopy: (text: string) => void;
}

const ResultItem = memo(({ styleName, styledText, onCopy }: ResultItemProps) => (
  <div className="result-item">
    <span className="style-label">{styleName}</span>
    <div className="result-text">{styledText}</div>
    <button 
      className="btn-copy-mini" 
      onClick={() => onCopy(styledText)}
      aria-label={`Copy text in ${styleName} style`}
    >
      <i className="fa-solid fa-copy" aria-hidden="true"></i> Copy
    </button>
  </div>
))

export default function TextFormatter() {
  const [inputText, setInputText] = useState('Hello World!')
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.ALL)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  const copyToClipboard = (text: string) => {
    if (!text) {
      showToast('Nothing to copy!')
      return
    }

    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!')
    }).catch(() => {
      showToast('Failed to copy!')
    })
  }

  const filteredStyleKeys = useMemo(() => {
    let keys = styleKeys

    if (activeCategory !== CATEGORIES.ALL) {
      keys = CATEGORY_MAP[activeCategory] || []
    }

    if (searchQuery) {
      keys = keys.filter(key => 
        styleNames[key].toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return keys
  }, [activeCategory, searchQuery])

  return (
    <div className="container tool-container">
      <div className="tool-header">
        <h1>Text <span className="gradient-text">Formatter</span></h1>
        <p>Transform your text with professional unicode styles for social media.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="inputText" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Enter Your Text
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
              {inputText.length} characters
            </span>
          </label>
          <textarea
            id="inputText"
            rows={3}
            placeholder="Type or paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ fontSize: '1.25rem', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}
            aria-label="Input text to format"
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="tabs-container" role="tablist" style={{ margin: 0, padding: 0 }}>
            {Object.values(CATEGORIES).map(cat => (
              <button
                key={cat}
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                role="tab"
                aria-selected={activeCategory === cat}
                aria-controls="results-grid"
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
            <input
              type="text"
              id="searchStyles"
              placeholder="Search styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', borderRadius: '100px', fontSize: '0.9rem' }}
              aria-label="Search formatting styles"
            />
            <i className="fa-solid fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} aria-hidden="true"></i>
          </div>
        </div>
      </div>

      <div id="results-grid" className="results-grid" role="region" aria-live="polite">
        {filteredStyleKeys.length > 0 ? (
          filteredStyleKeys.map((key) => (
            <ResultItem 
              key={key}
              styleName={styleNames[key]}
              styledText={applyStyle(inputText || 'Sample Text', key)}
              onCopy={copyToClipboard}
            />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-search" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }} aria-hidden="true"></i>
            <p>No styles found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {toast && (
        <div className="toast" role="alert">
          {toast}
        </div>
      )}
    </div>
  )
}