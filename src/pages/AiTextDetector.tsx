import { useState, useMemo } from 'react'
import JsonLd from '../components/JsonLd'
import { getAiTextHumanizerSchema } from '../utils/seo'

const aiReplacements: Record<string, string> = {
  "—": "-", // em dash
  "–": "-", // en dash
  "‒": "-", // figure dash
  "―": "-", // horizontal bar
  "“": '"', // left double quote
  "”": '"', // right double quote
  "‘": "'", // left single quote
  "’": "'", // right single quote
  "…": "...", // ellipsis
  "\u200B": "", // zero-width space
  "\u200C": "", // zero-width non-joiner
  "\u200D": "", // zero-width joiner
  "\uFEFF": "", // zero-width no-break space
  "\u00A0": " ", // no-break space
  "\u202F": " " // narrow no-break space
}

const getDisplayKey = (key: string) => {
  const displayNames: Record<string, string> = {
    "—": "— (U+2014 Em Dash)",
    "–": "– (U+2013 En Dash)",
    "‒": "‒ (U+2012 Figure Dash)",
    "―": "― (U+2015 Horizontal Bar)",
    "“": "“ (U+201C Left Double Quote)",
    "”": "” (U+201D Right Double Quote)",
    "‘": "‘ (U+2018 Left Single Quote)",
    "’": "’ (U+2019 Right Single Quote)",
    "…": "… (U+2026 Ellipsis)",
    "\u200B": "[U+200B Zero-width Space]",
    "\u200C": "[U+200C Zero-width Non-joiner]",
    "\u200D": "[U+200D Zero-width Joiner]",
    "\uFEFF": "[U+FEFF Zero-width No-break Space]",
    "\u00A0": "[U+00A0 No-break Space]",
    "\u202F": "[U+202F Narrow No-break Space]"
  };
  return displayNames[key] || key;
}

const getDisplayValue = (val: string) => {
  if (val === "") return "[Removed]";
  if (val === " ") return "[Space]";
  return val;
}

export default function AiTextDetector() {
  const [inputText, setInputText] = useState('')
  const [toast, setToast] = useState('')

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  const { outputText, replacementCounts, totalReplacementsCount } = useMemo(() => {
    if (!inputText) return { outputText: '', replacementCounts: {}, totalReplacementsCount: 0 }
    
    let result = inputText
    const counts: Record<string, number> = {}
    let total = 0
    
    // Sort keys by length descending so longer phrases get replaced first
    const sortedKeys = Object.keys(aiReplacements).sort((a, b) => b.length - a.length)
    
    for (const key of sortedKeys) {
      // Use direct match for non-word characters (punctuation, spaces, zero-width chars)
      const isPunctuation = /^[^\w]+$/.test(key)
      
      // Use word boundaries for words, but not for punctuation like dashes
      const regexStr = isPunctuation ? key : `\\b${key}\\b`
      const regex = new RegExp(regexStr, 'gi')
      
      const matches = result.match(regex)
      if (matches) {
        counts[key] = matches.length
        total += matches.length
        result = result.replace(regex, (match) => {
          const replacement = aiReplacements[key]
          // Simple capitalization preservation for the first letter if it's a word
          if (!isPunctuation && match.charAt(0) === match.charAt(0).toUpperCase()) {
            return replacement.charAt(0).toUpperCase() + replacement.slice(1)
          }
          return replacement
        })
      }
    }
    
    return { outputText: result, replacementCounts: counts, totalReplacementsCount: total }
  }, [inputText])

  const copyToClipboard = () => {
    if (!outputText) {
      showToast('Nothing to copy!')
      return
    }

    navigator.clipboard.writeText(outputText).then(() => {
      showToast('Copied to clipboard!')
    }).catch(() => {
      showToast('Failed to copy!')
    })
  }

  return (
    <div className="container tool-container">
      <JsonLd schema={getAiTextHumanizerSchema()} />
      <div className="tool-header">
        <h1>AI Text <span className="gradient-text">Humanizer</span></h1>
        <p>Detect and replace common LLM formatting quirks (like em-dashes and zero-width spaces) to make text cleaner.</p>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="inputText" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Input AI Generated Text
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
              {inputText.length} characters
            </span>
          </label>
          <textarea
            id="inputText"
            rows={6}
            placeholder="Paste your AI-generated text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ fontSize: '1rem', padding: '1.25rem', borderRadius: 'var(--radius-lg)' }}
          />
        </div>

        {totalReplacementsCount > 0 && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>{totalReplacementsCount}</strong> formatting quirk(s) detected and replaced:
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {Object.entries(replacementCounts).map(([key, count]) => (
                <li key={key}>
                  <code style={{ background: 'var(--bg-primary)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{getDisplayKey(key)}</code> : <strong>{count as React.ReactNode}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <label htmlFor="outputText" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Humanized Output
          </label>
          <textarea
            id="outputText"
            rows={6}
            readOnly
            value={outputText}
            placeholder="Humanized text will appear here..."
            style={{ fontSize: '1rem', padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', cursor: 'text' }}
          />
        </div>

        <button 
          className="btn btn-primary" 
          onClick={copyToClipboard}
          style={{ width: '100%' }}
        >
          <i className="fa-solid fa-copy"></i> Copy Humanized Text
        </button>
      </div>

      <div className="card info-card" style={{ marginBottom: '2rem', background: 'var(--bg-secondary)', borderLeft: '4px solid var(--primary)' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fa-solid fa-circle-info"></i> About This Tool
        </h3>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          <strong>Disclaimer:</strong> This tool focuses on cleaning up formatting and typographical artifacts frequently generated by AI models. AI models tend to overuse specific dashes, smart quotes, and even inject invisible zero-width characters into their responses. This tool safely strips out or normalizes those hidden markers and quirky punctuation.
        </p>
        
        <h4 style={{ marginBottom: '0.5rem' }}>Replacement Rules:</h4>
        <div style={{ maxHeight: '250px', overflowY: 'auto', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', zIndex: 1 }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Detected Symbol</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Action / Replacement</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(aiReplacements).map(([key, value]) => (
                <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <code style={{ background: 'var(--bg-secondary)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{getDisplayKey(key)}</code>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <code style={{ background: 'var(--bg-secondary)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{getDisplayValue(value)}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="toast" role="alert">
          {toast}
        </div>
      )}
    </div>
  )
}
