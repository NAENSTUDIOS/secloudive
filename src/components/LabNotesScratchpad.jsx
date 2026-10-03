import { useState, useEffect, useRef } from 'react'
import {
  FileText,
  X,
  Copy,
  Check,
  Download,
  Trash2,
  Sparkles,
  Eye,
  Edit3,
  Terminal,
  ShieldAlert,
  Flame,
  Lightbulb,
  Maximize2
} from 'lucide-react'
import { useChallenges } from '../context/ChallengeContext'
import { fetchUserNote, saveUserNote } from '../services/supabaseProgressService'
import { generateNotesOrLabSteps } from '../services/notesAiEngine.js'
import '../styles/labNotesScratchpad.css'

export default function LabNotesScratchpad({
  contextId = 'general',
  contextTitle = 'General AWS Security Scratchpad',
  contextType = 'Technical Runbook',
  targetServices = [],
  mitreTechnique = null
}) {
  const { activeProfile } = useChallenges() || {}
  const userPrefix = activeProfile?.id || 'guest'

  const [isOpen, setIsOpen] = useState(false)
  const [scope, setScope] = useState('context') // 'context' | 'global'
  const [mode, setMode] = useState('edit') // 'edit' | 'preview'
  const [notes, setNotes] = useState('')
  const [lastSaved, setLastSaved] = useState('')
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef(null)

  // AI Generator state
  const [aiQuery, setAiQuery] = useState('')
  const [aiMode, setAiMode] = useState('BRIEF_NOTES') // 'BRIEF_NOTES' | 'SAFE_LAB_STEPS'
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [showAiGenerator, setShowAiGenerator] = useState(true)

  const effectiveContextId = scope === 'context' ? contextId : 'global'
  const storageKey = `secloudive_notes_${userPrefix}_${effectiveContextId}`

  // Load notes on mount or when context / scope changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setNotes(saved)

    if (userPrefix && userPrefix !== 'guest') {
      fetchUserNote(userPrefix, effectiveContextId).then(cloudNote => {
        if (cloudNote && cloudNote !== saved) {
          setNotes(cloudNote)
          localStorage.setItem(storageKey, cloudNote)
        }
      })
    }
  }, [storageKey, contextId, scope, userPrefix, effectiveContextId])

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (storageKey) {
        localStorage.setItem(storageKey, notes)
        setLastSaved(new Date().toLocaleTimeString())
        if (userPrefix && userPrefix !== 'guest') {
          saveUserNote(userPrefix, effectiveContextId, notes)
        }
      }
    }, 450)
    return () => clearTimeout(timer)
  }, [notes, storageKey, userPrefix, effectiveContextId])

  // Global event listeners
  useEffect(() => {
    const handleToggle = (e) => {
      if (!e?.detail?.contextId || e.detail.contextId === contextId) {
        setIsOpen((prev) => !prev)
      }
    }
    const handleOpen = (e) => {
      if (!e?.detail?.contextId || e.detail.contextId === contextId) {
        setIsOpen(true)
      }
    }

    window.addEventListener('toggle-lab-notes', handleToggle)
    window.addEventListener('open-lab-notes', handleOpen)
    return () => {
      window.removeEventListener('toggle-lab-notes', handleToggle)
      window.removeEventListener('open-lab-notes', handleOpen)
    }
  }, [contextId])

  // Check if current context has notes saved
  const hasContextNotes = Boolean(
    localStorage.getItem(`secloudive_notes_${userPrefix}_${contextId}`)?.trim()
  )

  // Append quick technical snippet
  const handleInsertSnippet = (snippet) => {
    setNotes((prev) => {
      const spacer = prev && !prev.endsWith('\n\n') ? '\n\n' : ''
      return prev + spacer + snippet + '\n'
    })
    setMode('edit')
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current.focus()
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight
      }, 50)
    }
  }

  // Generate Brief Notes or Safe Lab Steps via AI
  const handleGenerateAi = async (overrideQuery = null, overrideMode = null) => {
    const q = overrideQuery || aiQuery || contextTitle
    const m = overrideMode || aiMode
    if (!q || !q.trim()) return

    setIsGenerating(true)
    try {
      const res = await generateNotesOrLabSteps({
        topicOrQuery: q,
        mode: m,
        activeContextTitle: contextTitle
      })
      if (res?.markdown) {
        setAiResult(res)
      }
    } catch (err) {
      console.error('[LabNotesScratchpad] AI Generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  // Copy notes to clipboard
  const handleCopyNotes = () => {
    if (!notes.trim()) return
    navigator.clipboard.writeText(notes)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Download Markdown file (.md)
  const handleDownloadMarkdown = () => {
    if (!notes.trim()) return
    const filename = `SeCloudive-Notes-${contextId.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`
    const header = `# SeCloudive In-Lab Technical Notes
- **Context Type**: ${contextType}
- **Scenario**: ${contextTitle}
- **Target Services**: ${targetServices.join(', ') || 'AWS Security Controls'}
${mitreTechnique ? `- **MITRE ATT&CK**: ${mitreTechnique}\n` : ''}- **Timestamp**: ${new Date().toLocaleString()}
- **Author**: Candidate Cloud Security Engineer

---

`
    const fullContent = header + notes
    const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Clear notes with confirmation
  const handleClearNotes = () => {
    if (window.confirm('Clear all notes in this scratchpad? This cannot be undone.')) {
      setNotes('')
      localStorage.removeItem(storageKey)
    }
  }

  // Word and character count
  const charCount = notes.length
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0

  // Render markdown lines for simple preview
  const renderMarkdownPreview = (text) => {
    if (!text.trim()) {
      return (
        <div style={{ color: '#64748b', fontStyle: 'italic', padding: '20px 0' }}>
          No observations recorded yet. Type technical notes or insert templates above.
        </div>
      )
    }

    const lines = text.split('\n')
    const elements = []
    let inCodeBlock = false
    let codeBuffer = []

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre key={`code-${idx}`}>
              <code>{codeBuffer.join('\n')}</code>
            </pre>
          )
          codeBuffer = []
          inCodeBlock = false
        } else {
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeBuffer.push(line)
        return
      }

      if (line.startsWith('### ')) {
        elements.push(<h3 key={idx}>{line.replace('### ', '')}</h3>)
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={idx}>{line.replace('## ', '')}</h2>)
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={idx}>{line.replace('# ', '')}</h1>)
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={idx} style={{ marginLeft: '16px' }}>
            {line.substring(2)}
          </li>
        )
      } else if (line.trim() === '') {
        elements.push(<div key={idx} style={{ height: '8px' }} />)
      } else {
        elements.push(<p key={idx} style={{ margin: '4px 0' }}>{line}</p>)
      }
    })

    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <pre key="code-final">
          <code>{codeBuffer.join('\n')}</code>
        </pre>
      )
    }

    return elements
  }

  return (
    <>
      {/* Floating Edge Trigger Tab */}
      <button
        type="button"
        className="notes-floating-tab"
        onClick={() => setIsOpen(true)}
        title="Open In-Lab Notes & Technical Scratchpad"
        aria-label="Open In-Lab Notes & Scratchpad"
      >
        <FileText size={15} />
        <span>Notes & Scratchpad</span>
        {hasContextNotes && <span className="notes-tab-badge" title="Notes recorded" />}
      </button>

      {/* Drawer Overlay & Panel */}
      {isOpen && (
        <div
          className="notes-drawer-backdrop"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="notes-drawer-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Student In-Lab Notes & Scratchpad Drawer"
          >
            {/* Header */}
            <div className="notes-drawer-header">
              <div className="notes-header-left">
                <div className="notes-header-icon">
                  <FileText size={18} />
                </div>
                <div className="notes-header-title-box">
                  <h3>Notes & Technical Scratchpad</h3>
                  <div className="notes-header-sub">
                    {scope === 'context' ? contextTitle : 'Global Engineering Scratchpad'}
                  </div>
                </div>
              </div>
              <button
                className="btn-notes-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close Notes"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scope Bar (This Lab vs Global) & Autosave */}
            <div className="notes-scope-bar">
              <div className="notes-scope-pills">
                <button
                  type="button"
                  className={`notes-scope-pill-btn ${scope === 'context' ? 'is-active' : ''}`}
                  onClick={() => setScope('context')}
                >
                  This Scenario
                </button>
                <button
                  type="button"
                  className={`notes-scope-pill-btn ${scope === 'global' ? 'is-active' : ''}`}
                  onClick={() => setScope('global')}
                >
                  Global Scratchpad
                </button>
              </div>

              {lastSaved && (
                <div className="notes-autosave-indicator">
                  <span className="notes-pulse-dot" />
                  <span>Auto-saved {lastSaved}</span>
                </div>
              )}
            </div>

            {/* AI Notes & Safe Lab Generator */}
            <div className="notes-ai-section">
              <div className="notes-ai-header-row">
                <div className="notes-ai-title">
                  <Sparkles size={14} className="text-sky" />
                  <span>AI Notes & Safe Lab Generator</span>
                </div>
                <div className="notes-ai-mode-toggle">
                  <button
                    type="button"
                    className={`notes-ai-mode-pill ${aiMode === 'BRIEF_NOTES' ? 'is-active' : ''}`}
                    onClick={() => setAiMode('BRIEF_NOTES')}
                    title="Generate brief, high-yield technical notes"
                  >
                    📋 Brief Notes
                  </button>
                  <button
                    type="button"
                    className={`notes-ai-mode-pill ${aiMode === 'SAFE_LAB_STEPS' ? 'is-active' : ''}`}
                    onClick={() => setAiMode('SAFE_LAB_STEPS')}
                    title="Generate complete, $0 safe step-by-step lab steps"
                  >
                    🛠️ Safe Lab Steps
                  </button>
                </div>
              </div>

              <div className="notes-ai-input-row">
                <input
                  type="text"
                  className="notes-ai-input"
                  placeholder={aiMode === 'BRIEF_NOTES' 
                    ? "Ask any topic for brief notes (e.g. 'Kubernetes RBAC', 'IAM PrivEsc', 'Terraform State')..."
                    : "Ask any lab/task for safe steps (e.g. 'S3 Bucket Public Access Audit', 'IAM Key Rotation')..."}
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleGenerateAi()
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn-ai-generate"
                  onClick={() => handleGenerateAi()}
                  disabled={isGenerating}
                >
                  <Sparkles size={13} />
                  <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
                </button>
              </div>

              {/* Quick Topic Chips */}
              <div className="notes-ai-quick-chips">
                {[
                  'AWS IAM Least Privilege',
                  'S3 Ransomware Lock',
                  'Kubernetes RBAC',
                  'Docker Hardening',
                  'Terraform Security',
                  'CloudTrail Forensics',
                  'Zero-Cost Safe Labs'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className="ai-topic-chip"
                    onClick={() => {
                      setAiQuery(chip)
                      handleGenerateAi(chip)
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* AI Generated Result Preview Box */}
              {aiResult && (
                <div className="notes-ai-result-box">
                  <div className="notes-ai-result-header">
                    <span className="notes-ai-badge">
                      ✓ {aiResult.mode === 'SAFE_LAB_STEPS' ? 'Safe Lab Runbook' : 'Brief Technical Notes'}
                    </span>
                    <div className="notes-ai-actions">
                      <button
                        type="button"
                        className="btn-ai-action primary"
                        onClick={() => handleInsertSnippet(aiResult.markdown)}
                        title="Append this result to your active scratchpad notes"
                      >
                        + Append to Notes
                      </button>
                      <button
                        type="button"
                        className="btn-ai-action"
                        onClick={() => {
                          if (window.confirm('Replace current scratchpad with this generated content?')) {
                            setNotes(aiResult.markdown)
                            setMode('preview')
                          }
                        }}
                        title="Replace scratchpad content with this output"
                      >
                        Replace Notes
                      </button>
                      <button
                        type="button"
                        className="btn-ai-action"
                        onClick={() => {
                          navigator.clipboard.writeText(aiResult.markdown)
                          alert('Copied AI generated notes to clipboard!')
                        }}
                        title="Copy markdown to clipboard"
                      >
                        <Copy size={11} /> Copy
                      </button>
                      <button
                        type="button"
                        className="btn-ai-action"
                        onClick={() => setAiResult(null)}
                        title="Dismiss preview"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                  <div style={{ maxHeight: '140px', overflowY: 'auto' }}>
                    {renderMarkdownPreview(aiResult.markdown)}
                  </div>
                </div>
              )}
            </div>

            {/* Quick-Insert Engineering Prompts */}
            <div className="notes-quick-prompts-bar">
              <span className="quick-prompt-label">Insert:</span>
              <button
                type="button"
                className="quick-prompt-chip"
                onClick={() =>
                  handleInsertSnippet(
                    '### 🔍 Root Cause Analysis\n- **Vulnerable Resource**: \n- **Observed Vector**: \n- **Architectural Flaw**: '
                  )
                }
                title="Insert Root Cause Analysis Framework"
              >
                <ShieldAlert size={12} className="text-amber" />
                <span>+ Root Cause</span>
              </button>
              <button
                type="button"
                className="quick-prompt-chip"
                onClick={() =>
                  handleInsertSnippet(
                    '```bash\n# AWS CLI Forensic Evidence\naws ...\n```'
                  )
                }
                title="Insert AWS CLI Command snippet"
              >
                <Terminal size={12} className="text-sky" />
                <span>+ AWS CLI Evidence</span>
              </button>
              <button
                type="button"
                className="quick-prompt-chip"
                onClick={() =>
                  handleInsertSnippet(
                    '### 💡 Interview STAR Talking Point\n- **Situation**: Handled an incident involving...\n- **Task**: Neutralize the threat while preserving business availability.\n- **Action**: Diagnosed the root cause in CloudTrail and updated IAM boundaries.\n- **Result**: Reduced MTTD to <15 minutes and automated remediation.'
                  )
                }
                title="Insert Interview Answer Template"
              >
                <Lightbulb size={12} className="text-emerald" />
                <span>+ Interview STAR Point</span>
              </button>
              <button
                type="button"
                className="quick-prompt-chip"
                onClick={() =>
                  handleInsertSnippet(
                    '### 🛡️ Remediation SOP\n1. Immediate Containment: \n2. Eradication & Key Rotation: \n3. Long-Term Guardrails (SCP / WAF): '
                  )
                }
                title="Insert Remediation SOP Framework"
              >
                <Sparkles size={12} className="text-purple" />
                <span>+ Remediation SOP</span>
              </button>
            </div>

            {/* Mode & Tools Bar */}
            <div className="notes-toolbar">
              <div className="notes-mode-tabs">
                <button
                  type="button"
                  className={`notes-mode-btn ${mode === 'edit' ? 'is-active' : ''}`}
                  onClick={() => setMode('edit')}
                >
                  <Edit3 size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Edit
                </button>
                <button
                  type="button"
                  className={`notes-mode-btn ${mode === 'preview' ? 'is-active' : ''}`}
                  onClick={() => setMode('preview')}
                >
                  <Eye size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Preview
                </button>
              </div>

              <div className="notes-tools-right">
                <button
                  type="button"
                  className="btn-note-tool"
                  onClick={handleCopyNotes}
                  disabled={!notes.trim()}
                  title="Copy to Clipboard"
                >
                  {copied ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  className="btn-note-tool"
                  onClick={handleDownloadMarkdown}
                  disabled={!notes.trim()}
                  title="Download as .MD file"
                >
                  <Download size={12} />
                  <span>Download .MD</span>
                </button>
                <button
                  type="button"
                  className="btn-note-tool btn-danger"
                  onClick={handleClearNotes}
                  disabled={!notes.trim()}
                  title="Clear Notes"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Main Editor / Preview Body */}
            <div className="notes-editor-area">
              {mode === 'edit' ? (
                <textarea
                  ref={textareaRef}
                  className="notes-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={`Write technical observations, AWS CLI commands, or interview talking points for this scenario...

Tip: Click "+ Root Cause", "+ AWS CLI Evidence", or "+ Interview STAR Point" above to quickly insert technical response frameworks.`}
                  spellCheck={false}
                />
              ) : (
                <div className="notes-markdown-preview">
                  {renderMarkdownPreview(notes)}
                </div>
              )}
            </div>

            {/* Footer Stats Bar */}
            <div className="notes-drawer-footer">
              <span>
                {wordCount} words • {charCount} chars
              </span>
              <span>
                Markdown Supported • Persistent LocalStorage
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
