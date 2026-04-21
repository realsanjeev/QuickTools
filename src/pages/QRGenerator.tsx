import { useState, useEffect, useCallback } from 'react'
import * as QRCode from 'qrcode'

type QRType = 'url' | 'text' | 'email' | 'sms' | 'wifi' | 'vcard'

export default function QRGenerator() {
  const [qrType, setQrType] = useState<QRType>('url')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [size, setSize] = useState(256)
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
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
        return formData.url || 'https://example.com'
      case 'text':
        return formData.text || 'Hello World'
      case 'email':
        return `mailto:${formData.email}${formData.emailSubject ? `?subject=${encodeURIComponent(formData.emailSubject)}` : ''}${formData.emailBody ? `&body=${encodeURIComponent(formData.emailBody)}` : ''}`
      case 'sms':
        return `sms:${formData.smsNumber}${formData.smsMessage ? `?body=${encodeURIComponent(formData.smsMessage)}` : ''}`
      case 'wifi':
        return `WIFI:T:${formData.wifiEncryption};S:${formData.wifiSSID};P:${formData.wifiPassword};;`
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
        return 'https://example.com'
    }
  }, [qrType, formData])

  const qrData = generateQRData()

  useEffect(() => {
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
        currentSvgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
        setQrSvgUrl(currentSvgUrl)
      } catch (err) {
        console.error('QR generation error:', err)
      }
    }
    generateSvg()
    return () => {
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
          <>
            <div className="form-group">
              <label>URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
          </>
        )
      case 'text':
        return (
          <>
            <div className="form-group">
              <label>Plain Text</label>
              <textarea
                className="form-input"
                placeholder="Enter your text..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              />
            </div>
          </>
        )
      case 'email':
        return (
          <>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Subject (optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Email subject"
                value={formData.emailSubject}
                onChange={(e) => setFormData({ ...formData, emailSubject: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Body (optional)</label>
              <textarea
                className="form-input"
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
              <label>Phone Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1234567890"
                value={formData.smsNumber}
                onChange={(e) => setFormData({ ...formData, smsNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Message (optional)</label>
              <textarea
                className="form-input"
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
              <label>Network Name (SSID)</label>
              <input
                type="text"
                className="form-input"
                placeholder="WiFi Network Name"
                value={formData.wifiSSID}
                onChange={(e) => setFormData({ ...formData, wifiSSID: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="text"
                className="form-input"
                placeholder="WiFi Password"
                value={formData.wifiPassword}
                onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Encryption</label>
              <select
                className="form-input select-input"
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
              <label>Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={formData.vcardName}
                onChange={(e) => setFormData({ ...formData, vcardName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                className="form-input"
                placeholder="+1234567890"
                value={formData.vcardPhone}
                onChange={(e) => setFormData({ ...formData, vcardPhone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="email@example.com"
                value={formData.vcardEmail}
                onChange={(e) => setFormData({ ...formData, vcardEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Organization (optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Company Name"
                value={formData.vcardOrg}
                onChange={(e) => setFormData({ ...formData, vcardOrg: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Title (optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Job Title"
                value={formData.vcardTitle}
                onChange={(e) => setFormData({ ...formData, vcardTitle: e.target.value })}
              />
            </div>
          </>
        )
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>QR Code Generator</h2>
        <p>Create QR codes for various purposes</p>
      </div>

      <div className="tab-buttons">
        {(['url', 'text', 'email', 'sms', 'wifi', 'vcard'] as QRType[]).map((type) => (
          <button
            key={type}
            className={`tab-btn ${qrType === type ? 'active' : ''}`}
            onClick={() => setQrType(type)}
          >
            {type === 'url' && 'URL'}
            {type === 'text' && 'Text'}
            {type === 'email' && 'Email'}
            {type === 'sms' && 'SMS'}
            {type === 'wifi' && 'WiFi'}
            {type === 'vcard' && 'vCard'}
          </button>
        ))}
      </div>

      <div className="tool-layout">
        <div className="tool-form">
          <h3>Enter Data</h3>
          {renderForm()}
        </div>

        <div className="preview-panel">
          <h3>Preview</h3>
          <div className="qr-preview">
            {qrSvgUrl ? (
              <img src={qrSvgUrl} alt="QR Code" width={size} height={size} />
            ) : (
              <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Generating...
              </div>
            )}
          </div>

          <h3 style={{ marginTop: 20, marginBottom: 12 }}>Options</h3>
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label>Colors</label>
            <div className="qr-options">
              <div className="color-input-wrapper">
                <div className="color-preview" style={{ backgroundColor: fgColor }}>
                  <input
                    type="color"
                    className="color-picker-input"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                  />
                </div>
                <span style={{ color: '#9ca3af', fontSize: 14 }}>Foreground</span>
              </div>
              <div className="color-input-wrapper">
                <div className="color-preview" style={{ backgroundColor: bgColor }}>
                  <input
                    type="color"
                    className="color-picker-input"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>
                <span style={{ color: '#9ca3af', fontSize: 14 }}>Background</span>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 12 }}>
            <label>Size</label>
            <select
              className="form-input select-input"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            >
              <option value={128}>128 × 128</option>
              <option value={256}>256 × 256</option>
              <option value={512}>512 × 512</option>
              <option value={1024}>1024 × 1024</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 20 }}>
            <label>Error Correction</label>
            <select
              className="form-input select-input"
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>

          <div className="btn-group">
            <button id="download-png-btn" className="btn btn-primary" onClick={downloadPNG}>
              Download PNG
            </button>
            <button id="download-svg-btn" className="btn btn-secondary" onClick={downloadSVG}>
              Download SVG
            </button>
          </div>
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