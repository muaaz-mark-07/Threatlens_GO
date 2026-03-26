'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
 
export default function ResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
 
  useEffect(() => {
    const stored = localStorage.getItem('threatResult')
    if (!stored) { router.push('/'); return }
    setData(JSON.parse(stored))
  }, [router])
 
  if (!data) return <div style={{ color: '#94a3b8', textAlign: 'center', padding: 60 }}>Loading...</div>
 
  const severity = (data.severity || "medium").toLowerCase()
  const cvss = data.cvss_score || 0
  const cvssColor = cvss >= 9 ? "#ef4444" : cvss >= 7 ? "#f97316" : cvss >= 4 ? "#eab308" : "#22c55e"
 
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
 
      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#f1f5f9' }}>
          Threat Intelligence Report
        </h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => window.print()} style={{
            background: 'rgba(34,197,94,0.1)', color: '#22c55e',
            border: '1px solid rgba(34,197,94,0.3)',
            padding: '8px 16px', borderRadius: 8, cursor: 'pointer'
          }}>Export Report</button>
          <button onClick={() => router.push('/')} style={{
            background: 'rgba(124,58,237,0.1)', color: '#a78bfa',
            border: '1px solid rgba(124,58,237,0.3)',
            padding: '8px 16px', borderRadius: 8, cursor: 'pointer'
          }}>Analyze Another</button>
        </div>
      </div>
 
      {/* 3 TOP CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
 
        {/* CVSS GAUGE */}
        <div className='card' style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>CVSS RISK SCORE</div>
          <svg width="140" height="80" viewBox="0 0 140 80" style={{ margin: "0 auto", display: "block" }}>
            <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round"/>
            <path d="M 10 70 A 60 60 0 0 1 130 70" fill="none" stroke={cvssColor} strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(cvss / 10) * 188} 188`}
              style={{ transition: 'stroke-dasharray 1.2s ease' }}/>
            <text x="70" y="65" textAnchor="middle" fill={cvssColor} fontSize="26" fontWeight="800">
              {cvss.toFixed(1)}
            </text>
          </svg>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>out of 10.0</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>{data.cvss_reasoning}</div>
        </div>
 
        {/* SEVERITY */}
        <div className='card' style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>SEVERITY</div>
          <span className={`badge badge-${severity}`} style={{ fontSize: 24, padding: "8px 20px" }}>
            {data.severity}
          </span>
        </div>
 
        {/* THREAT ACTOR */}
        <div className='card' style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>THREAT ACTOR</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#f1f5f9', marginTop: 12 }}>
            {data.threat_actor || 'Unknown'}
          </div>
        </div>
      </div>
 
      {/* SUMMARY */}
      <div className='card' style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 13, color: '#64748b', marginBottom: 10, fontWeight: 600 }}>INCIDENT SUMMARY</h2>
        <p style={{ color: '#e2e8f0', lineHeight: 1.7 }}>{data.summary}</p>
      </div>
 
      {/* TIMELINE + IMPACT + CONFIDENCE */}
      <div className='card' style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>ATTACK TIMELINE</div>
            <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {data.attack_timeline || 'Not specified'}</p>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>BUSINESS IMPACT</div>
            <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {data.business_impact || 'Not specified'}</p>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>ANALYSIS CONFIDENCE</div>
            <span className={`badge badge-${(data.confidence_level||'medium').toLowerCase()}`}>
              {data.confidence_level || 'Medium'}</span>
            <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 6 }}>{data.confidence_reason}</p>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>RESPONSE TIME ESTIMATE</div>
            <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              {data.estimated_response_time || 'Not estimated'}</p>
          </div>
        </div>
      </div>
 
      {/* CVEs + AFFECTED SYSTEMS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className='card'>
          <h2 style={{ fontSize: 13, color: '#64748b', marginBottom: 10, fontWeight: 600 }}>CVEs IDENTIFIED</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {data.cves?.length ? data.cves.map((c: string, i: number) => (
              <span key={i} className='badge' style={{
                background: 'rgba(239,68,68,.1)', color: '#fca5a5',
                border: '1px solid rgba(239,68,68,.2)', fontSize: 12
              }}>{c}</span>
            )) : <span style={{ color: '#64748b' }}>None identified</span>}
          </div>
        </div>
        <div className='card'>
          <h2 style={{ fontSize: 13, color: '#64748b', marginBottom: 10, fontWeight: 600 }}>AFFECTED SYSTEMS</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {data.affected_systems?.length ? data.affected_systems.map((s: string, i: number) => (
              <span key={i} className='badge badge-ioc'>{s}</span>
            )) : <span style={{ color: '#64748b' }}>None identified</span>}
          </div>
        </div>
      </div>
 
      {/* IOCs */}
      <div className='card' style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 13, color: '#64748b', marginBottom: 12, fontWeight: 600 }}>INDICATORS OF COMPROMISE</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { label: 'Malicious IPs', items: data.ips },
            { label: 'Malicious Domains', items: data.domains },
            { label: 'File Hashes', items: data.hashes },
          ].map(({ label, items }) => (
            <div key={label}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 500 }}>{label}</div>
              {items?.length ? items.map((item: string, i: number) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  <span className='badge badge-ioc' style={{
                    fontFamily: 'monospace', fontSize: 11, display: 'block'
                  }}>{item}</span>
                </div>
              )) : <span style={{ color: '#475569', fontSize: 12 }}>None found</span>}
            </div>
          ))}
        </div>
      </div>
 
      {/* MITRE */}
      <div className='card' style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 13, color: '#64748b', marginBottom: 12, fontWeight: 600 }}>MITRE ATT&CK TECHNIQUES</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {data.mitre?.length ? data.mitre.map((m: any, i: number) => (
            <div key={i} style={{
              background: 'rgba(124,58,237,.1)',
              border: '1px solid rgba(124,58,237,.25)',
              borderRadius: 8, padding: '8px 14px'
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', fontFamily: 'monospace' }}>{m.id}</div>
              <div style={{ fontSize: 12, color: '#e2e8f0', marginTop: 2 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{m.tactic}</div>
              <div style={{ fontSize: 10, marginTop: 2,
                color: m.confidence==='High'?'#22c55e':m.confidence==='Medium'?'#eab308':'#f97316' }}>
                Confidence: {m.confidence}
              </div>
            </div>
          )) : <span style={{ color: '#64748b' }}>None identified</span>}
        </div>
      </div>
 
      {/* REMEDIATION */}
      <div className='card'>
        <h2 style={{ fontSize: 13, color: '#64748b', marginBottom: 14, fontWeight: 600 }}>REMEDIATION STEPS</h2>
        {data.remediation?.map((step: string, i: number) => (
          <div key={i} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12
          }}>
            <div style={{
              minWidth: 28, height: 28,
              background: 'rgba(124,58,237,.15)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#a78bfa', fontWeight: 700, fontSize: 13, flexShrink: 0
            }}>
              {i + 1}
            </div>
            <p style={{
              color: '#e2e8f0', fontSize: 14, lineHeight: 1.6, margin: 0, paddingTop: 4
            }}>
              {step.replace(/^\d+\.\s*/, '')}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}