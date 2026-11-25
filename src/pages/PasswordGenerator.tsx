import { useCallback, useEffect, useState } from 'react'
import JsonLd from '../components/JsonLd'
import { getPasswordGeneratorSchema } from '../utils/seo'

const SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{};:,.<>?',
} as const

type SetKey = keyof typeof SETS

const SET_META: Record<SetKey, { title: string; icon: string; hint: string }> = {
  uppercase: { title: 'Uppercase', icon: 'fa-font', hint: '[A-Z]' },
  lowercase: { title: 'Lowercase', icon: 'fa-font', hint: '[a-z]' },
  numbers: { title: 'Numbers', icon: 'fa-hashtag', hint: '[0-9]' },
  symbols: { title: 'Symbols', icon: 'fa-percent', hint: '[!@#$…]' },
}

// Uniformly random index via rejection sampling (no modulo bias)
const randInt = (max: number): number => {
  const buf = new Uint32Array(1)
  const limit = Math.floor(0x100000000 / max) * max
  do {
    crypto.getRandomValues(buf)
  } while (buf[0] >= limit)
  return buf[0] % max
}

const generate = (length: number, selected: Record<SetKey, boolean>): string => {
  const pools = (Object.keys(SETS) as SetKey[]).filter((k) => selected[k]).map((k) => SETS[k])
  if (pools.length === 0 || length < pools.length) return ''
  const all = pools.join('')
  const chars = pools.map((p) => p[randInt(p.length)])
  while (chars.length < length) chars.push(all[randInt(all.length)])
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }
  return chars.join('')
}

const strengthOf = (password: string, poolSize: number) => {
  if (!password) return { label: '', segments: 0, color: '', entropy: 0 }
  const entropy = password.length * Math.log2(poolSize)
  if (entropy < 40) return { label: 'Weak', segments: 1, color: '#ef4444', entropy }
  if (entropy < 60) return { label: 'Medium', segments: 2, color: '#f59e0b', entropy }
  if (entropy < 80) return { label: 'Strong', segments: 3, color: '#22c55e', entropy }
  return { label: 'Very Strong', segments: 4, color: '#16a34a', entropy }
}

const charClass = (ch: string) => {
  if (/[0-9]/.test(ch)) return 'ch-digit'
  if (/[A-Za-z]/.test(ch)) return ''
  return 'ch-symbol'
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [selected, setSelected] = useState<Record<SetKey, boolean>>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [password, setPassword] = useState('')
  const [toast, setToast] = useState('')

  const poolSize = (Object.keys(SETS) as SetKey[]).filter((k) => selected[k])
    .reduce((n, k) => n + SETS[k].length, 0)
  const strength = strengthOf(password, poolSize)

  const regenerate = useCallback(() => {
    setPassword(generate(length, selected))
  }, [length, selected])

  useEffect(() => {
    regenerate()
  }, [regenerate])

  const copy = async () => {
    if (!password) return
    await navigator.clipboard.writeText(password)
    setToast('Password copied!')
    setTimeout(() => setToast(''), 3000)
  }

  const toggle = (key: SetKey) => setSelected({ ...selected, [key]: !selected[key] })

  return (
    <div className="container tool-container">
      <JsonLd schema={getPasswordGeneratorSchema()} />
      <div className="tool-header">
        <h1>Random <span className="gradient-text">Password Generator</span></h1>
        <p>Create strong, secure passwords in milliseconds — right in your browser.</p>
      </div>

      <div className="card">
        <div className="pw-output">
          <div className="pw-password" aria-live="polite">
            {password
              ? <span>{password.split('').map((ch, i) => <span key={i} className={charClass(ch)}>{ch}</span>)}</span>
              : <span className="pw-empty">Select at least one character type below</span>}
          </div>
          <div className="pw-output-actions">
            <button className="pw-btn-copy" onClick={copy} disabled={!password} aria-label="Copy password">
              <i className="fa-solid fa-copy" aria-hidden="true"></i> Copy
            </button>
            <button className="pw-btn-regen" onClick={regenerate} aria-label="Generate new password">
              <i className="fa-solid fa-rotate" aria-hidden="true"></i> Regenerate
            </button>
          </div>
          {strength.label && (
            <div className="pw-strength">
              <div className="pw-strength-bar" role="meter" aria-valuenow={strength.segments} aria-valuemin={0} aria-valuemax={4} aria-label={`Password strength: ${strength.label}`}>
                {[1, 2, 3, 4].map((seg) => (
                  <div key={seg} className="pw-strength-seg" style={seg <= strength.segments ? { background: strength.color } : undefined} />
                ))}
              </div>
              <div className="pw-strength-meta">
                <span className="pw-strength-label" style={{ color: strength.color }}>
                  <i className="fa-solid fa-shield-halved" aria-hidden="true"></i> {strength.label}
                </span>
                <span className="pw-strength-entropy">{Math.round(strength.entropy)} bits of entropy</span>
              </div>
            </div>
          )}
        </div>

        <h3 className="pw-section-title">Character types</h3>
        <div className="pw-options">
          {(Object.keys(SETS) as SetKey[]).map((key) => (
            <label key={key} className={`pw-toggle ${selected[key] ? 'on' : ''}`} htmlFor={`pw-${key}`}>
              <input type="checkbox" id={`pw-${key}`} checked={selected[key]} onChange={() => toggle(key)} />
              <span className="pw-toggle-info">
                <span className="pw-toggle-title">
                  <i className={`fa-solid ${SET_META[key].icon}`} aria-hidden="true"></i>&nbsp; {SET_META[key].title}
                </span>
                <span className="pw-toggle-hint">{SET_META[key].hint} ({SETS[key].length} chars)</span>
              </span>
            </label>
          ))}
        </div>

        <h3 className="pw-section-title">Length</h3>
        <div className="pw-length">
          <input
            id="pw-length"
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            aria-label="Password length"
          />
          <span className="pw-length-value">{length}</span>
        </div>

        <div className="pw-privacy">
          <i className="fa-solid fa-lock" aria-hidden="true"></i>
          Generated locally with crypto.getRandomValues — nothing is sent to any server.
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
