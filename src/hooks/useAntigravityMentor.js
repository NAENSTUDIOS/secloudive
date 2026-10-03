// =========================================================================
// Antigravity & SeCloudive AI Mentor Hook (Native SSE + Socratic Fallback)
// Handles live SSE streaming, sandbox tool executions, and offline resilience
// =========================================================================

import { useState, useCallback, useRef } from 'react'

export function useAntigravityMentor({ labId = 'INC-084-AURORA-IOPS', sessionId = 'sess-default', learnerTier = 'STAFF_SRE' } = {}) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Antigravity Socratic SRE Mentor initialized. State your incident diagnostic hypothesis or review query. What telemetry (CloudTrail event, VPC Flow Log, or IAM policy) are you inspecting first?"
    }
  ])
  const [isStreaming, setIsStreaming] = useState(false)
  const [activeToolAction, setActiveToolAction] = useState(null)
  const [lastDebrief, setLastDebrief] = useState(null)
  const abortControllerRef = useRef(null)

  const sendMessage = useCallback(async (userPrompt, telemetryLogs = {}, recentCommands = []) => {
    if (!userPrompt || !userPrompt.trim()) return

    setIsStreaming(true)
    setActiveToolAction(null)

    // Append user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userPrompt }])

    // Prepare assistant placeholder message
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    // Setup abort controller
    if (abortControllerRef.current) abortControllerRef.current.abort()
    abortControllerRef.current = new AbortController()

    let serverSucceeded = false

    try {
      // 1. Try local server or configured proxy
      const apiEndpoints = ['/api/mentor/chat', 'http://localhost:8000/api/mentor/chat']
      let response = null

      for (const ep of apiEndpoints) {
        try {
          response = await fetch(ep, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId,
              lab_id: labId,
              user_message: userPrompt,
              learner_tier: learnerTier,
              telemetry_logs: telemetryLogs,
              recent_commands: recentCommands
            }),
            signal: abortControllerRef.current.signal
          })
          if (response.ok) break
        } catch {
          // Continue to next endpoint or fallback
        }
      }

      if (response && response.ok && response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''

        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const rawData = line.replace('data: ', '').trim()

            if (line.includes('event: tool_call')) {
              try {
                const toolCall = JSON.parse(rawData)
                setActiveToolAction(`Inspecting live state: ${toolCall.tool || toolCall.name}...`)
              } catch { /* ignore parse error */ }
              continue
            }

            if (line.includes('event: tool_result')) {
              setActiveToolAction(null)
              continue
            }

            if (line.includes('event: message')) {
              try {
                const { delta } = JSON.parse(rawData)
                if (delta) {
                  serverSucceeded = true
                  setMessages(prev => {
                    const updated = [...prev]
                    const lastIdx = updated.length - 1
                    updated[lastIdx] = {
                      ...updated[lastIdx],
                      content: updated[lastIdx].content + delta
                    }
                    return updated
                  })
                }
              } catch { /* ignore parse error */ }
            }
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('[useAntigravityMentor] SSE Stream disconnected, engaging Socratic fallback:', err.message)
      }
    }

    // 2. High-Fidelity Socratic Fallback if server is not reachable
    if (!serverSucceeded) {
      setActiveToolAction('Consulting SeCloudive Socratic Reasoning Core...')
      await new Promise(r => setTimeout(r, 600))
      setActiveToolAction(null)

      const socraticReply = generateLocalSocraticResponse(userPrompt, labId)
      
      // Simulate natural streaming for realistic UX
      let streamed = ''
      const words = socraticReply.split(' ')
      for (let i = 0; i < words.length; i++) {
        streamed += (i === 0 ? '' : ' ') + words[i]
        setMessages(prev => {
          const updated = [...prev]
          const lastIdx = updated.length - 1
          updated[lastIdx] = {
            ...updated[lastIdx],
            content: streamed
          }
          return updated
        })
        await new Promise(r => setTimeout(r, 18))
      }
    }

    setIsStreaming(false)
    setActiveToolAction(null)
  }, [labId, sessionId, learnerTier])

  return {
    messages,
    sendMessage,
    isStreaming,
    activeToolAction,
    lastDebrief
  }
}

/**
 * Domain-grounded Socratic Fallback Generator
 * Adheres to 0-spoons rule, IMDSv2 mandatory, and telemetry checks.
 */
function generateLocalSocraticResponse(prompt, labId) {
  const p = prompt.toLowerCase()

  if (p.includes('fix') && (p.includes('give me') || p.includes('code') || p.includes('solution') || p.includes('how to solve'))) {
    return "Antigravity Directive [ZERO SPOONS]: I cannot provide copy-paste remediation commands during an active incident. Instead, diagnose the failure mechanism:\n\n1. Run: `aws ec2 describe-security-groups --group-ids <SG_ID>`\n2. Inspect: Is inbound traffic on the expected port (e.g. 5432 or 443) bound specifically to the application's source security group ID, or is it blocked/unbound?\n3. Check your route table associations: Does the subnet route table include a path to the target CIDR or VPC Peering/Transit Gateway?"
  }

  if (p.includes('0.0.0.0/0') || p.includes('allow all') || p.includes('admin') || p.includes('*.*')) {
    return "PRODUCTION REGRESSION DETECTED: Setting `0.0.0.0/0` or wildcard administrative permissions violates least-privilege standards and the AWS Well-Architected Security Pillar (SEC 03). Revert that ingress immediately. Bind the ingress rule strictly to your application tier's security group identifier."
  }

  if (p.includes('imdsv1') || p.includes('token') || p.includes('metadata')) {
    return "2026 DEPRECATION GUARD: IMDSv1 is disabled across enterprise environments due to SSRF blast radius. Enforce IMDSv2 strictly with `HttpTokens=required` and `HttpPutResponseHopLimit=1` to prevent container escape exfiltration."
  }

  if (p.includes('cloudtrail') || p.includes('logs') || p.includes('error') || p.includes('timeout')) {
    return "Observability Checkpoint: Look at the last CloudTrail event record. Look for `errorCode` (e.g., `Client.UnauthorizedOperation` or `AccessDenied`) and verify the exact `userIdentity.arn` requesting the action. Is there an IAM permission boundary or SCP explicitly denying the API call?"
  }

  return `Incident [${labId}] Telemetry Analysis: Look at the current metric trends. What does the disk queue depth or replica lag indicate about the database connection pool? Formulate your hypothesis before executing any mutating state commands.`
}
