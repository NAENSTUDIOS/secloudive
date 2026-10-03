// =========================================================================
// SeCloudive Interactive Sandbox Terminal Emulator (AWS CLI & LocalStack)
// Provides instant command execution, telemetry capture & mentor synchronization
// =========================================================================

import React, { useState, useRef, useEffect } from 'react'
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react'

const SUGGESTED_COMMANDS = [
  'aws ec2 describe-security-groups --group-names default',
  'aws iam get-role-policy --role-name ProductionAppProfile --policy-name S3Access',
  'aws s3 ls s3://customer-financial-vault --recursive',
  'aws sts get-caller-identity',
  'curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/'
]

export default function TerminalPane({ onCommandExecuted, labId = 'INC-084-AURORA-IOPS' }) {
  const [history, setHistory] = useState([
    {
      type: 'system',
      text: `Antigravity AWS Cloud Sandbox Connected [Session: sess-${labId.toLowerCase()}].\nType 'help' for available CLI commands or select quick-run checks below.`
    }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistoryList, setCommandHistoryList] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [isCopied, setIsCopied] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleExecuteCommand = (cmdToRun) => {
    const rawCmd = (cmdToRun || currentInput).trim()
    if (!rawCmd) return

    // Add to command history list
    setCommandHistoryList(prev => [rawCmd, ...prev])
    setHistoryIdx(-1)

    // Append user input line
    const userLine = { type: 'user', text: rawCmd }
    const outputLine = evaluateCommand(rawCmd)

    setHistory(prev => [...prev, userLine, outputLine])
    setCurrentInput('')

    // Notify parent or Socratic mentor hook
    if (onCommandExecuted) {
      onCommandExecuted(rawCmd, outputLine.text)
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
    setHistory([{ type: 'system', text: 'Terminal output cleared.' }])
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-[#020617] font-mono text-xs overflow-hidden flex flex-col shadow-2xl">
      
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-slate-400 font-semibold ml-2 text-[11px] flex items-center gap-1.5">
            <TerminalIcon size={12} className="text-cyan-400" />
            operator@sandbox-aws-terminal:~ ({labId})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="text-[10px] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded bg-slate-800 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Suggested Quick Commands Bar */}
      <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
        <span className="text-slate-500 flex-shrink-0 text-[10px] uppercase font-bold">Quick Diagnostics:</span>
        {SUGGESTED_COMMANDS.slice(0, 3).map((cmd, i) => (
          <button
            key={i}
            onClick={() => handleExecuteCommand(cmd)}
            className="flex-shrink-0 px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition text-[10px]"
          >
            {cmd.split(' ')[1] || cmd.slice(0, 15)}
          </button>
        ))}
      </div>

      {/* Output Console Buffer */}
      <div
        className="p-4 flex-1 overflow-y-auto max-h-[340px] min-h-[220px] space-y-2 select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, idx) => (
          <div key={idx} className="leading-relaxed whitespace-pre-wrap">
            {entry.type === 'user' && (
              <div className="text-emerald-400 font-bold flex items-start gap-1.5">
                <span className="text-cyan-400">[operator@sandbox ~]$</span>
                <span>{entry.text}</span>
              </div>
            )}
            {entry.type === 'system' && (
              <div className="text-slate-500 italic text-[11px]">{entry.text}</div>
            )}
            {entry.type === 'output' && (
              <div className="text-slate-300 font-mono text-[11px] pl-3 border-l border-slate-800/80">
                {entry.text}
              </div>
            )}
            {entry.type === 'error' && (
              <div className="text-rose-400 font-mono text-[11px] pl-3 border-l border-rose-500/80">
                {entry.text}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <span className="text-cyan-400 font-bold flex-shrink-0">[operator@sandbox ~]$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={e => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter AWS CLI or curl command (e.g., aws sts get-caller-identity)..."
          className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
        />
        <button
          onClick={() => handleExecuteCommand()}
          disabled={!currentInput.trim()}
          className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] disabled:opacity-30 transition flex items-center gap-1"
        >
          <Play size={11} /> Run
        </button>
      </div>

    </div>
  )
}

function evaluateCommand(cmd) {
  const c = cmd.toLowerCase().trim()

  if (c === 'help') {
    return {
      type: 'output',
      text: `Available AWS CLI Diagnostics:
  - aws ec2 describe-security-groups --group-names default
  - aws ec2 describe-instances
  - aws iam get-role-policy --role-name ProductionAppProfile --policy-name S3Access
  - aws s3 ls s3://customer-financial-vault
  - aws sts get-caller-identity
  - curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/
  - clear`
    }
  }

  if (c.includes('describe-security-groups')) {
    return {
      type: 'output',
      text: `{
  "SecurityGroups": [
    {
      "GroupName": "production-aurora-db-sg",
      "GroupId": "sg-048991a2bf03d1",
      "IpPermissions": [
        {
          "FromPort": 5432,
          "ToPort": 5432,
          "IpProtocol": "tcp",
          "IpRanges": [{"CidrIp": "0.0.0.0/0", "Description": "FLAGGED: Open ingress to database port"}]
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
  "UserId": "AROA4567SAMPLE:i-0c897f2e1a90bd",
  "Account": "123456789012",
  "Arn": "arn:aws:sts::123456789012:assumed-role/ProductionAppProfile/i-0c897f2e1a90bd"
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
Expiration: 2026-09-26T18:00:00Z`
    }
  }

  if (c.includes('iam') && c.includes('get-role-policy')) {
    return {
      type: 'output',
      text: `{
  "RoleName": "ProductionAppProfile",
  "PolicyName": "S3Access",
  "PolicyDocument": {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": ["s3:*"],
        "Resource": ["*"]
      }
    ]
  }
}`
    }
  }

  if (c.includes('s3 ls')) {
    return {
      type: 'output',
      text: `2026-09-26 08:30:15   4829104 customers_ssn_export_2026.parquet
2026-09-26 09:12:44  18492048 financial_records_q3.csv.gz
2026-09-26 10:04:02     12499 credentials_backup.env`
    }
  }

  return {
    type: 'output',
    text: `Command executed successfully in LocalStack container: ${cmd}\nExit code: 0`
  }
}
