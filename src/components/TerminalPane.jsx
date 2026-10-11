// =========================================================================
// SeCloudive Interactive Multi-Cloud Sandbox Terminal Emulator
// Provides instant command execution, realistic forensic outputs, and step verification
// =========================================================================

import React, { useState, useRef, useEffect } from 'react'
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react'

const SUGGESTED_COMMANDS = [
  'aws sts get-caller-identity',
  'aws s3 ls s3://customer-financial-vault --recursive',
  'aws iam get-role-policy --role-name ProductionAppProfile --policy-name S3Access',
  'aws ec2 describe-security-groups --group-names default',
  'az account show',
  'gcloud compute instances list',
  'kubectl get pods -n kube-system'
]

export default function TerminalPane({
  onCommandExecuted,
  onStepVerified,
  labId = 'LAB-01',
  activeStep,
  activeCloud = 'aws',
  pendingCommand = ''
}) {
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: `SeCloudive Cloud Security Sandbox v4.2 [Session: sess-${String(labId).toLowerCase()}].
Connected to isolated multi-cloud emulation engine.
Type 'help' for available CLI tools (aws, az, gcloud, kubectl, terraform) or run current SOP commands.`
    }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistoryList, setCommandHistoryList] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [copiedNotification, setCopiedNotification] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Listen to pendingCommand changes from outside (e.g. "Run in Shell" button)
  useEffect(() => {
    if (pendingCommand && pendingCommand.trim()) {
      handleExecuteCommand(pendingCommand.trim())
    }
  }, [pendingCommand])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleExecuteCommand = (cmdToRun) => {
    const rawCmd = (cmdToRun || currentInput).trim()
    if (!rawCmd) return

    // Add to history
    setCommandHistoryList(prev => [rawCmd, ...prev])
    setHistoryIdx(-1)

    // Evaluate
    const userLine = { type: 'user', text: rawCmd }
    const outputLine = evaluateCommand(rawCmd, activeStep, activeCloud)

    setHistory(prev => [...prev, userLine, outputLine])
    setCurrentInput('')

    // Notify hooks
    if (onCommandExecuted) {
      onCommandExecuted(rawCmd, outputLine.text)
    }

    if (outputLine.isVerified && onStepVerified && activeStep) {
      onStepVerified(activeStep.stepId)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleExecuteCommand()
    } else if (e.key === 'ArrowUp') {
      if (commandHistoryList.length > 0) {
        const nextIdx = Math.min(historyIdx + 1, commandHistoryList.length - 1)
        setHistoryIdx(nextIdx)
        setCurrentInput(commandHistoryList[nextIdx])
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1
        setHistoryIdx(nextIdx)
        setCurrentInput(commandHistoryList[nextIdx])
      } else if (historyIdx === 0) {
        setHistoryIdx(-1)
        setCurrentInput('')
      }
    }
  }

  const handleClear = () => {
    setHistory([{ type: 'system', text: 'Sandbox terminal output cleared.' }])
  }

  const handleCopyHistory = () => {
    const textToCopy = history
      .map(h => (h.type === 'user' ? `[operator@secloudive ~]$ ${h.text}` : h.text))
      .join('\n')
    navigator.clipboard.writeText(textToCopy)
    setCopiedNotification(true)
    setTimeout(() => setCopiedNotification(false), 2000)
  }

  // Get active step command snippet
  const activeStepCmd = activeStep?.cliCommand || ''

  return (
    <div style={{
      borderRadius: '10px',
      border: '1px solid #1e293b',
      background: '#020617',
      fontFamily: "'DM Mono', monospace",
      fontSize: '12px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'col',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Terminal Titlebar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        background: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '1px solid #1e293b'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          </div>
          <span style={{ color: '#94a3b8', fontWeight: 600, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TerminalIcon size={13} style={{ color: '#38bdf8' }} />
            secloudive-sandbox:~ ({labId} • {activeCloud.toUpperCase()})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {activeStepCmd && (
            <button
              type="button"
              onClick={() => setCurrentInput(activeStepCmd.split('\n')[0].replace(/^#.*$/, '').trim() || activeStepCmd)}
              style={{
                fontSize: '11px',
                color: '#38bdf8',
                padding: '3px 8px',
                borderRadius: '4px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Insert current step command into terminal"
            >
              <Zap size={11} /> Load Step Command
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyHistory}
            style={{
              fontSize: '11px',
              color: '#94a3b8',
              padding: '3px 8px',
              borderRadius: '4px',
              background: '#1e293b',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {copiedNotification ? <Check size={11} color="#10b981" /> : <Copy size={11} />}
            {copiedNotification ? 'Copied' : 'Copy'}
          </button>

          <button
            type="button"
            onClick={handleClear}
            style={{
              fontSize: '11px',
              color: '#94a3b8',
              padding: '3px 8px',
              borderRadius: '4px',
              background: '#1e293b',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Suggested Quick Commands Bar */}
      <div style={{
        padding: '6px 12px',
        background: 'rgba(2, 6, 23, 0.9)',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        fontSize: '11px'
      }}>
        <span style={{ color: '#64748b', flexShrink: 0, fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>
          Quick Probes:
        </span>
        {SUGGESTED_COMMANDS.slice(0, 4).map((cmd, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleExecuteCommand(cmd)}
            style={{
              flexShrink: 0,
              padding: '2px 8px',
              borderRadius: '4px',
              background: '#0f172a',
              color: '#7dd3fc',
              border: '1px solid #1e293b',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            {cmd.split(' ')[0]} {cmd.split(' ')[1] || ''}
          </button>
        ))}
      </div>

      {/* Output Console Buffer */}
      <div
        style={{
          padding: '16px',
          flex: 1,
          overflowY: 'auto',
          maxHeight: '340px',
          minHeight: '220px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          userSelect: 'text'
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, idx) => (
          <div key={idx} style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {entry.type === 'user' && (
              <div style={{ color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ color: '#38bdf8' }}>[operator@sandbox ~]$</span>
                <span>{entry.text}</span>
              </div>
            )}
            {entry.type === 'system' && (
              <div style={{ color: '#64748b', fontStyle: 'italic', fontSize: '11px' }}>{entry.text}</div>
            )}
            {entry.type === 'output' && (
              <div style={{
                color: '#e2e8f0',
                paddingLeft: '12px',
                borderLeft: entry.isVerified ? '2px solid #10b981' : '2px solid #334155',
                background: entry.isVerified ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                padding: '6px 12px',
                borderRadius: '0 6px 6px 0'
              }}>
                {entry.isVerified && (
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: '10px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={11} /> FORENSIC SIGNAL VALIDATED • STEP CHECK COMPLETE
                  </div>
                )}
                {entry.text}
              </div>
            )}
            {entry.type === 'error' && (
              <div style={{
                color: '#f87171',
                paddingLeft: '12px',
                borderLeft: '2px solid #ef4444',
                background: 'rgba(239, 68, 68, 0.05)',
                padding: '6px 12px',
                borderRadius: '0 6px 6px 0'
              }}>
                {entry.text}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt */}
      <div style={{
        padding: '10px 16px',
        background: '#090d16',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ color: '#38bdf8', fontWeight: 700, flexShrink: 0 }}>[operator@sandbox ~]$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={e => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Enter ${activeCloud.toUpperCase()} CLI command or click 'Load Step Command'...`}
          style={{
            flex: 1,
            background: 'transparent',
            color: '#f8fafc',
            border: 'none',
            outline: 'none',
            fontFamily: "'DM Mono', monospace",
            fontSize: '12px'
          }}
        />
        <button
          type="button"
          onClick={() => handleExecuteCommand()}
          disabled={!currentInput.trim()}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            background: currentInput.trim() ? '#0284c7' : '#1e293b',
            color: currentInput.trim() ? '#ffffff' : '#64748b',
            fontWeight: 600,
            fontSize: '11px',
            border: 'none',
            cursor: currentInput.trim() ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease'
          }}
        >
          <Play size={11} /> Run
        </button>
      </div>
    </div>
  )
}

function evaluateCommand(cmd, activeStep, activeCloud) {
  const c = cmd.toLowerCase().trim()

  if (c === 'help') {
    return {
      type: 'output',
      text: `SeCloudive Sandbox Diagnostic Suite:
  - aws sts get-caller-identity
  - aws s3 ls / s3api get-bucket-encryption / get-public-access-block
  - aws iam get-role / list-attached-role-policies / get-credential-report
  - aws ec2 describe-security-groups / describe-flow-logs
  - az account show / az storage account show
  - gcloud compute instances list / gcloud projects get-iam-policy
  - kubectl get pods / kubectl get networkpolicy
  - clear`
    }
  }

  // Check if this matches activeStep command or query
  if (activeStep) {
    const stepCmd = (activeStep.cliCommand || '').toLowerCase()
    const verifyCmd = (activeStep.verify || '').toLowerCase()
    const keywords = [
      activeStep.title?.toLowerCase(),
      stepCmd.split(' ')[0],
      stepCmd.split(' ')[1]
    ].filter(Boolean)

    const matchesStep = (stepCmd && c.includes(stepCmd.slice(0, 20))) ||
      (verifyCmd && c.includes(verifyCmd.slice(0, 20))) ||
      keywords.some(k => k.length > 4 && c.includes(k))

    if (matchesStep) {
      return {
        type: 'output',
        isVerified: true,
        text: activeStep.expectedOutput || `[SUCCESS] Output matched expected criteria:\n${JSON.stringify({ status: 'ACTIVE', verified: true, timestamp: new Date().toISOString() }, null, 2)}`
      }
    }
  }

  if (c.includes('describe-security-groups')) {
    return {
      type: 'output',
      text: `{
  "SecurityGroups": [
    {
      "GroupName": "sg-production-database",
      "GroupId": "sg-048991a2bf03d1",
      "IpPermissions": [
        {
          "FromPort": 5432,
          "ToPort": 5432,
          "IpProtocol": "tcp",
          "IpRanges": [{"CidrIp": "0.0.0.0/0", "Description": "ALERT: Global DB ingress detected"}]
        }
      ]
    }
  ]
}`
    }
  }

  if (c.includes('get-caller-identity')) {
    return {
      type: 'output',
      text: `{
  "UserId": "AIDASAMPLE67SECRET:operator",
  "Account": "123456789012",
  "Arn": "arn:aws:sts::123456789012:assumed-role/CloudSecurityAuditor/sandbox-session"
}`
    }
  }

  if (c.includes('169.254.169.254') && c.includes('meta-data')) {
    return {
      type: 'output',
      text: `HTTP/1.1 200 OK
Content-Type: text/plain

AccessKeyId: ASIA4SAMPLEKEYEXPOSURE
SecretAccessKey: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Token: IQoJb3JpZ2luX2VjEExampleSessionToken...
Expiration: 2026-10-04T22:00:00Z`
    }
  }

  if (c.includes('az account show')) {
    return {
      type: 'output',
      text: `{
  "environmentName": "AzureCloud",
  "id": "9a7f34b2-019a-4c22-98e3-0d5b12879c4a",
  "name": "Production-SecOps-Subscription",
  "state": "Enabled",
  "tenantId": "c4d28e71-91a3-4812-a1b7-d4e5f6a7b8c9",
  "user": { "name": "secops@secloudive.internal", "type": "user" }
}`
    }
  }

  if (c.includes('gcloud') && (c.includes('instances list') || c.includes('compute'))) {
    return {
      type: 'output',
      text: `NAME                ZONE           MACHINE_TYPE  INTERNAL_IP    EXTERNAL_IP     STATUS
web-prod-srv-01     us-central1-a  e2-medium     10.128.0.2     34.68.12.91     RUNNING
bastion-transit-gw  us-central1-b  e2-micro      10.128.0.14    None            RUNNING`
    }
  }

  if (c.includes('kubectl') && c.includes('pods')) {
    return {
      type: 'output',
      text: `NAME                               READY   STATUS    RESTARTS   AGE
cilium-agent-8fx2p                 1/1     Running   0          4d
falco-daemonset-9mkl4              1/1     Running   0          4d
trivy-operator-79d8f6-kqlw2        1/1     Running   0          4d
vault-k8s-agent-injector-67        1/1     Running   0          2d`
    }
  }

  return {
    type: 'output',
    text: `Command executed with exit code 0:\n[sandbox-worker] Process completed without errors in 240ms.`
  }
}
