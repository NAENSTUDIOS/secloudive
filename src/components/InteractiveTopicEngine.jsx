import { useState, useEffect } from 'react'
import {
  BookOpen, Zap, Terminal, FileText, ChevronRight,
  CheckCircle2, AlertTriangle, Lightbulb,
  Brain, Shield, Lock, Eye, Copy, Check, Play,
  Layers, Target, Activity, Code2, Star, Download,
  Briefcase, Sparkles, Globe
} from 'lucide-react'
import TopicArchitectureDiagram from './TopicArchitectureDiagram'
import TopicJobReadinessCard from './TopicJobReadinessCard'
import TopicMultiCloudCrosswalk from './TopicMultiCloudCrosswalk'

// ─── Utility: parse markdown bold/code inline ────────────────────────────────
function parseInline(text) {
  if (typeof text !== 'string') return text
  const parts = []
  const regex = /(\*\*([^*]+)\*\*|`([^`]+)`)/g
  let lastIndex = 0, match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    if (match[2]) parts.push(<strong key={match.index} style={{ color: '#f8fafc', fontWeight: 700 }}>{match[2]}</strong>)
    else if (match[3]) parts.push(<code key={match.index} style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.85em', color: '#7dd3fc', background: 'rgba(125,211,252,0.1)', padding: '1px 5px', borderRadius: '3px' }}>{match[3]}</code>)
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts.length ? parts : [text]
}

// ─── Parse overview string → structured blocks ────────────────────────────────
function parseOverviewToBlocks(overview) {
  if (!overview) return []
  const lines = overview.split('\n')
  const blocks = []
  let current = null
  let bullets = []

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      if (bullets.length && current) { current.bullets = [...bullets]; bullets = [] }
      continue
    }
    const numHeading = line.match(/^(\d+)\.\s+\*\*([^*]+)\*\*[:\s]*(.*)/)
    if (numHeading) {
      if (current) { if (bullets.length) { current.bullets = [...bullets]; bullets = [] }; blocks.push(current) }
      current = { type: 'concept', number: numHeading[1], heading: numHeading[2], subtitle: numHeading[3] || '', bullets: [], subPoints: [] }
      continue
    }
    const boldHead = line.match(/^\*\*([^*]+)\*\*[:\s]*(.*)/)
    if (boldHead && !line.startsWith('-') && !line.startsWith(' ')) {
      if (current) { if (bullets.length) { current.bullets = [...bullets]; bullets = [] }; blocks.push(current) }
      current = { type: 'section', heading: boldHead[1], subtitle: boldHead[2] || '', bullets: [], subPoints: [] }
      continue
    }
    const subBullet = line.match(/^[-•]\s+(.+)/)
    if (subBullet) {
      const content = subBullet[1]
      const subHead = content.match(/\*\*([^*]+)\*\*[:\s]*(.*)/)
      if (subHead && current) {
        current.subPoints = current.subPoints || []
        current.subPoints.push({ label: subHead[1], detail: subHead[2] })
      } else {
        bullets.push(content)
      }
      continue
    }
    if (current) { current.body = (current.body ? current.body + ' ' : '') + line }
    else { blocks.push({ type: 'intro', text: line }) }
  }
  if (current) { if (bullets.length) current.bullets = [...bullets]; blocks.push(current) }
  return blocks
}

const CONCEPT_ICON_MAP = [
  [/confidential/i, <Lock size={20} />],
  [/integrity/i, <Shield size={20} />],
  [/availab/i, <Activity size={20} />],
  [/identity|iam|access/i, <Eye size={20} />],
  [/blast|radius/i, <Target size={20} />],
  [/shift.left|devsecops/i, <Code2 size={20} />],
  [/threat|attack|mitre/i, <AlertTriangle size={20} />],
  [/network|vpc|subnet/i, <Layers size={20} />],
  [/monitor|log|audit/i, <Terminal size={20} />],
  [/encryp|kms|key/i, <Lock size={20} />],
]
const COLORS = ['#38bdf8', '#a78bfa', '#4ade80', '#fb923c', '#f43f5e', '#facc15', '#34d399', '#60a5fa']

function getIcon(heading) {
  for (const [r, icon] of CONCEPT_ICON_MAP) { if (r.test(heading)) return icon }
  return <Brain size={20} />
}

// ─── ConceptCard ─────────────────────────────────────────────────────────────
function ConceptCard({ block, idx, visible }) {
  const color = COLORS[idx % COLORS.length]
  return (
    <div style={{
      background: 'rgba(15,23,42,0.85)',
      border: `1px solid ${color}33`,
      borderLeft: `3px solid ${color}`,
      borderRadius: '10px',
      padding: '18px 20px',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(14px)',
    }}>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
          {block.number ? <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'DM Mono',monospace" }}>{block.number}</span> : getIcon(block.heading)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>{block.heading}</div>
          {block.subtitle && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontStyle: 'italic' }}>{parseInline(block.subtitle)}</div>}
          {block.body && <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: '0 0 10px' }}>{parseInline(block.body)}</p>}
          {block.subPoints && block.subPoints.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
              {block.subPoints.map((sp, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <ChevronRight size={13} style={{ color, marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <span style={{ color, fontWeight: 600, fontSize: 12.5 }}>{sp.label}:</span>
                    {sp.detail && <span style={{ color: '#94a3b8', fontSize: 12, marginLeft: 4 }}>{parseInline(sp.detail)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {block.bullets && block.bullets.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {block.bullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12.5, color: '#94a3b8' }}>
                  <CheckCircle2 size={12} style={{ color, marginTop: 3, flexShrink: 0 }} />
                  <span>{parseInline(b)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Theory ─────────────────────────────────────────────────────────────
function TheoryTab({ topic }) {
  const blocks = parseOverviewToBlocks(topic.overview)
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    setVisible(0)
    const t = setInterval(() => setVisible(v => { if (v >= blocks.length) { clearInterval(t); return v }; return v + 1 }), 80)
    return () => clearInterval(t)
  }, [topic.id, blocks.length])

  if (!blocks.length) return <div style={{ padding: '20px 0', color: '#94a3b8', fontSize: 14, lineHeight: 1.75 }}>{topic.overview}</div>

  const intros = blocks.filter(b => b.type === 'intro')
  const concepts = blocks.filter(b => b.type !== 'intro')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* ── Interactive Architecture Diagram & Visual Threat Flow ── */}
      <TopicArchitectureDiagram topic={topic} pathId={topic.pathId} />

      {intros.map((b, i) => (
        <p key={i} style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 12px', padding: '14px 16px', background: 'rgba(56,189,248,0.04)', borderRadius: 8, borderLeft: '3px solid #38bdf8', opacity: i < visible ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          {parseInline(b.text)}
        </p>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {concepts.map((block, i) => (
          <ConceptCard key={i} block={block} idx={i} visible={i + intros.length < visible} />
        ))}
      </div>
      {topic.whyItMatters && (
        <div style={{ marginTop: 16, padding: '14px 18px', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start', opacity: visible >= blocks.length ? 1 : 0, transition: 'opacity 0.5s ease 0.2s' }}>
          <Lightbulb size={18} style={{ color: '#a78bfa', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Why This Matters to Your Career</div>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{topic.whyItMatters}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Tab: How It Works ───────────────────────────────────────────────────────
function HowItWorksTab({ topic }) {
  const [activeStep, setActiveStep] = useState(0)
  const steps = (topic.bestPractices || []).map((p, i) => ({ step: i + 1, content: p }))
  const milestones = topic.keyTakeaways || []
  const rw = topic.realWorldScenario || topic.realWorldExample

  return (
    <div>
      {steps.length > 0 && (
        <>
          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, fontWeight: 700 }}>⚙️ Hardening Steps — Click to Explore</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {steps.map((s, i) => (
              <button key={i} type="button" onClick={() => setActiveStep(i)} style={{ padding: '8px 14px', borderRadius: 8, border: `1px solid ${i === activeStep ? '#4ade80' : 'rgba(148,163,184,0.15)'}`, background: i === activeStep ? 'rgba(74,222,128,0.1)' : 'rgba(15,23,42,0.6)', color: i === activeStep ? '#4ade80' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: i === activeStep ? '#4ade80' : '#1e293b', color: i === activeStep ? '#0f172a' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>{s.step}</span>
                Step {s.step}
              </button>
            ))}
          </div>
          {steps[activeStep] && (
            <div style={{ padding: 20, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80', fontWeight: 800, fontFamily: "'DM Mono',monospace", fontSize: 14 }}>{steps[activeStep].step}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#4ade80' }}>Hardening Action</div>
              </div>
              <p style={{ fontSize: 13.5, color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>{parseInline(steps[activeStep].content)}</p>
            </div>
          )}
        </>
      )}
      {milestones.length > 0 && (
        <>
          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12, fontWeight: 700 }}>🏁 Engineering Milestones</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 16px', background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.12)', borderRadius: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(56,189,248,0.15)', border: '1px solid #38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{parseInline(m)}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {rw && (
        <div style={{ padding: 18, background: 'rgba(251,113,133,0.06)', border: '1px solid rgba(251,113,133,0.2)', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <AlertTriangle size={15} style={{ color: '#fb7185' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fb7185', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Real-World Incident</span>
            {rw.title && <span style={{ fontSize: 12, color: '#94a3b8' }}>— {rw.title}</span>}
          </div>
          <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: '0 0 10px' }}>{rw.incident || rw.scenario || rw.description}</p>
          {rw.impact && <div style={{ display: 'flex', gap: 8, fontSize: 12 }}><span style={{ color: '#fb7185', fontWeight: 600 }}>Impact:</span><span style={{ color: '#94a3b8' }}>{rw.impact}</span></div>}
          {rw.detectionMethod && <div style={{ display: 'flex', gap: 8, fontSize: 12, marginTop: 6 }}><span style={{ color: '#38bdf8', fontWeight: 600 }}>Detection:</span><span style={{ color: '#94a3b8' }}>{rw.detectionMethod}</span></div>}
        </div>
      )}
    </div>
  )
}

// ─── Tab: Live CLI ────────────────────────────────────────────────────────────
function LiveCliTab({ topic }) {
  const [copied, setCopied] = useState(null)
  const [runOutput, setRunOutput] = useState({})
  const [running, setRunning] = useState(null)

  const sections = []
  if (topic.codeSnippet) sections.push({ id: 'main', title: topic.codeSnippet.title || 'Primary CLI Command', lang: topic.codeSnippet.language || 'bash', code: topic.codeSnippet.code })
  ;(topic.whatACloudSecEngineerChecks || []).filter(c => typeof c === 'object' && c.command).forEach((c, i) => {
    sections.push({ id: `chk${i}`, title: c.title || `Check ${i + 1}`, lang: 'bash', code: c.command })
  })

  const copy = (code, id) => { navigator.clipboard.writeText(code).then(() => { setCopied(id); setTimeout(() => setCopied(null), 2000) }) }
  const run = (code, id) => {
    setRunning(id); setRunOutput(prev => ({ ...prev, [id]: null }))
    setTimeout(() => {
      setRunning(null)
      setRunOutput(prev => ({ ...prev, [id]: ['$ ' + code.split('\n')[0], '', '✓ Command executed in NAEN Studios Sandbox', '→ Use this in your real cloud terminal for live output', '', '📋 Sandbox shows syntax only — run it in your own account.'] }))
    }, 1200)
  }

  if (!sections.length) return (
    <div style={{ padding: 30, textAlign: 'center', color: '#475569', border: '1px dashed rgba(148,163,184,0.2)', borderRadius: 10 }}>
      <Terminal size={28} style={{ color: '#334155', marginBottom: 10 }} />
      <div style={{ fontSize: 14 }}>No CLI commands for this topic yet.</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ padding: '10px 14px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 8, fontSize: 12, color: '#fbbf24', display: 'flex', gap: 8, alignItems: 'center' }}>
        <Terminal size={13} />
        <span>Click <strong>Run in Sandbox</strong> to simulate. Copy to run in your real cloud console.</span>
      </div>
      {sections.map(s => (
        <div key={s.id} style={{ background: '#091322', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', background: 'rgba(56,189,248,0.08)', borderBottom: '1px solid rgba(56,189,248,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {['#ef4444','#f59e0b','#22c55e'].map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              </div>
              <span style={{ fontSize: 11, color: '#64748b', fontFamily: "'DM Mono',monospace" }}>{s.lang} • {s.title}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={() => copy(s.code, s.id)} style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(15,23,42,0.6)', color: copied === s.id ? '#4ade80' : '#94a3b8', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
                {copied === s.id ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
              </button>
              <button type="button" onClick={() => run(s.code, s.id)} style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.1)', color: '#4ade80', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
                <Play size={11} /> Run in Sandbox
              </button>
            </div>
          </div>
          <pre style={{ margin: 0, padding: 16, fontFamily: "'DM Mono',monospace", fontSize: 12, lineHeight: 1.65, color: '#7dd3fc', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{s.code}</pre>
          {running === s.id && !runOutput[s.id] && (
            <div style={{ borderTop: '1px solid rgba(56,189,248,0.1)', padding: '12px 16px', background: 'rgba(0,0,0,0.4)', fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#4ade80' }}>⣾ Running in NAEN Sandbox...</div>
          )}
          {runOutput[s.id] && (
            <div style={{ borderTop: '1px solid rgba(56,189,248,0.1)', padding: '12px 16px', background: 'rgba(0,0,0,0.4)' }}>
              <div style={{ fontSize: 10, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontFamily: "'DM Mono',monospace" }}>▶ NAEN Sandbox Output</div>
              {runOutput[s.id].map((line, i) => (
                <div key={i} style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, lineHeight: 1.6, color: line.startsWith('$') ? '#38bdf8' : line.startsWith('✓') ? '#4ade80' : line.startsWith('→') ? '#a78bfa' : '#64748b' }}>{line || '\u00A0'}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Tab: Recap & Refs ────────────────────────────────────────────────────────
function RecapTab({ topic, pathResources, learningBlueprint }) {
  const explicit = topic.awsResources || topic.learningResources || topic.resources || []
  const seen = new Set()
  const unique = [...explicit, ...pathResources].filter(r => { const k = r.url || r.title; if (seen.has(k)) return false; seen.add(k); return true })

  const getColor = (res) => {
    if (res.provider === 'tryhackme' || (res.title||'').includes('TryHackMe')) return { color: '#f43f5e', tag: '🔥 TryHackMe Room' }
    if (res.provider === 'hackthebox' || (res.title||'').includes('HackTheBox')) return { color: '#22c55e', tag: '🟩 HackTheBox' }
    if (res.provider === 'azure') return { color: '#0ea5e9', tag: '🟦 Azure Docs' }
    if (res.provider === 'gcp') return { color: '#4285f4', tag: '🌐 Google Cloud' }
    if (res.provider === 'oci') return { color: '#c74634', tag: '🔴 OCI Docs' }
    if (res.provider === 'ibm') return { color: '#0f62fe', tag: '🔷 IBM Cloud' }
    return { color: '#f59e0b', tag: '🟧 AWS Official' }
  }

  return (
    <div>
      {learningBlueprint && learningBlueprint.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 700 }}>
            Progressive learning blueprint
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
            {learningBlueprint.map(track => (
              <div key={track.id} style={{ padding: 14, background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 10 }}>
                <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{track.title}</div>
                <div style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.5, marginBottom: 10 }}>{track.overview}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {track.levelFramework.slice(0, 4).map(level => (
                    <span key={level.level} style={{ color: '#c4b5fd', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 999, padding: '3px 7px', fontSize: 9 }}>
                      L{level.level} {level.name}
                    </span>
                  ))}
                </div>
                <div style={{ color: '#64748b', fontSize: 10, marginTop: 9 }}>
                  {track.projects.length} projects · {track.assessments.length} assessments · {track.certifications.length || 'No mapped'} certifications
                </div>
                {track.rolePlay && (
                  <div style={{ marginTop: 10, paddingTop: 9, borderTop: '1px solid rgba(167,139,250,0.12)' }}>
                    <div style={{ color: '#c4b5fd', fontSize: 10, fontWeight: 700 }}>{track.rolePlay.title}</div>
                    <div style={{ color: '#64748b', fontSize: 10, lineHeight: 1.45, marginTop: 3 }}>{track.rolePlay.managerRequest}</div>
                    <div style={{ color: '#64748b', fontSize: 10, marginTop: 5 }}>
                      {track.jobTickets.length} job ticket · {track.productionIncidents.length} incident drills · {track.teamActivities.length} team activities
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ padding: '14px 18px', background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(56,189,248,0.08) 100%)', border: '1px solid rgba(56,189,248,0.25)', borderRadius: 10, marginBottom: 20, fontSize: 13, color: '#94a3b8', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', flexShrink: 0 }}>
          <Sparkles size={16} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <strong style={{ color: '#f8fafc', fontSize: 14 }}>NAEN Studios Curated Resource Library</strong>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 999, padding: '1px 8px', letterSpacing: '0.05em' }}>
              OFFICIAL NAEN STUDIOS ACCREDITATION
            </span>
          </div>
          Vetted architectural whitepapers, authoritative cloud documentation, and hands-on threat labs verified by NAEN Studios Security Engineers for AWS career readiness.
        </div>
      </div>
      {topic.keyTakeaways && topic.keyTakeaways.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 700 }}>📋 Topic Summary — Key Points</div>
          <div style={{ padding: 16, background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 10 }}>
            {topic.keyTakeaways.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '6px 0', borderBottom: i < topic.keyTakeaways.length - 1 ? '1px solid rgba(148,163,184,0.07)' : 'none' }}>
                <Star size={12} style={{ color: '#38bdf8', marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {unique.length > 0 && (
        <>
          <div style={{ fontSize: 11, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={13} />
            <span>NAEN Studios Vetted Resources & Official AWS References</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {unique.map((res, i) => {
              const { color, tag } = getColor(res)
              return (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(15,23,42,0.85)', border: `1px solid ${color}22`, borderLeft: `3px solid ${color}`, borderRadius: 8, textDecoration: 'none', transition: 'background 0.2s ease', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(30,41,59,0.9)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.85)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ padding: '3px 8px', borderRadius: 4, background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', fontSize: 9, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
                      NAEN STUDIOS
                    </span>
                    <div style={{ padding: '3px 8px', borderRadius: 4, background: `${color}18`, fontSize: 10, fontWeight: 700, color, whiteSpace: 'nowrap' }}>
                      {tag}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.title}</div>
                    {(res.why || res.description) && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{res.why || res.description}</div>}
                  </div>
                  <Download size={13} style={{ color: '#475569', flexShrink: 0 }} />
                </a>
              )
            })}
          </div>
        </>
      )}
      {unique.length === 0 && (
        <div style={{ textAlign: 'center', padding: 30, color: '#475569', border: '1px dashed rgba(148,163,184,0.15)', borderRadius: 10 }}>
          <FileText size={24} style={{ marginBottom: 8, color: '#334155' }} />
          <div style={{ fontSize: 13 }}>No supplementary references for this topic yet.</div>
        </div>
      )}
    </div>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'theory', label: 'Theory & Architecture', icon: <BookOpen size={14} />, desc: 'Core concepts & interactive visual flow' },
  { id: 'jobReadiness', label: 'AWS Interview & Job Defense', icon: <Briefcase size={14} />, desc: 'STAR answers & production CLI audits' },
  { id: 'howItWorks', label: 'How It Works', icon: <Zap size={14} />, desc: 'Step-by-step mechanics & hardening flow' },
  { id: 'liveCli', label: 'Live CLI Sandbox', icon: <Terminal size={14} />, desc: 'Run commands interactively' },
  { id: 'multiCloud', label: 'Multi-Cloud Crosswalk (Azure / GCP)', icon: <Globe size={14} />, desc: 'Side-by-side AWS vs Azure vs GCP architecture & CLI matrix' },
  { id: 'recap', label: 'Recap & Refs', icon: <FileText size={14} />, desc: 'PDFs & references only (supplementary)' },
]

export default function InteractiveTopicEngine({ topic, pathResources = [], learningBlueprint = [] }) {
  const [active, setActive] = useState('theory')
  useEffect(() => { setActive('theory') }, [topic?.id])
  if (!topic) return null

  return (
    <div style={{ width: '100%' }}>
      {/* Tab strip */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid rgba(148,163,184,0.12)', marginBottom: 20, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TABS.map(tab => {
          const on = active === tab.id
          return (
            <button key={tab.id} type="button" onClick={() => setActive(tab.id)} title={tab.desc}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', border: 'none', borderBottom: on ? '2px solid #38bdf8' : '2px solid transparent', background: 'transparent', color: on ? '#38bdf8' : '#64748b', fontSize: 13, fontWeight: on ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap', fontFamily: 'inherit' }}
              onMouseEnter={e => { if (!on) e.currentTarget.style.color = '#94a3b8' }}
              onMouseLeave={e => { if (!on) e.currentTarget.style.color = '#64748b' }}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'recap' && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'rgba(148,163,184,0.12)', color: '#475569', fontWeight: 700 }}>REFS</span>}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div style={{ minHeight: 200 }}>
        {active === 'theory' && <TheoryTab topic={topic} />}
        {active === 'jobReadiness' && <TopicJobReadinessCard topic={topic} pathId={topic.pathId} />}
        {active === 'howItWorks' && <HowItWorksTab topic={topic} />}
        {active === 'liveCli' && <LiveCliTab topic={topic} />}
        {active === 'multiCloud' && <TopicMultiCloudCrosswalk topic={topic} pathId={topic.pathId} />}
        {active === 'recap' && <RecapTab topic={topic} pathResources={pathResources} learningBlueprint={learningBlueprint} />}
      </div>
    </div>
  )
}
