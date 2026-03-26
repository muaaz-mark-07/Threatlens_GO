import type { Metadata } from 'next'
import './globals.css'
 
export const metadata: Metadata = {
  title: 'ThreatLens AI',
  description: 'AI-powered security incident report analyzer',
}
 
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: '#0a0f1e', minHeight: '100vh' }}>
        <nav style={{
          borderBottom: '1px solid #1e293b',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(13,20,36,0.95)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#a78bfa' }}>
            ThreatLens AI
          </span>
          <span style={{ fontSize: '12px', color: '#475569' }}>
            Automated Intelligence Extraction
          </span>
          <a href='/history' style={{ marginLeft: 'auto', fontSize: '13px',
            color: '#64748b', textDecoration: 'none' }}>
            Reports History
          </a>
        </nav>
        {children}
      </body>
    </html>
  )
}