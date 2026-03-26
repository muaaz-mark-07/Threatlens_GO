'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
 
export default function HistoryPage() {
  const router = useRouter()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    fetch(
      `${url}/rest/v1/threat_reports?select=id,created_at,summary,severity,cvss_score,threat_actor&order=created_at.desc&limit=20`,
      { headers: { 'apikey': key!, 'Authorization': `Bearer ${key}` } }
    )
    .then(r => r.json())
    .then(data => { setReports(Array.isArray(data) ? data : []); setLoading(false) })
    .catch(() => setLoading(false))
  }, [])
 
  const col: any = { critical:"#ef4444", high:"#f97316", medium:"#eab308", low:"#22c55e" }
 
  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:'#f1f5f9' }}>Reports History</h1>
        <button onClick={() => router.push('/')} style={{
          background:'rgba(124,58,237,0.1)', color:'#a78bfa',
          border:'1px solid rgba(124,58,237,0.3)', padding:'8px 16px',
          borderRadius:8, cursor:'pointer' }}>
          Analyze New Report
        </button>
      </div>
      {loading && <p style={{ color:'#64748b', textAlign:'center' }}>Loading...</p>}
      {!loading && reports.length === 0 && (
        <p style={{ color:'#64748b', textAlign:'center' }}>No reports yet. Analyze your first report.</p>
      )}
      {reports.map((r, i) => (
        <div key={i} className='card' style={{ marginBottom:12, display:'flex', justifyContent:'space-between' }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, color:'#94a3b8', marginBottom:6 }}>
              {new Date(r.created_at).toLocaleString()}
              {' — '}<span style={{ color:'#e2e8f0' }}>{r.threat_actor || 'Unknown'}</span>
            </div>
            <div style={{ fontSize:14, color:'#e2e8f0', lineHeight:1.5 }}>
              {r.summary?.slice(0, 160)}...
            </div>
          </div>
          <div style={{ textAlign:'right', marginLeft:24, flexShrink:0 }}>
            <div style={{ fontSize:28, fontWeight:800,
              color: col[(r.severity||'low').toLowerCase()] || '#22c55e' }}>
              {r.cvss_score?.toFixed(1) || '0.0'}
            </div>
            <div style={{ fontSize:11, color:'#64748b' }}>{r.severity}</div>
          </div>
        </div>
      ))}
    </main>
  )
}