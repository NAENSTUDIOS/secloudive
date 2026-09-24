import { useState, useRef, useEffect } from 'react'
import { Terminal, Play, CornerDownLeft, Trash2, HelpCircle, Check, Copy } from 'lucide-react'

export default function InteractiveTerminal({ investigation, onRunCommand }) {
  const [commandInput, setCommandInput] = useState('')
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: `AWS CloudShell v2.9.1 (x86_64) - SOC Analyst Session [Ticket: ${investigation.ticket}]
Target Account: 123456789012 (Production Environment)
Type 'help' to view available investigation commands, or click any command chip below.`
    }
  ])
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalEndRef = useRef(null)
  const inputRef = useRef(null)

  // Scroll to bottom whenever history updates
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  // Build the list of available commands for this incident
  const availableCommands = [
    {
      cmd: 'aws sts get-caller-identity',
      desc: 'Verify current analyst IAM session identity',
      output: JSON.stringify({
        UserId: 'AROAEXAMPLEANALYST:security-session',
        Account: '123456789012',
        Arn: 'arn:aws:sts::123456789012:assumed-role/SecOps-IncidentResponder/analyst-session'
      }, null, 2)
    },
    ...(investigation.terminalCommands || []),
    {
      cmd: 'aws guardduty list-findings --detector-id d-987654321',
      desc: 'Query active GuardDuty detection findings',
      output: JSON.stringify({
        FindingIds: [
          `gd-${investigation.ticket.toLowerCase()}-alert-001`,
          `gd-${investigation.ticket.toLowerCase()}-telemetry-002`
        ]
      }, null, 2)
    }
  ]

  // Default quick commands if specific ones are not defined
  const getQuickCommands = () => {
    if (investigation.terminalCommands && investigation.terminalCommands.length > 0) {
      return investigation.terminalCommands.slice(0, 4)
    }

    if (investigation.categoryKey === 'iam') {
      return [
        {
          cmd: `aws iam get-account-authorization-details --filter Role`,
          desc: 'Query all IAM roles and policies'
        },
        {
          cmd: `aws cloudtrail lookup-events --lookup-attributes AttributeKey=EventSource,AttributeValue=iam.amazonaws.com`,
          desc: 'Query recent IAM CloudTrail events'
        }
      ]
    } else if (investigation.categoryKey === 's3') {
      return [
        {
          cmd: `aws s3api get-public-access-block --bucket ${investigation.ticket.toLowerCase()}-data`,
          desc: 'Check S3 Block Public Access configuration'
        },
        {
          cmd: `aws s3api get-bucket-policy --bucket ${investigation.ticket.toLowerCase()}-data`,
          desc: 'Inspect S3 bucket policy statements'
        }
      ]
    } else if (investigation.categoryKey === 'network') {
      return [
        {
          cmd: `aws ec2 describe-route-tables --filters "Name=vpc-id,Values=vpc-prod-main"`,
          desc: 'Dump VPC route tables and gateway associations'
        },
        {
          cmd: `aws ec2 describe-security-groups --group-names "sg-${investigation.ticket.toLowerCase()}"`,
          desc: 'Inspect inbound and outbound security group rules'
        }
      ]
    } else if (investigation.categoryKey === 'monitoring') {
      return [
        {
          cmd: `aws cloudtrail get-trail-status --name organization-audit-trail`,
          desc: 'Check if CloudTrail logging is currently active'
        },
        {
          cmd: `aws logs describe-metric-filters --log-group-name /aws/cloudtrail/prod`,
          desc: 'List CloudWatch log metric filters'
        }
      ]
    } else {
      return [
        {
          cmd: `aws ec2 describe-instances --filters "Name=tag:Environment,Values=Production"`,
          desc: 'Inspect production compute instances and IAM instance profiles'
        },
        {
          cmd: `aws wafv2 list-web-acls --scope REGIONAL`,
          desc: 'List attached WAF WebACLs'
        }
      ]
    }
  }

  const executeCommand = (cmdStr) => {
    const trimmed = cmdStr.trim()
    if (!trimmed) return

    // Add to command history
    setCommandHistory(prev => [trimmed, ...prev])
    setHistoryIndex(-1)

    // Add user input to terminal output
    const userEntry = { type: 'input', text: `cloudshell:~$ ${trimmed}` }

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([])
      setCommandInput('')
      return
    }

    if (trimmed.toLowerCase() === 'help') {
      const helpOutput = `Available AWS CLI Investigation Commands:
--------------------------------------------------
  aws sts get-caller-identity
  aws guardduty list-findings
${getQuickCommands().map(c => `  ${c.cmd}\n    # ${c.desc}`).join('\n')}
  clear    - Clear terminal screen
  help     - Show this help manual`

      setHistory(prev => [...prev, userEntry, { type: 'output', text: helpOutput }])
      setCommandInput('')
      return
    }

    // Match command
    const matched = availableCommands.find(
      c => c.cmd.toLowerCase() === trimmed.toLowerCase() || trimmed.toLowerCase().startsWith(c.cmd.toLowerCase().slice(0, 20))
    )

    let responseText = ''
    if (matched && matched.output) {
      responseText = matched.output
    } else {
      // Find fallback by keyword
      if (trimmed.includes('s3api') || trimmed.includes('s3')) {
        const s3Evidence = investigation.evidence.find(e => e.type.toLowerCase().includes('s3') || e.name.includes('s3'))
        responseText = s3Evidence ? s3Evidence.content : JSON.stringify({ Status: 'SUCCESS', Details: 'S3 resource queried. Inspect Evidence Locker for raw payload.' }, null, 2)
      } else if (trimmed.includes('cloudtrail') || trimmed.includes('events')) {
        const ctEvidence = investigation.evidence.find(e => e.type.toLowerCase().includes('cloudtrail') || e.name.includes('cloudtrail'))
        responseText = ctEvidence ? ctEvidence.content : JSON.stringify({ Events: ['Event query returned 1 matching security signal. Correlate with CloudTrail artifacts.' ] }, null, 2)
      } else if (trimmed.includes('iam')) {
        const iamEvidence = investigation.evidence.find(e => e.type.toLowerCase().includes('iam') || e.name.includes('policy'))
        responseText = iamEvidence ? iamEvidence.content : JSON.stringify({ Statement: [{ Effect: 'Allow', Action: '*', Resource: '*' }] }, null, 2)
      } else if (trimmed.includes('route') || trimmed.includes('security-group') || trimmed.includes('ec2')) {
        const netEvidence = investigation.evidence.find(e => e.type.toLowerCase().includes('route') || e.type.toLowerCase().includes('network') || e.name.includes('route'))
        responseText = netEvidence ? netEvidence.content : JSON.stringify({ NetworkInterfaces: [{ Status: 'in-use', PublicIp: '54.210.12.88' }] }, null, 2)
      } else {
        responseText = `An error occurred (AccessDenied) when calling the API: User: arn:aws:sts::123456789012:assumed-role/SecOps-IncidentResponder/analyst-session is not authorized to perform: ${trimmed.split(' ')[1] || 'action'} on resource: * with an explicit deny.
Tip: Try running one of the approved incident triage commands listed in 'help'.`
      }
    }

    setHistory(prev => [...prev, userEntry, { type: 'output', text: responseText }])
    setCommandInput('')

    if (onRunCommand) {
      onRunCommand(trimmed)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      executeCommand(commandInput)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1
        setHistoryIndex(nextIdx)
        setCommandInput(commandHistory[nextIdx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const prevIdx = historyIndex - 1
        setHistoryIndex(prevIdx)
        setCommandInput(commandHistory[prevIdx])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCommandInput('')
      }
    }
  }

  return (
    <div className="interactive-terminal-container">
      {/* Terminal Bar */}
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <div className="terminal-title">
          <Terminal size={13} className="text-cyan" />
          <span>AWS CloudShell /// SecOps Incident Live Session [{investigation.ticket}]</span>
        </div>
        <div className="terminal-actions">
          <button
            type="button"
            className="term-icon-btn"
            onClick={() => setHistory([])}
            title="Clear Terminal Screen"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Suggested Command Quick Chips */}
      <div className="terminal-chips-bar">
        <span className="chips-label">TRIAGE QUERIES:</span>
        <div className="chips-scroll">
          {getQuickCommands().map((item, idx) => (
            <button
              key={idx}
              type="button"
              className="term-command-chip"
              onClick={() => {
                setCommandInput(item.cmd)
                executeCommand(item.cmd)
              }}
              title={item.desc}
            >
              <Play size={10} className="chip-play" />
              <span>{item.cmd}</span>
            </button>
          ))}
          <button
            type="button"
            className="term-command-chip chip-help"
            onClick={() => executeCommand('help')}
          >
            <HelpCircle size={10} />
            <span>help</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen Output */}
      <div
        className="terminal-screen"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, idx) => (
          <div key={idx} className={`term-line term-line-${entry.type}`}>
            {entry.type === 'input' ? (
              <span className="term-input-text">{entry.text}</span>
            ) : (
              <pre className="term-output-text">{entry.text}</pre>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Command Input Prompt */}
      <div className="terminal-input-bar">
        <span className="term-prompt-prefix">cloudshell:~$</span>
        <input
          ref={inputRef}
          type="text"
          className="term-input-field"
          placeholder="Enter AWS CLI investigation command (e.g. 'aws sts get-caller-identity' or 'help')..."
          value={commandInput}
          onChange={e => setCommandInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="button"
          className="term-run-btn"
          onClick={() => executeCommand(commandInput)}
          disabled={!commandInput.trim()}
        >
          <CornerDownLeft size={13} />
          <span>Execute</span>
        </button>
      </div>
    </div>
  )
}
