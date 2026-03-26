'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
 
const demoData = {
  summary: "LockBit 3.0 ransomware exploited CVE-2024-1234, encrypting 47 workstations and demanding 5 Bitcoin ransom.",
  threat_actor: "LockBit 3.0",
  attack_timeline: "Phishing email March 15. Lateral movement March 16. Ransomware deployed March 17 at 02:14 UTC.",
  business_impact: "47 workstations encrypted. Exchange Server offline 18 hours. Estimated $240,000 downtime cost.",
  cves: ["CVE-2024-1234", "CVE-2024-5678"],
  ips: ["185.220.101.45", "194.165.16.72"],
  domains: ["lockbit3-decrypt.onion"],
  hashes: ["a3f5b2c1d4e6f789012345678901234567890ab"],
  attack_methods: ["Spear phishing", "PowerShell lateral movement", "File encryption"],
  affected_systems: ["Windows Server 2019", "Exchange Server 2016", "47 workstations"],
  mitre: [
    { id: "T1566.001", name: "Spearphishing Attachment", tactic: "Initial Access", confidence: "High" },
    { id: "T1059.001", name: "PowerShell", tactic: "Execution", confidence: "High" },
    { id: "T1486", name: "Data Encrypted for Impact", tactic: "Impact", confidence: "High" },
    { id: "T1078", name: "Valid Accounts", tactic: "Defense Evasion", confidence: "Medium" }
  ],
  cvss_score: 9.1,
  cvss_reasoning: "Critical - remote code execution, no auth required, full encryption achieved.",
  severity: "Critical",
  confidence_level: "High",
  confidence_reason: "Multiple IOCs confirm all findings.",
  remediation: [
    "1. Isolate all 47 affected workstations from the network immediately",
    "2. Block IPs 185.220.101.45 and 194.165.16.72 at the firewall",
    "3. Reset all Active Directory passwords across the domain",
    "4. Apply patches for CVE-2024-1234 and CVE-2024-5678 on all servers",
    "5. Run full EDR scan and preserve forensic disk images"
  ],
  estimated_response_time: "4-6 hours containment, 72 hours full recovery"
}
 
export default function HomePage() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle'|'loading'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
 
  function runDemo() {
    localStorage.setItem('threatResult', JSON.stringify(demoData))
    router.push('/results')
  }
 
  async function extractText(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise
      let text = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map((item: any) => item.str).join(' ') + '\n'
      }
      return text
    }
    return await file.text()
  }
 
  async function analyzeFile(file: File) {
    setStatus('loading')
    setErrorMsg('')
    try {
      const text = await extractText(file)
      if (!text.trim()) throw new Error('File appears empty or unreadable')
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL
      if (!webhookUrl) throw new Error('Webhook URL not configured')
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report_text: text })
      })
      if (!res.ok) throw new Error('Analysis failed: ' + res.status)
      localStorage.setItem('threatResult', JSON.stringify(await res.json()))
      router.push('/results')
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }
 
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) analyzeFile(f)
  }, [])
 
  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
      <h1 className="glow-purple" style={{
        fontSize: 48, fontWeight: 800,
        color: '#C084FC', marginBottom: 12
      }}>",
        ThreatLens AI
      </h1>
      <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 48 }}>
        Upload any security report. Get instant AI threat intelligence.
      </p>
 
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => document.getElementById('fileInput')?.click()}
        style={{
          border: `2px dashed ${isDragOver ? '#7c3aed' : '#1e293b'}`,
          borderRadius: 16, padding: '80px 40px', cursor: 'pointer',
          background: isDragOver ? 'rgba(124,58,237,0.05)' : 'rgba(13,20,36,0.5)',
          transition: 'all 0.2s', marginBottom: 24
        }}
       
      >
        {status === 'loading' ? (
          <p style={{ color: '#a78bfa', fontSize: 20, fontWeight: 600 }}>
            Analyzing... please wait 5-10 seconds
          </p>
        ) : (
          <>
            <p style={{ color: '#f1f5f9', fontSize: 20, fontWeight: 600 }}>
              Drop your security report here
            </p>
            <p style={{ color: '#64748b', marginTop: 8 }}>
              Supports PDF and TXT files — or click to browse
            </p>
          </>
        )}
        <input id="fileInput" type="file" accept=".pdf,.txt" hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) analyzeFile(f)
          }} />
      </div>
 
      {status === 'error' && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 8, padding: '12px 20px',
          color: '#ef4444', marginBottom: 16
        }}>
          Error: {errorMsg}
        </div>
      )}
 
      <button
        onClick={runDemo}
        style={{
          background: 'rgba(124,58,237,0.08)',
          color: '#a78bfa',
          border: '1px solid rgba(124,58,237,0.25)',
          padding: '10px 24px',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 14
        }}
      >
        Run Live Demo (No Upload Needed)
      </button>
    </main>
  )
}