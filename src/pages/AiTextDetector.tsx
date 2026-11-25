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
  "\u202F": " ", // narrow no-break space
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
    "\u202F": "[U+202F Narrow No-break Space]",
  }
  return displayNames[key] || key
}

const getDisplayValue = (val: string) => {
  if (val === "") return "[Removed]"
  if (val === " ") return "[Space]"
  return val
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

    const sortedKeys = Object.keys(aiReplacements).sort((a, b) => b.length - a.length)

    for (const key of sortedKeys) {
      const isPunctuation = /^[^\w]+$/.test(key)
      const regexStr = isPunctuation ? key : `\\b${key}\\b`
      const regex = new RegExp(regexStr, 'gi')

      const matches = result.match(regex)
      if (matches) {
        counts[key] = matches.length
        total += matches.length
        result = result.replace(regex, (match) => {
          const replacement = aiReplacements[key]
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

    navigator.clipboard
      .writeText(outputText)
      .then(() => {
        showToast('Copied to clipboard!')
      })
      .catch(() => {
        showToast('Failed to copy!')
      })
  }

  return (
    <div className="container tool-container">
      <JsonLd schema={getAiTextHumanizerSchema()} />
      <div className="tool-header">
        <h1>
          AI Text <span className="gradient-text">Humanizer</span>
        </h1>
        <p>
          Detect and replace common LLM formatting quirks (em-dashes, curly quotes, and zero-width spaces) to make text clean.
        </p>
      </div>

      <div className="card">
        <div className="form-group">
          <label htmlFor="inputText" className="label-row">
            <span>Input AI-Generated Text</span>
            <span className="char-counter">{inputText.length} characters</span>
          </label>
          <textarea
            id="inputText"
            rows={6}
            placeholder="Paste your AI-generated text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {totalReplacementsCount > 0 && (
          <div className="quirk-banner" role="status">
            <div className="quirk-banner-title">
              <strong>{totalReplacementsCount}</strong> formatting quirk(s) detected and normalized:
            </div>
            <ul className="quirk-list">
              {Object.entries(replacementCounts).map(([key, count]) => (
                <li key={key}>
                  <code className="inline-code">{getDisplayKey(key)}</code> : <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="outputText" className="label-row">
            <span>Cleaned &amp; Humanized Output</span>
          </label>
          <textarea
            id="outputText"
            className="textarea-readonly"
            rows={6}
            readOnly
            value={outputText}
            placeholder="Normalized text will appear here..."
          />
        </div>

        <button className="btn btn-primary btn-block" onClick={copyToClipboard}>
          <i className="fa-solid fa-copy" aria-hidden="true"></i>
          <span>Copy Humanized Text</span>
        </button>
      </div>

      <div className="card info-card">
        <h3>
          <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
          <span>About This Tool</span>
        </h3>
        <p>
          <strong>How it works:</strong> Large Language Models frequently emit typographic em-dashes, smart quotes, non-breaking spaces, and invisible zero-width Unicode markers. This tool strips and normalizes those artifacts locally in your browser.
        </p>

        <h4>Replacement Rules</h4>
        <div className="rules-table-wrapper">
          <table className="rules-table">
            <thead>
              <tr>
                <th>Detected Symbol</th>
                <th>Action / Replacement</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(aiReplacements).map(([key, value]) => (
                <tr key={key}>
                  <td>
                    <code className="inline-code">{getDisplayKey(key)}</code>
                  </td>
                  <td>
                    <code className="inline-code">{getDisplayValue(value)}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
