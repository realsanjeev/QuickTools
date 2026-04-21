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
          <div className="form-group">
            <label>Website URL</label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
        )
      case 'text':
        return (
          <div className="form-group">
            <label>Plain Text</label>
            <textarea
              rows={4}
              placeholder="Enter your text..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            />
          </div>
        )
      case 'email':
        return (
          <>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Subject (optional)</label>
              <input
                type="text"
                placeholder="Email subject"
                value={formData.emailSubject}
                onChange={(e) => setFormData({ ...formData, emailSubject: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Body (optional)</label>
              <textarea
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
                placeholder="+1234567890"
                value={formData.smsNumber}
                onChange={(e) => setFormData({ ...formData, smsNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Message (optional)</label>
              <textarea
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
                placeholder="WiFi Network Name"
                value={formData.wifiSSID}
                onChange={(e) => setFormData({ ...formData, wifiSSID: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="text"
                placeholder="WiFi Password"
                value={formData.wifiPassword}
                onChange={(e) => setFormData({ ...formData, wifiPassword: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Encryption</label>
              <select
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
                placeholder="John Doe"
                value={formData.vcardName}
                onChange={(e) => setFormData({ ...formData, vcardName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="+1234567890"
                value={formData.vcardPhone}
                onChange={(e) => setFormData({ ...formData, vcardPhone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={formData.vcardEmail}
                onChange={(e) => setFormData({ ...formData, vcardEmail: e.target.value })}
              />
            </div>
          </>
        )
    }
  }

  return (
    <div className="container tool-container">
      <div className="tool-header">
        <h1>Advanced <span className="gradient-text">QR Generator</span></h1>
        <p>Generate high-quality QR codes for any purpose.</p>
      </div>

      <div className="card">
        <div className="tabs">
          {(['url', 'text', 'wifi', 'vcard', 'email', 'sms'] as QRType[]).map((type) => (
            <button
              key={type}
              className={`tab ${qrType === type ? 'active' : ''}`}
              onClick={() => setQrType(type)}
            >
              <i className={`fa-solid ${
                type === 'url' ? 'fa-link' : 
                type === 'text' ? 'fa-align-left' : 
                type === 'wifi' ? 'fa-wifi' : 
                type === 'vcard' ? 'fa-address-card' : 
                type === 'email' ? 'fa-envelope' : 'fa-comment'
              }`}></i> &nbsp;
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="qr-section">
          <div className="qr-inputs">
            <h3>Enter Data</h3>
            <div style={{ marginTop: '1rem' }}>
              {renderForm()}
            </div>

            <hr style={{ margin: '2rem 0', border: 0, borderTop: '1px solid var(--border-color)' }} />
            
            <h3>Customization</h3>
            <div className="color-inputs" style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label>Foreground</label>
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  style={{ height: '40px', padding: '2px' }}
                />
              </div>
              <div className="form-group">
                <label>Background</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  style={{ height: '40px', padding: '2px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Size</label>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              >
                <option value={128}>128 × 128</option>
                <option value={256}>256 × 256</option>
                <option value={512}>512 × 512</option>
                <option value={1024}>1024 × 1024</option>
              </select>
            </div>
          </div>

          <div className="qr-preview-container">
            <div id="qrcode">
              {qrSvgUrl ? (
                <img src={qrSvgUrl} alt="QR Code" width={size > 256 ? 256 : size} height={size > 256 ? 256 : size} />
              ) : (
                <div style={{ width: 256, height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Generating...
                </div>
              )}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={downloadPNG}>
              <i className="fa-solid fa-download"></i> &nbsp; Download PNG
            </button>
            <button className="btn" style={{ width: '100%', marginTop: '0.5rem', background: '#f3f4f6' }} onClick={downloadSVG}>
               Download SVG
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