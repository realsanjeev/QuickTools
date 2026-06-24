import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/components/ui/theme-provider'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import QRGenerator from './pages/QRGenerator'
import TextFormatter from './pages/TextFormatter'
import AiTextDetector from './pages/AiTextDetector'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="quicktools-theme">
      <ErrorBoundary>
        <BrowserRouter basename="/QuickTools/">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="qr-generator" element={<QRGenerator />} />
              <Route path="text-formatter" element={<TextFormatter />} />
              <Route path="ai-text-humanizer" element={<AiTextDetector />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App