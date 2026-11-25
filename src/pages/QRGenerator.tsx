import { useState, useEffect, useCallback } from 'react'
import * as QRCode from 'qrcode'
import JsonLd from '../components/JsonLd'
import { getQrGeneratorSchema } from '../utils/seo'

type QRType = 'url' | 'text' | 'email' | 'sms' | 'wifi' | 'vcard'

export default function QRGenerator() {
  const [qrType, setQrType] = useState<QRType>('url')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(256)
  const [errorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [toast, setToast] = useState('')
  const [qrSvgUrl, setQrSvgUrl] = useState('')

  const [formData, setFormData] = useState({
    url: '',
    text: '',
    email: '',
    emailSubject: '',
    emailBody: '',
    smsNumber: '',
    smsMessage: '',
    wifiSSID: '',
    wifiPassword: '',
    wifiEncryption: 'WPA',
    vcardName: '',
    vcardPhone: '',
    vcardEmail: '',
    vcardOrg: '',
    vcardTitle: '',
  })

  const generateQRData = useCallback(() => {
    switch (qrType) {
      case 'url':
        return formData.url || 'https://bhandarisanjeev.com.np'
      case 'text':
        return formData.text || 'Hello World'
      case 'email':
        return `mailto:${formData.email}${formData.emailSubject ? `?subject=${encodeURIComponent(formData.emailSubject)}` : ''}${formData.emailBody ? `&body=${encodeURIComponent(formData.emailBody)}` : ''}`
      case 'sms':
        return `sms:${formData.smsNumber}${formData.smsMessage ? `?body=${encodeURIComponent(formData.smsMessage)}` : ''}`
      case 'wifi': {
        const escape = (str: string) => str.replace(/([\\;":])/g, '\\$1')
        return `WIFI:T:${formData.wifiEncryption};S:${escape(formData.wifiSSID)};P:${escape(formData.wifiPassword)};;`
      }
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
FN:${formData.vcardName}
TEL:${formData.vcardPhone}
EMAIL:${formData.vcardEmail}
ORG:${formData.vcardOrg}
TITLE:${formData.vcardTitle}
END:VCARD`
      default:
        return 'https://bhandarisanjeev.com.np'
    }
  }, [qrType, formData])

  const qrData = generateQRData()

  useEffect(() => {
    let active = true
    let currentSvgUrl = ''

    const generateSvg = async () => {
      try {
        const svg = await QRCode.toString(qrData, {
          type: 'svg',
          width: size,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: errorLevel,
        })

        const newUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))

        if (!active) {
          URL.revokeObjectURL(newUrl)
          return
        }

        currentSvgUrl = newUrl
        setQrSvgUrl(currentSvgUrl)
      } catch (err) {
        if (active) {
          console.error('QR generation error:', err)
        }
      }
    }

    generateSvg()
    return () => {
      active = false
      if (currentSvgUrl) URL.revokeObjectURL(currentSvgUrl)
    }
  }, [qrData, size, fgColor, bgColor, errorLevel])

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(''), 3000)
  }

  const downloadSVG = () => {
    if (!qrSvgUrl) return
    const link = document.createElement('a')
    link.href = qrSvgUrl
    link.download = 'qr-code.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('SVG downloaded!')
  }

  const downloadPNG = async () => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      await QRCode.toCanvas(canvas, qrData, {
        width: size,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      })

      canvas.toBlob((blob) => {
        if (!blob) return
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.href = url
        link.download = 'qr-code.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 'image/png')

      showToast('PNG downloaded!')
    } catch (err) {
      console.error('PNG download error:', err)
    }
  }

  const renderForm = () => {
    switch (qrType) {
      case 'url':
        return (
          <div className="form-group">
            <label htmlFor="qrUrl">Website URL</label>
            <input
              id="qrUrl"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            {!formData.url && (
              <small className="field-hint">
                Showing default preview (bhandarisanjeev.com.np) — enter a URL above to customize.
              </small>
            )}
          </div>
        )
      case 'text':
        return (
          <div className="form-group">
            <label htmlFor="qrText">Plain Text</label>
            <textarea
              id="qrText"
              rows={4}
              placeholder="Enter your text..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            />
            {!formData.text && (
              <small className="field-hint">
                Showing default preview ("Hello World") — type any text above to update live.
              </small>
            )}
          </div>
        )
      case 'email':
        return (
          <>
            <div className="form-group">
              <label htmlFor="qrEmail">Email Address</label>
              <input
                id="qrEmail"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="qrEmailSubject">Subject (optional)</label>
              <input
                id="qrEmailSubject"
                type="text"
                placeholder="Email subject"
                value={formData.emailSubject}
                onChange={(e) => setFormData({ ...formData, emailSubject: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="qrEmailBody">Body (optional)</label>
              <textarea
                id="qrEmailBody"
                placeholder="Email body"
                value={formData.emailBody}
                onChange={(e) => setFormData({ ...formData, emailBody: e.target.value })}
              />
            </div>
          </>
        )
      case 'sms':
        return (
          <>
            <div className="form-group">
              <label htmlFor="qrSmsNumber">Phone Number</label>
              <input
                id="qrSmsNumber"
                type="tel"
                placeholder="+1234567890"
                value={formData.smsNumber}
                onChange={(e) => setFormData({ ...formData, smsNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="qrSmsMessage">Message (optional)</label>
              <textarea
                id="qrSmsMessage"
                placeholder="SMS message"
                value={formData.smsMessage}
                onChange={(e) => setFormData({ ...formData, smsMessage: e.target.value })}
              />
            </div>
          </>
        )
      case 'wifi':
        return (
          <>
            <div className="form-group">
              <label htmlFor="qrWifiSSID">Network Name (SSID)</label>
              <input
                id="qrWifiSSID"
                type="text"
                placeholder="WiFi Network Name"
                value={formData.wifiSSID}
                onChange={(e) => setFormData({ ...formData, wifiSSID: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="qrWifiPassword">Password</label>
              <input
                id="qrWifiPassword"
                type="text"
                placeholder="WiFi Password"
                value={formData.wifiPassword}
                onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="qrWifiEncryption">Encryption</label>
              <select
                id="qrWifiEncryption"
                name="qrWifiEncryption"
                value={formData.wifiEncryption}
                onChange={(e) => setFormData({ ...formData, wifiEncryption: e.target.value })}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
          </>
        )
      case 'vcard':
        return (
          <>
            <div className="form-group">
              <label htmlFor="vcardName">Name</label>
              <input
                id="vcardName"
                type="text"
                placeholder="John Doe"
                value={formData.vcardName}
                onChange={(e) => setFormData({ ...formData, vcardName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vcardPhone">Phone</label>
              <input
                id="vcardPhone"
                type="tel"
                placeholder="+1234567890"
                value={formData.vcardPhone}
                onChange={(e) => setFormData({ ...formData, vcardPhone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vcardEmail">Email</label>
              <input
                id="vcardEmail"
                type="email"
                placeholder="email@example.com"
                value={formData.vcardEmail}
                onChange={(e) => setFormData({ ...formData, vcardEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vcardOrg">Organization</label>
              <input
                id="vcardOrg"
                type="text"
                placeholder="Company Name"
                value={formData.vcardOrg}
                onChange={(e) => setFormData({ ...formData, vcardOrg: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vcardTitle">Job Title</label>
              <input
                id="vcardTitle"
                type="text"
                placeholder="Software Engineer"
                value={formData.vcardTitle}
                onChange={(e) => setFormData({ ...formData, vcardTitle: e.target.value })}
              />
            </div>
          </>
        )
    }
  }

  return (
    <div className="container tool-container">
      <JsonLd schema={getQrGeneratorSchema()} />
      <div className="tool-header">
        <h1>
          Advanced <span className="gradient-text">QR Generator</span>
        </h1>
        <p>Generate high-resolution SVG and PNG QR codes for any purpose.</p>
      </div>

      <div className="card">
        <div className="tabs" role="tablist" aria-label="QR Code Content Type">
          {(['url', 'text', 'wifi', 'vcard', 'email', 'sms'] as QRType[]).map((type) => (
            <button
              key={type}
              className={`tab ${qrType === type ? 'active' : ''}`}
              onClick={() => setQrType(type)}
              aria-label={`Select ${type} QR type`}
              aria-selected={qrType === type}
              role="tab"
            >
              <i
                className={`fa-solid ${
                  type === 'url'
                    ? 'fa-link'
                    : type === 'text'
                      ? 'fa-align-left'
                      : type === 'wifi'
                        ? 'fa-wifi'
                        : type === 'vcard'
                          ? 'fa-address-card'
                          : type === 'email'
                            ? 'fa-envelope'
                            : 'fa-comment'
                }`}
                aria-hidden="true"
              ></i>
              <span>{type.toUpperCase()}</span>
            </button>
          ))}
        </div>

        <div className="qr-section">
          <div className="qr-inputs">
            <h3 className="section-subtitle">Enter Data</h3>
            {renderForm()}

            <hr className="section-divider" />

            <h3 className="section-subtitle">Customization</h3>
            <div className="color-inputs">
              <div className="form-group">
                <label htmlFor="qr-fg-color">Foreground Color</label>
                <input
                  type="color"
                  id="qr-fg-color"
                  name="qr-fg-color"
                  className="color-picker-input"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="qr-bg-color">Background Color</label>
                <input
                  type="color"
                  id="qr-bg-color"
                  name="qr-bg-color"
                  className="color-picker-input"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="qr-size">Export Resolution</label>
              <select
                id="qr-size"
                name="qr-size"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              >
                <option value={128}>128 × 128 px</option>
                <option value={256}>256 × 256 px</option>
                <option value={512}>512 × 512 px</option>
                <option value={1024}>1024 × 1024 px</option>
              </select>
            </div>
          </div>

          <div className="qr-preview-container">
            <div id="qrcode">
              {qrSvgUrl ? (
                <img
                  src={qrSvgUrl}
                  alt="Generated QR Code Preview"
                  width={size > 256 ? 256 : size}
                  height={size > 256 ? 256 : size}
                />
              ) : (
                <div className="qr-loading">
                  Generating...
                </div>
              )}
            </div>
            <div className="qr-actions">
              <button className="btn btn-primary btn-block" onClick={downloadPNG}>
                <i className="fa-solid fa-download" aria-hidden="true"></i>
                <span>Download PNG</span>
              </button>
              <button className="btn btn-secondary btn-block" onClick={downloadSVG}>
                <i className="fa-solid fa-code" aria-hidden="true"></i>
                <span>Download Vector SVG</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="toast" role="status">
          <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
          {toast}
        </div>
      )}
    </div>
  )
}
