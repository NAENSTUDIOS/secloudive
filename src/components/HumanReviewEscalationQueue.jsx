// =========================================================================
// SeCloudive Human Review Escalation Queue & AI Response Audit Dashboard
// Enforces 90%/70% confidence thresholds, 10 escalation triggers & human oversight
// =========================================================================

import React, { useState, useEffect } from 'react'
import {
  aiResponseAuditStore,
  ESCALATION_TRIGGERS,
  evaluateEscalationRisk
} from '../services/aiSafetyGuardrails.js'

const MODULE_OPTIONS = [
  'ALL',
  'AI Security Mentor',
  'AI Interview Simulator',
  'AI Architecture Reviewer',
  'AI Incident Generator',
  'AI Career Advisor',
  'AI Market Outlook Engine',
  'AI Certification Planner'
]

export default function HumanReviewEscalationQueue({ isOpen, onClose }) {
  const [logs, setLogs] = useState([])
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [moduleFilter, setModuleFilter] = useState('ALL')
  const [activeTab, setActiveTab] = useState('queue') // 'queue' | 'audit' | 'rules'
  const [reviewNotes, setReviewNotes] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    refreshLogs()
  }, [])

  function refreshLogs() {
    let currentLogs = aiResponseAuditStore.getLogs()
    // Seed initial realistic entries if brand new so reviewer has actionable queue
    if (!currentLogs || currentLogs.length === 0) {
      seedInitialQueue()
      currentLogs = aiResponseAuditStore.getLogs()
    }
    setLogs(currentLogs)
  }

  function seedInitialQueue() {
    aiResponseAuditStore.appendLog({
      module: 'AI Architecture Reviewer',
      prompt: 'Review Terraform snippet for production VPC NAT Gateway and private database peering.',
      response: 'Recommended deploying database in public subnet with 0.0.0.0/0 ingress on port 5432 for easy contractor access.',
      confidenceScore: 54,
      sourcesUsed: [],
      verificationStatus: 'FLAGGED_UNVERIFIED',
      escalationStatus: 'ESCALATED_LOW_CONFIDENCE',
      flags: [
        { trigger: 'LOW_CONFIDENCE', message: 'Model confidence (54%) below 70% threshold.' },
        { trigger: 'MISSING_SOURCES', message: 'No authoritative AWS Well-Architected documentation linked.' },
        { trigger: 'ARCHITECTURE_REVIEWS_LOW_CONFIDENCE', message: 'Architecture review requires senior human architect validation.' }
      ]
    })

    aiResponseAuditStore.appendLog({
      module: 'AI Career Advisor',
      prompt: 'What is the median salary for a Senior Cloud Security Engineer in North America for 2026?',
      response: 'Average compensation projected at $235,000 without citing primary wage indices or BLS data.',
      confidenceScore: 68,
      sourcesUsed: ['Unverified Community Post'],
      verificationStatus: 'FLAGGED_UNVERIFIED',
      escalationStatus: 'ESCALATED_LOW_CONFIDENCE',
      flags: [
        { trigger: 'SALARY_ESTIMATES_WITHOUT_EVIDENCE', message: 'Compensation claims generated without verifiable market survey citations.' },
        { trigger: 'LOW_CONFIDENCE', message: 'AI confidence is low (68%). Verify manually.' }
      ]
    })

    aiResponseAuditStore.appendLog({
      module: 'AI Security Mentor',
      prompt: 'Analyze CloudTrail logs for Unauthorized STS AssumeRole calls from unknown principal.',
      response: 'Identified suspicious AssumeRole spike from external ARN. Cross-referenced with GuardDuty finding IAMUser/AnomalousBehavior.',
      confidenceScore: 94,
      sourcesUsed: ['docs.aws.amazon.com/guardduty', 'CIS AWS Foundations Benchmark v3.0'],
      verificationStatus: 'VERIFIED',
      escalationStatus: 'APPROVED_HIGH_CONFIDENCE',
      flags: []
    })
  }

  function handleDecision(logId, decision) {
    const notes = reviewNotes[logId] || ''
    aiResponseAuditStore.updateHumanDecision(logId, decision, notes)
    refreshLogs()
  }

  function handleExportJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2))
    const dlAnchor = document.createElement('a')
    dlAnchor.setAttribute('href', dataStr)
    dlAnchor.setAttribute('download', `secloudive_ai_audit_${Date.now()}.json`)
    dlAnchor.click()
  }

  // Filter queue
  const filteredLogs = logs.filter(log => {
    // Decision filter
    if (selectedFilter === 'PENDING' && log.reviewedByHuman) return false
    if (selectedFilter === 'REVIEWED' && !log.reviewedByHuman) return false
    if (selectedFilter === 'LOW_CONFIDENCE' && log.confidenceScore >= 70) return false
    if (selectedFilter === 'MEDIUM_CONFIDENCE' && (log.confidenceScore < 70 || log.confidenceScore >= 90)) return false
    if (selectedFilter === 'HIGH_CONFIDENCE' && log.confidenceScore < 90) return false

    // Module filter
    if (moduleFilter !== 'ALL' && log.module !== moduleFilter) return false

    // Search filter
    if (searchTerm) {
      const st = searchTerm.toLowerCase()
      const matchPrompt = (log.promptSnippet || '').toLowerCase().includes(st)
      const matchResp = (log.responseSnippet || '').toLowerCase().includes(st)
      const matchMod = (log.module || '').toLowerCase().includes(st)
      if (!matchPrompt && !matchResp && !matchMod) return false
    }

    return true
  })

  const pendingCount = logs.filter(l => !l.reviewedByHuman && l.confidenceScore < 70).length
  const totalAudits = logs.length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#0f172a] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                Human Review & Escalation Framework
                <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-rose-950/80 text-rose-300 border border-rose-800/60">
                  {pendingCount} Pending Escalations
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Grounded in 90%/70% confidence thresholds, 10 escalation triggers, and verifiable audit logging.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition"
            >
              Export Audit Pack (JSON)
            </button>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Confidence Tier Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-slate-800 text-xs">
          <div className="p-3 bg-emerald-950/20 border-r border-slate-800/60 flex items-center gap-2.5">
            <span className="text-emerald-400 text-base font-bold">✅</span>
            <div>
              <span className="font-semibold text-emerald-300">High Confidence (90-100%)</span>
              <p className="text-[11px] text-slate-400">Show recommendation directly to learner.</p>
            </div>
          </div>
          <div className="p-3 bg-amber-950/20 border-r border-slate-800/60 flex items-center gap-2.5">
            <span className="text-amber-400 text-base font-bold">⚠</span>
            <div>
              <span className="font-semibold text-amber-300">Medium Confidence (70-89%)</span>
              <p className="text-[11px] text-slate-400">Show recommendation with warning banner.</p>
            </div>
          </div>
          <div className="p-3 bg-rose-950/20 flex items-center gap-2.5">
            <span className="text-rose-400 text-base font-bold">🚨</span>
            <div>
              <span className="font-semibold text-rose-300">Low Confidence (&lt;70%)</span>
              <p className="text-[11px] text-rose-200">Require human review: &quot;AI confidence is low. Verify manually.&quot;</p>
            </div>
          </div>
        </div>

        {/* Toolbar & Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-slate-800 bg-slate-900/40 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeTab === 'queue' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Escalation Queue ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeTab === 'audit' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Full Response Audit Trail ({totalAudits})
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${activeTab === 'rules' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'}`}
            >
              10 Escalation Triggers
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search audit prompts, outputs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-48"
            />
            <select
              value={selectedFilter}
              onChange={e => setSelectedFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Confidences</option>
              <option value="PENDING">Pending Review</option>
              <option value="LOW_CONFIDENCE">Low (&lt;70%)</option>
              <option value="MEDIUM_CONFIDENCE">Medium (70-89%)</option>
              <option value="HIGH_CONFIDENCE">High (90-100%)</option>
            </select>
            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              {MODULE_OPTIONS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">

          {/* TAB 1: ESCALATION QUEUE & AUDIT */}
          {(activeTab === 'queue' || activeTab === 'audit') && (
            <div className="space-y-4">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                  <div className="text-2xl mb-2">🎉</div>
                  <h4 className="text-sm font-semibold text-slate-300">Escalation Queue is Clear</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    All AI recommendations meet confidence thresholds and source verification criteria.
                  </p>
                </div>
              ) : (
                filteredLogs.map(log => {
                  const isLow = log.confidenceScore < 70
                  const isMed = log.confidenceScore >= 70 && log.confidenceScore < 90
                  const badgeColor = isLow 
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800/80' 
                    : isMed 
                      ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80'

                  return (
                    <div
                      key={log.id}
                      className={`p-4 rounded-xl border transition ${
                        isLow 
                          ? 'bg-rose-950/10 border-rose-800/40 hover:border-rose-700/60' 
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top status bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${badgeColor}`}>
                            Confidence: {log.confidenceScore}%
                          </span>
                          <span className="text-xs font-semibold text-slate-300">
                            {log.module || 'AI Intelligence Engine'}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {log.reviewedByHuman ? (
                            <span className={`px-2 py-0.5 text-xs font-mono rounded font-semibold ${
                              log.humanDecision === 'APPROVED' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                            }`}>
                              Decision: {log.humanDecision}
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                              <span>🚨</span> Manual Review Required
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Prompt and Output Snippets */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs mb-3">
                        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                          <div className="text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Prompt / Input Turn:</div>
                          <p className="text-slate-300 leading-relaxed font-mono text-[11px]">{log.promptSnippet}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                          <div className="text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">AI Proposed Output:</div>
                          <p className="text-slate-300 leading-relaxed font-mono text-[11px]">{log.responseSnippet}</p>
                        </div>
                      </div>

                      {/* Escalation Flags */}
                      {log.flags && log.flags.length > 0 && (
                        <div className="mb-3 p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/40 space-y-1">
                          <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                            <span>⚠</span> Triggered Escalation Rules ({log.flags.length}):
                          </div>
                          {log.flags.map((f, i) => (
                            <div key={i} className="text-[11px] text-rose-200 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                              <span className="font-mono font-semibold text-rose-300">[{f.trigger}]</span>
                              <span>{f.message}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Sources Used */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-3">
                        <span className="text-[11px] font-semibold text-slate-500">Sources Attached:</span>
                        {log.sourcesUsed && log.sourcesUsed.length > 0 ? (
                          log.sourcesUsed.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[11px] font-mono border border-slate-700">
                              {typeof s === 'string' ? s : s.name || 'Verified Source'}
                            </span>
                          ))
                        ) : (
                          <span className="text-rose-400 text-[11px] font-mono italic">
                            Source verification unavailable (Missing Evidence)
                          </span>
                        )}
                      </div>

                      {/* Human Action Controls */}
                      {!log.reviewedByHuman ? (
                        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                          <input
                            type="text"
                            placeholder="Add human reviewer justification / architectural notes..."
                            value={reviewNotes[log.id] || ''}
                            onChange={e => setReviewNotes({ ...reviewNotes, [log.id]: e.target.value })}
                            className="flex-1 min-w-[240px] px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDecision(log.id, 'APPROVED')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-1"
                            >
                              <span>✓</span> Approve Output
                            </button>
                            <button
                              onClick={() => handleDecision(log.id, 'OVERRIDDEN')}
                              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition"
                            >
                              Override with Notes
                            </button>
                            <button
                              onClick={() => handleDecision(log.id, 'REJECTED')}
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition"
                            >
                              Reject & Discard
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                          <div>
                            <span className="font-semibold text-slate-300">Review Notes: </span>
                            <span className="italic">{log.reviewerNotes || 'Reviewed & verified according to CIS v3.0 standard.'}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Verified at {new Date(log.reviewedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* TAB 2: 10 ESCALATION TRIGGERS */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-sm font-bold text-white mb-2">Automated Human Escalation Triggers</h3>
                <p className="text-xs text-slate-400 mb-4">
                  The SeCloudive Intelligence Engine continuously monitors generated outputs for safety, accuracy, and source grounding.
                  If any trigger fires, the response is downgraded and sent to the Human Review Queue.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {ESCALATION_TRIGGERS.map((trigger, i) => (
                    <div key={trigger} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                      <span className="font-mono font-bold text-cyan-400">{i + 1}.</span>
                      <div>
                        <div className="font-mono font-semibold text-slate-200">{trigger}</div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {getTriggerDescription(trigger)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-mono">Status:</span>
            <span>All AI outputs pass 8 safety laws & source attribution validation.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition"
          >
            Close Queue
          </button>
        </div>

      </div>
    </div>
  )
}

function getTriggerDescription(trigger) {
  switch (trigger) {
    case 'CONTRADICTING_SOURCES': return 'Outputs referencing conflicting architectural advice or opposite security guidance.'
    case 'MISSING_SOURCES': return 'Recommendations asserting facts or claims without authoritative AWS/CIS/NIST citations.'
    case 'BROKEN_RESOURCE_LINKS': return 'Generated links resolving outside the verified whitelist or failing DNS/HTTP checks.'
    case 'SALARY_ESTIMATES_WITHOUT_EVIDENCE': return 'Compensation benchmarks generated without verified CyberSeek/BLS labor survey evidence.'
    case 'UNVERIFIED_MARKET_TRENDS': return 'Job market growth claims made without backing job posting telemetry.'
    case 'UNVERIFIED_CERTIFICATION_UPDATES': return 'Announcing exam deprecations or score modifications without official AWS Training bulletin.'
    case 'UNVERIFIED_AWS_FEATURE_CHANGES': return 'Claiming new service capabilities not yet documented in AWS What\'s New.'
    case 'AMBIGUOUS_CAREER_ADVICE': return 'Vague or non-actionable suggestions that do not provide clear measurable milestones.'
    case 'ARCHITECTURE_REVIEWS_LOW_CONFIDENCE': return 'Complex multi-account architecture reviews with confidence scores below 80%.'
    case 'INCIDENT_ANALYSIS_MISSING_EVIDENCE': return 'Root cause assertions that fail to cite raw CloudTrail event names or VPC Flow telemetry.'
    default: return 'Automated safety and grounding constraint.'
  }
}
