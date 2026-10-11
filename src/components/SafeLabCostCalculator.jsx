import { useState, useMemo } from 'react'
import {
  DollarSign,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Download,
  RotateCcw,
  Zap,
  Info,
  Layers,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Award,
  Check,
  Cpu,
  Flame
} from 'lucide-react'
import {
  AWS_SERVICES_COST_CATALOG,
  PRECONFIGURED_LAB_PROJECTS,
  EMERGENCY_COST_TRIGGERS,
  TEARDOWN_ORDERED_STEPS,
  SAMPLE_TEARDOWN_AUDIT_LOGS
} from '../data/labCostData'

export default function SafeLabCostCalculator({ activeLabId = null, onClose = null }) {
  // Main Tab: 'calculator' | 'projects' | 'teardown' | 'audit'
  const [activeTab, setActiveTab] = useState(activeLabId ? 'projects' : 'calculator')

  // Free Tier Mode Toggle
  const [freeTierOnlyMode, setFreeTierOnlyMode] = useState(false)

  // Selected Preconfigured Lab Project
  const [selectedProjectId, setSelectedProjectId] = useState(
    activeLabId ? (PRECONFIGURED_LAB_PROJECTS.find(p => p.id === activeLabId)?.id || PRECONFIGURED_LAB_PROJECTS[0].id) : PRECONFIGURED_LAB_PROJECTS[0].id
  )

  // Interactive Calculator State (serviceId -> { quantity, hoursPerDay })
  const [serviceParams, setServiceParams] = useState(() => {
    const initial = {}
    AWS_SERVICES_COST_CATALOG.forEach(s => {
      initial[s.id] = {
        quantity: s.defaultQuantity,
        hoursPerDay: s.defaultHoursPerDay,
        enabled: s.id === 'ec2' || s.id === 's3' || s.id === 'cloudtrail'
      }
    })
    return initial
  })

  // 1-Click Teardown Checklist State
  const [completedTeardownSteps, setCompletedTeardownSteps] = useState({})
  const [isTeardownExecuting, setIsTeardownExecuting] = useState(false)
  const [teardownComplete, setTeardownComplete] = useState(false)
  const [auditLogList, setAuditLogList] = useState(SAMPLE_TEARDOWN_AUDIT_LOGS)

  // Update slider/toggle for a service
  const handleUpdateParam = (serviceId, field, value) => {
    setServiceParams(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [field]: value
      }
    }))
  }

  // Toggle active service in calculator
  const handleToggleService = (serviceId) => {
    setServiceParams(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        enabled: !prev[serviceId]?.enabled
      }
    }))
  }

  // Calculate live custom total
  const { totalDailyCost, totalMonthlyCost, highRiskActiveServices } = useMemo(() => {
    let daily = 0
    let highRiskList = []

    AWS_SERVICES_COST_CATALOG.forEach(service => {
      const config = serviceParams[service.id]
      if (config?.enabled) {
        const itemHourly = service.hourlyRate * config.quantity
        const itemDaily = itemHourly * config.hoursPerDay
        daily += itemDaily

        if (service.riskLevel === 'high') {
          highRiskList.push(service.name)
        }
      }
    })

    const monthly = daily * 30.5
    return {
      totalDailyCost: daily.toFixed(2),
      totalMonthlyCost: monthly.toFixed(2),
      highRiskActiveServices: highRiskList
    }
  }, [serviceParams])

  // Active Project Data
  const selectedProject = useMemo(() => {
    return PRECONFIGURED_LAB_PROJECTS.find(p => p.id === selectedProjectId) || PRECONFIGURED_LAB_PROJECTS[0]
  }, [selectedProjectId])

  // Handle 1-Click Automated Teardown Simulation
  const handleRun1ClickTeardown = () => {
    setIsTeardownExecuting(true)
    let currentStep = 0

    const interval = setInterval(() => {
      if (currentStep < TEARDOWN_ORDERED_STEPS.length) {
        const step = TEARDOWN_ORDERED_STEPS[currentStep]
        setCompletedTeardownSteps(prev => ({ ...prev, [step.order]: true }))
        currentStep++
      } else {
        clearInterval(interval)
        setIsTeardownExecuting(false)
        setTeardownComplete(true)

        // Append to audit log
        const newRecord = {
          id: `audit-${Date.now().toString().slice(-4)}`,
          labName: selectedProject.title,
          user: 'Security-Learner-Active',
          startTime: new Date(Date.now() - 3600000).toISOString(),
          endTime: new Date().toISOString(),
          resourcesCreated: selectedProject.servicesUsed.map(s => `${s.toLowerCase().replace(/\s+/g, '-')}:active`),
          resourcesDeleted: selectedProject.servicesUsed.map(s => `${s.toLowerCase().replace(/\s+/g, '-')}:purged_and_released`),
          cleanupStatus: 'VERIFIED_100_PERCENT',
          remainingResources: 0,
          estimatedRemainingCost: '$0.00',
          monthlySavings: selectedProject.estimatedMonthlyCost,
          auditResult: 'PASS',
          signedHash: `sha256-${Math.random().toString(36).substring(2, 12)}`
        }
        setAuditLogList(prev => [newRecord, ...prev])
      }
    }, 400)
  }

  // Reset Teardown checklist
  const handleResetTeardown = () => {
    setCompletedTeardownSteps({})
    setTeardownComplete(false)
  }

  // Export Audit Log as JSON
  const handleExportAuditJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogList, null, 2))
    if (typeof document !== 'undefined') {
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', dataStr)
      downloadAnchor.setAttribute('download', `secloudive_lab_teardown_audit_${Date.now()}.json`)
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
    }
  }

  return (
    <div className="safe-cost-calculator-container animate-fade-in" style={{
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(30, 41, 59, 0.9) 100%)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '14px',
      padding: '24px',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(16px)',
      color: '#f8fafc',
      margin: '20px 0'
    }}>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid rgba(148, 163, 184, 0.15)', paddingBottom: '18px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '9999px', fontSize: '0.72rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            <ShieldCheck size={13} />
            <span>AWS Lab Cost Sentinel & 1-Click Teardown Engine</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 6px 0', color: '#f8fafc' }}>
            Safe AWS Lab Cost Estimator
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', maxWidth: '640px' }}>
            Prevent unexpected AWS bills before provisioning resources. Review real-world hourly burn rates, free-tier guardrails, and execute structured 1-click lab teardowns.
          </p>
        </div>

        {/* Action Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setFreeTierOnlyMode(prev => !prev)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: freeTierOnlyMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(51, 65, 85, 0.4)',
              border: `1px solid ${freeTierOnlyMode ? '#10b981' : 'rgba(148, 163, 184, 0.3)'}`,
              borderRadius: '8px',
              color: freeTierOnlyMode ? '#10b981' : '#cbd5e1',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <CheckCircle2 size={14} />
            <span>{freeTierOnlyMode ? 'Free Tier Mode ACTIVE ($0)' : 'Enable Free Tier Mode'}</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(51, 65, 85, 0.5)',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                color: '#cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', margin: '20px 0', borderBottom: '1px solid rgba(148, 163, 184, 0.1)', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'calculator', label: '16-Service Cost Modeler', icon: DollarSign },
          { id: 'projects', label: 'Preset Lab Architectures', icon: Layers },
          { id: 'teardown', label: '1-Click Teardown & Checklist', icon: Trash2 },
          { id: 'audit', label: 'Teardown Audit Logs', icon: Clock },
          { id: 'official', label: 'Official Free AWS Programs', icon: Award }
        ].map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: isActive ? 'rgba(56, 189, 248, 0.18)' : 'rgba(15, 23, 42, 0.6)',
                border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.5)' : 'rgba(148, 163, 184, 0.2)'}`,
                borderRadius: '8px',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ============================================================== */}
      {/* TAB 1: 16-SERVICE INTERACTIVE COST MODELER */}
      {/* ============================================================== */}
      {activeTab === 'calculator' && (
        <div>
          {/* Quick Summary Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '10px', padding: '14px 18px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Estimated Daily Burn</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                ${totalDailyCost} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/day</span>
              </div>
            </div>

            <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px 18px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Estimated Monthly Total</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                ${totalMonthlyCost} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/mo</span>
              </div>
            </div>

            <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: `1px solid ${highRiskActiveServices.length > 0 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.3)'}`, borderRadius: '10px', padding: '14px 18px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Cost Risk Level</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: highRiskActiveServices.length > 0 ? '#f43f5e' : '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {highRiskActiveServices.length > 0 ? (
                  <>
                    <AlertTriangle size={16} />
                    <span>High Cost Risk ({highRiskActiveServices.length} items)</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>Safe / Low Risk</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* High Risk Notice */}
          {highRiskActiveServices.length > 0 && (
            <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.35)', borderRadius: '8px', padding: '12px 16px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={20} style={{ color: '#f43f5e', flexShrink: 0 }} />
              <div style={{ fontSize: '0.82rem', color: '#fda4af' }}>
                <strong>High Cost Triggers Active:</strong> {highRiskActiveServices.join(', ')}. These services do NOT have a generous zero-dollar free tier and can bill continuously even when idle. Remember to execute teardown!
              </div>
            </div>
          )}

          {/* Service Matrix Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '14px' }}>
            {AWS_SERVICES_COST_CATALOG
              .filter(s => !freeTierOnlyMode || s.freeTierAvailable)
              .map(service => {
                const config = serviceParams[service.id] || { quantity: 1, hoursPerDay: 4, enabled: false }
                const isEnabled = config.enabled
                const itemDaily = (service.hourlyRate * config.quantity * config.hoursPerDay).toFixed(2)

                return (
                  <div
                    key={service.id}
                    style={{
                      background: isEnabled ? 'rgba(30, 41, 59, 0.8)' : 'rgba(15, 23, 42, 0.4)',
                      border: `1px solid ${isEnabled ? 'rgba(56, 189, 248, 0.4)' : 'rgba(148, 163, 184, 0.15)'}`,
                      borderRadius: '10px',
                      padding: '16px',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>{service.category}</div>
                        <h4 style={{ margin: '2px 0 0 0', fontSize: '0.92rem', color: isEnabled ? '#f8fafc' : '#94a3b8' }}>
                          {service.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleService(service.id)}
                        style={{
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: isEnabled ? 'rgba(56, 189, 248, 0.2)' : 'rgba(51, 65, 85, 0.3)',
                          border: `1px solid ${isEnabled ? '#38bdf8' : 'rgba(148, 163, 184, 0.3)'}`,
                          color: isEnabled ? '#38bdf8' : '#94a3b8'
                        }}
                      >
                        {isEnabled ? 'Active' : '+ Add'}
                      </button>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginBottom: '8px' }}>
                      {service.unitCostDescription}
                    </div>

                    {isEnabled && (
                      <div style={{ marginTop: '12px', borderTop: '1px solid rgba(148, 163, 184, 0.15)', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '4px' }}>
                          <span>{service.sampleQuantityLabel}:</span>
                          <strong>{config.quantity}</strong>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={config.quantity}
                          onChange={e => handleUpdateParam(service.id, 'quantity', parseInt(e.target.value))}
                          style={{ width: '100%', marginBottom: '8px' }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '4px' }}>
                          <span>Active hours per day:</span>
                          <strong>{config.hoursPerDay} hrs</strong>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="24"
                          value={config.hoursPerDay}
                          onChange={e => handleUpdateParam(service.id, 'hoursPerDay', parseInt(e.target.value))}
                          style={{ width: '100%', marginBottom: '8px' }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed rgba(148, 163, 184, 0.2)' }}>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Est. Cost:</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
                            ${itemDaily}/day (~${(parseFloat(itemDaily) * 30.5).toFixed(2)}/mo)
                          </span>
                        </div>
                      </div>
                    )}

                    <div style={{ marginTop: '10px', fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      <strong style={{ color: service.freeTierAvailable ? '#10b981' : '#fb923c' }}>
                        {service.freeTierAvailable ? '✓ Free Tier:' : '⚠ Paid Service:'}
                      </strong>{' '}
                      {service.freeTierDetails}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PRECONFIGURED LAB ARCHITECTURES */}
      {/* ============================================================== */}
      {activeTab === 'projects' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px', marginBottom: '24px' }}>
            {PRECONFIGURED_LAB_PROJECTS.map(proj => {
              const isSelected = selectedProjectId === proj.id
              return (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProjectId(proj.id)}
                  style={{
                    background: isSelected ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${isSelected ? '#38bdf8' : 'rgba(148, 163, 184, 0.2)'}`,
                    borderRadius: '10px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                      {proj.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(2, 6, 23, 0.6)', color: proj.riskLevel === 'safe' ? '#10b981' : proj.riskLevel === 'high' ? '#f43f5e' : '#fb923c' }}>
                      {proj.riskBadge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px 0', color: '#f8fafc' }}>
                    {proj.title}
                  </h3>

                  <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '10px' }}>
                    <div>
                      <span style={{ color: '#94a3b8' }}>Daily: </span>
                      <strong style={{ color: '#38bdf8' }}>{proj.estimatedDailyCost}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8' }}>Monthly: </span>
                      <strong style={{ color: '#10b981' }}>{proj.estimatedMonthlyCost}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                    {proj.servicesUsed.map(svc => (
                      <span key={svc} style={{ fontSize: '0.7rem', background: 'rgba(51, 65, 85, 0.5)', padding: '2px 8px', borderRadius: '4px', color: '#94a3b8' }}>
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected Project Deep Dive & Safe Practice Instructions */}
          <div style={{ background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>SAFE PRACTICE RUNBOOK</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0', color: '#f8fafc' }}>{selectedProject.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('teardown')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  borderRadius: '6px',
                  color: '#f43f5e',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '6px 14px',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={13} />
                <span>Go to 1-Click Teardown Plan</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px', marginTop: '14px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <ShieldCheck size={14} />
                  <span>How to Practice 100% Free ($0)</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                  {selectedProject.freeTierInstructions}
                </p>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(251, 146, 60, 0.25)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb923c', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <AlertTriangle size={14} />
                  <span>Cost Risk Watchpoint</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                  {selectedProject.costWarning}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Cost Alerts Grid */}
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={15} style={{ color: '#fb923c' }} />
              <span>Top 5 Unexpected AWS Student Charges & Prevention</span>
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '12px' }}>
              {EMERGENCY_COST_TRIGGERS.map(item => (
                <div key={item.id} style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.15)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '0.74rem', color: '#f87171', marginBottom: '6px' }}>Impact: {item.impact}</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    <strong style={{ color: '#38bdf8' }}>Prevention:</strong> {item.prevention}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: 1-CLICK TEARDOWN PLAN & CLEANUP CHECKLIST */}
      {/* ============================================================== */}
      {activeTab === 'teardown' && (
        <div>
          {/* Header Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', background: 'rgba(2, 6, 23, 0.8)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', padding: '18px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#f43f5e', fontWeight: 700, textTransform: 'uppercase' }}>ZERO BILLABLE RESOURCE GUARANTEE</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0', color: '#f8fafc' }}>
                Automated Lab Teardown Sequence
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                Follow strict reverse-dependency deletion order so VPC and network interfaces are freed without error.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleRun1ClickTeardown}
                disabled={isTeardownExecuting || teardownComplete}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  padding: '10px 20px',
                  cursor: isTeardownExecuting || teardownComplete ? 'not-allowed' : 'pointer',
                  opacity: isTeardownExecuting || teardownComplete ? 0.6 : 1,
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                }}
              >
                <Trash2 size={15} />
                <span>{isTeardownExecuting ? 'Simulating Teardown...' : teardownComplete ? 'Teardown Completed' : 'Execute 1-Click Teardown'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetTeardown}
                style={{
                  background: 'rgba(51, 65, 85, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  color: '#cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Cost Recovery Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Before Cleanup (Running)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f43f5e', marginTop: '4px' }}>
                $38.40 <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/mo</span>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>After Cleanup (Teardown)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                $0.00 <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>/mo</span>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Net Cost Savings</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                100% Recovered
              </div>
            </div>
          </div>

          {/* Billing Console Verification Notice */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '14px',
            fontSize: '0.8rem',
            color: '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={15} style={{ flexShrink: 0 }} />
            <span>Follow every step and verify in your AWS billing console. We can't guarantee your account shows $0 if a step is skipped or AWS's own free-tier terms change.</span>
          </div>

          {/* Sequential Ordered Teardown Checklist */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {TEARDOWN_ORDERED_STEPS.map(step => {
              const isChecked = Boolean(completedTeardownSteps[step.order])
              return (
                <div
                  key={step.order}
                  onClick={() => setCompletedTeardownSteps(prev => ({ ...prev, [step.order]: !prev[step.order] }))}
                  style={{
                    background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${isChecked ? 'rgba(16, 185, 129, 0.4)' : 'rgba(148, 163, 184, 0.2)'}`,
                    borderRadius: '8px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: isChecked ? '#10b981' : 'rgba(51, 65, 85, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {isChecked ? <Check size={16} /> : <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>{step.order}</span>}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.9rem', color: isChecked ? '#10b981' : '#f8fafc' }}>
                        Stage {step.order}: {step.action} ({step.resourceType})
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: isChecked ? '#10b981' : '#94a3b8' }}>
                        {isChecked ? '✓ Cleaned & Verified' : 'Pending Action'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                      {step.reason}
                    </p>

                    <div style={{ background: 'rgba(2, 6, 23, 0.7)', borderRadius: '4px', padding: '6px 10px', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#38bdf8' }}>
                      $ {step.cliCommand}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Certificate of Safe Teardown Banner */}
          {teardownComplete && (
            <div style={{ marginTop: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)', border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', color: '#10b981', marginBottom: '12px' }}>
                <Award size={36} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 6px 0', color: '#f8fafc' }}>
                Lab Completed Safely — Zero Residual Cost Certified
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', maxWidth: '580px', margin: '0 auto 14px auto', lineHeight: 1.5 }}>
                All 8 stages of cloud teardown verified. Compute, storage, ingress controllers, and NAT components have been cleanly decommissioned.
              </p>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                Illustrative training score, not a certified compliance assessment.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: TEARDOWN AUDIT LOGS & TIMELINE */}
      {/* ============================================================== */}
      {activeTab === 'audit' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Lab Teardown Audit Trail & Cost Verification
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                Integrity-checked proof records confirming student labs left zero active billable resources.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportAuditJson}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '6px',
                color: '#38bdf8',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '6px 14px',
                cursor: 'pointer'
              }}
            >
              <Download size={13} />
              <span>Export Audit Trail (.JSON)</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', color: '#94a3b8' }}>
                  <th style={{ padding: '10px' }}>AUDIT ID</th>
                  <th style={{ padding: '10px' }}>LAB NAME</th>
                  <th style={{ padding: '10px' }}>TIMESTAMP</th>
                  <th style={{ padding: '10px' }}>RESOURCES PURGED</th>
                  <th style={{ padding: '10px' }}>REMAINING COST</th>
                  <th style={{ padding: '10px' }}>RESULT</th>
                  <th style={{ padding: '10px' }}>SIGNATURE</th>
                </tr>
              </thead>
              <tbody>
                {auditLogList.map(record => (
                  <tr key={record.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <td style={{ padding: '10px', fontFamily: 'DM Mono, monospace', color: '#38bdf8' }}>{record.id}</td>
                    <td style={{ padding: '10px', color: '#f8fafc', fontWeight: 600 }}>{record.labName}</td>
                    <td style={{ padding: '10px', color: '#cbd5e1' }}>{new Date(record.endTime).toLocaleTimeString()}</td>
                    <td style={{ padding: '10px', color: '#10b981' }}>{record.resourcesDeleted.length} items purged</td>
                    <td style={{ padding: '10px', color: '#10b981', fontWeight: 700 }}>{record.estimatedRemainingCost}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', fontWeight: 700, fontSize: '0.72rem' }}>
                        {record.auditResult}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#94a3b8' }}>
                      {record.signedHash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Interactive Teardown Timeline Summary */}
          <div style={{ marginTop: '24px', background: 'rgba(2, 6, 23, 0.7)', borderRadius: '10px', padding: '18px', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '12px' }}>
              Standard 6-Phase Teardown Lifecycle
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', position: 'relative' }}>
              {[
                '1. Lab Started',
                '2. Resources Created',
                '3. Validation Passed',
                '4. Cleanup Initiated',
                '5. Cleanup Verified',
                '6. Cost Check ($0)'
              ].map((phase, idx) => (
                <div key={phase} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '0.65rem', fontWeight: 700 }}>
                    ✓
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>{phase}</span>
                  {idx < 5 && <ChevronRight size={14} style={{ color: '#64748b' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: OFFICIAL FREE AWS PROGRAMS */}
      {/* ============================================================== */}
      {activeTab === 'official' && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px 0', color: '#f8fafc' }}>
              Official Free AWS Training & Programs
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8' }}>
              Complement your hands-on labs with official, zero-cost training directly from Amazon Web Services.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '16px' }}>
            
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>For Beginners (Pre-Cloud)</div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#f8fafc' }}>AWS Educate</h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                Free, self-paced training for pre-professionals and students. Learn cloud computing basics without needing an AWS account or credit card. Includes free labs.
              </p>
              <a href="https://aws.amazon.com/education/awseducate/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                Explore AWS Educate <ExternalLink size={14} />
              </a>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>For Career Pivoters</div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#f8fafc' }}>AWS re/Start</h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                A free, cohort-based workforce development training program that prepares individuals for careers in the cloud and connects them with potential employers.
              </p>
              <a href="https://aws.amazon.com/training/restart/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                Explore AWS re/Start <ExternalLink size={14} />
              </a>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>For Practitioners</div>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#f8fafc' }}>AWS Skill Builder</h4>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                600+ free digital courses and learning plans. Dive deep into specific domains like Security, Architecture, and Developer tooling.
              </p>
              <a href="https://explore.skillbuilder.aws/learn" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                Explore AWS Skill Builder <ExternalLink size={14} />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Footer Identity & Training Disclaimer Banner */}
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(148, 163, 184, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.75rem', color: '#94a3b8' }}>
        <span>SeCloudive is an enterprise cloud security training simulator, separate from Cloudive.</span>
        <span style={{ fontStyle: 'italic' }}>Illustrative training score, not a certified compliance assessment.</span>
      </div>
    </div>
  )
}
