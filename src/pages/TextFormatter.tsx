import { useState, useMemo, memo } from 'react'
import { applyStyle, styleNames } from '../utils/unicodeStyles'
import JsonLd from '../components/JsonLd'
import { getTextFormatterSchema } from '../utils/seo'

const styleKeys = Object.keys(styleNames) as string[]

const CATEGORIES = {
  ALL: 'All',
  BOLD: 'Bold',
  ITALIC: 'Italic',
  DECORATIVE: 'Decorative',
  SYSTEM: 'System',
}

const CATEGORY_MAP: Record<string, string[]> = {
  [CATEGORIES.BOLD]: ['bold-serif', 'bold-sans', 'bold-italic-serif', 'bold-italic-sans', 'bold-script', 'gothic-bold'],
  [CATEGORIES.ITALIC]: ['italic-serif', 'italic-sans', 'bold-italic-serif', 'bold-italic-sans'],
  [CATEGORIES.DECORATIVE]: ['script', 'bold-script', 'double-struck', 'gothic', 'gothic-bold', 'bubble', 'square', 'circled', 'squared', 'squared-negative', 'circled-negative', 'fraktur'],
  [CATEGORIES.SYSTEM]: ['monospace', 'small-caps', 'superscript', 'subscript', 'underline', 'strikethrough'],
}

interface ResultItemProps {
  styleName: string
  styledText: string
  onCopy: (text: string) => void
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

    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast('Copied to clipboard!')
      })
      .catch(() => {
        showToast('Failed to copy!')
      })
  }

  const filteredStyleKeys = useMemo(() => {
    let keys = styleKeys

    if (activeCategory !== CATEGORIES.ALL) {
      keys = CATEGORY_MAP[activeCategory] || []
    }

    if (searchQuery) {
      keys = keys.filter(
        (key) =>
          styleNames[key].toLowerCase().includes(searchQuery.toLowerCase()) ||
          key.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return keys
  }, [activeCategory, searchQuery])

  return (
    <div className="container tool-container">
      <JsonLd schema={getTextFormatterSchema()} />
      <div className="tool-header">
        <h1>
          Unicode <span className="gradient-text">Text Formatter</span>
        </h1>
        <p>Transform your text with expressive Unicode styles for social media and profiles.</p>
      </div>

      <div className="card">
        <div className="form-group">
          <label htmlFor="inputText" className="label-row">
            <span>Enter Your Text</span>
            <span className="char-counter">{inputText.length} characters</span>
          </label>
          <textarea
            id="inputText"
            className="textarea-lg"
            rows={3}
            placeholder="Type or paste your text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            aria-label="Input text to format"
          />
        </div>

        <div className="formatter-toolbar">
          <div className="tabs" role="tablist" aria-label="Unicode style categories">
            {Object.values(CATEGORIES).map((cat) => (
              <button
                key={cat}
                className={`tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                role="tab"
                aria-selected={activeCategory === cat}
                aria-controls="results-grid"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="search-input-wrapper">
            <input
              type="text"
              id="searchStyles"
              placeholder="Search styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search formatting styles"
            />
            <i className="fa-solid fa-search" aria-hidden="true"></i>
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
          <div className="empty-state">
            <i className="fa-solid fa-search" aria-hidden="true"></i>
            <p>No styles found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {toast && (
        <div className="toast" role="alert">
          <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
          {toast}
        </div>
      )}
    </div>
  )
}
