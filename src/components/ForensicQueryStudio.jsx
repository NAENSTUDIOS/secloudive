import { useState } from 'react'
import { Search, Database, Terminal, CheckCircle2, AlertTriangle, Play, Copy, RefreshCw, FileText, ChevronDown, ChevronRight } from 'lucide-react'

const queryPresets = [
  {
    id: 'access-denied',
    title: 'AccessDenied API Spikes (Brute-Force & Enumeration)',
    engine: 'Amazon Athena (CloudTrail Partition)',
    sql: `SELECT 
  eventTime,
  userIdentity.arn AS principal,
  eventName,
  eventSource,
  errorCode,
  sourceIPAddress
FROM cloudtrail_logs
WHERE errorCode IN ('AccessDenied', 'UnauthorizedOperation')
  AND eventTime >= NOW() - INTERVAL '24' HOUR
ORDER BY eventTime DESC
LIMIT 10;`,
    description: 'Identifies principals attempting to probe AWS services where permissions are blocked, indicating reconnaissance or brute-forcing.',
    results: [
      { time: '2026-09-24T20:12:00Z', principal: 'arn:aws:iam::123456789012:user/deployer-legacy-admin', event: 'RunInstances', source: 'ec2.amazonaws.com', error: 'UnauthorizedOperation', ip: '198.51.100.44', flag: 'High' },
      { time: '2026-09-24T20:12:02Z', principal: 'arn:aws:iam::123456789012:user/deployer-legacy-admin', event: 'DescribeInstances', source: 'ec2.amazonaws.com', error: 'AccessDenied', ip: '198.51.100.44', flag: 'High' },
      { time: '2026-09-24T19:40:15Z', principal: 'arn:aws:iam::123456789012:role/JenkinsWorkerRole', event: 'GetSecretValue', source: 'secretsmanager.amazonaws.com', error: 'AccessDenied', ip: '10.0.12.88', flag: 'Medium' }
    ]
  },
  {
    id: 'root-activity',
    title: 'Root Account Usage Detection',
    engine: 'CloudWatch Logs Insights',
    sql: `fields @timestamp, eventName, userIdentity.type, sourceIPAddress, responseElements
| filter userIdentity.type = 'Root'
| sort @timestamp desc
| limit 20`,
    description: 'Any action taken by the AWS Account Root user is a critical event. Production environments should have zero routine root usage.',
    results: [
      { time: '2026-09-24T16:04:11Z', principal: 'arn:aws:iam::123456789012:root', event: 'ConsoleLogin', source: 'signin.amazonaws.com', error: 'None (MFA Used)', ip: '72.21.198.65', flag: 'Info' },
      { time: '2026-09-24T16:10:00Z', principal: 'arn:aws:iam::123456789012:root', event: 'CreateAccessKey', source: 'iam.amazonaws.com', error: 'None', ip: '72.21.198.65', flag: 'Critical' }
    ]
  },
  {
    id: 's3-bucket-mods',
    title: 'S3 Bucket Policy & ACL Modifications',
    engine: 'Amazon Athena (CloudTrail Partition)',
    sql: `SELECT 
  eventTime,
  userIdentity.arn AS principal,
  eventName,
  requestParameters,
  sourceIPAddress
FROM cloudtrail_logs
WHERE eventName IN ('PutBucketPolicy', 'PutBucketAcl', 'DeletePublicAccessBlock')
ORDER BY eventTime DESC
LIMIT 10;`,
    description: 'Detects unauthorized modifications to S3 storage policies, frequently the root cause of corporate data breaches.',
    results: [
      { time: '2026-09-24T21:02:10Z', principal: 'arn:aws:iam::123456789012:user/alex.dev', event: 'PutBucketPolicy', source: 's3.amazonaws.com', error: 'None', ip: '198.51.100.99', flag: 'Critical' },
      { time: '2026-09-24T14:20:00Z', principal: 'arn:aws:iam::123456789012:role/TerraformDeployer', event: 'PutBucketPolicy', source: 's3.amazonaws.com', error: 'None', ip: '10.0.1.20', flag: 'Low' }
    ]
  },
  {
    id: 'sg-open-internet',
    title: 'Security Groups Opened to Internet (0.0.0.0/0)',
    engine: 'CloudWatch Logs Insights',
    sql: `fields @timestamp, userIdentity.arn, requestParameters.groupId, requestParameters.ipPermissions.items
| filter eventName = 'AuthorizeSecurityGroupIngress'
| filter requestParameters.ipPermissions.items.0.ipRanges.items.0.cidrIp = '0.0.0.0/0'
| sort @timestamp desc`,
    description: 'Flags firewall changes opening ports (such as SSH 22 or RDP 3389) directly to the public internet.',
    results: [
      { time: '2026-09-24T18:30:00Z', principal: 'arn:aws:iam::123456789012:user/contractor-temp', event: 'AuthorizeSecurityGroupIngress', source: 'ec2.amazonaws.com', error: 'None', ip: '198.51.100.77', flag: 'High' }
    ]
  }
]

export default function ForensicQueryStudio() {
  const [selectedPreset, setSelectedPreset] = useState(queryPresets[0])
  const [queryText, setQueryText] = useState(queryPresets[0].sql)
  const [executing, setExecuting] = useState(false)
  const [results, setResults] = useState(queryPresets[0].results)
  const [expandedRow, setExpandedRow] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset)
    setQueryText(preset.sql)
    setResults(preset.results)
    setExpandedRow(null)
  }

  const handleRunQuery = () => {
    setExecuting(true)
    setTimeout(() => {
      setExecuting(false)
      setResults(selectedPreset.results)
    }, 400)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(queryText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="forensic-studio-panel">
      <div className="forensic-studio-header">
        <div className="fsh-title">
          <Database size={20} className="text-cyan" />
          <div>
            <h3>CloudTrail Forensic Query Studio (Athena & CloudWatch)</h3>
            <p>Run simulated Athena SQL and CloudWatch Logs Insights queries to pinpoint root-cause evidence across AWS API events.</p>
          </div>
        </div>
        <div className="fsh-engine-badge">
          <span className="pulse-dot" /> {selectedPreset.engine}
        </div>
      </div>

      {/* Preset Selector */}
      <div className="query-preset-tabs">
        {queryPresets.map(preset => (
          <button
            key={preset.id}
            type="button"
            className={`preset-tab-btn ${selectedPreset.id === preset.id ? 'active' : ''}`}
            onClick={() => handleSelectPreset(preset)}
          >
            <span>{preset.title}</span>
          </button>
        ))}
      </div>

      {/* Query Editor & Controls */}
      <div className="query-editor-card">
        <div className="qe-topbar">
          <span className="qe-label"><Terminal size={14} /> Query Editor ({selectedPreset.engine})</span>
          <div className="qe-actions">
            <button type="button" className="btn-icon-text" onClick={handleCopy}>
              <Copy size={13} /> {copied ? 'Copied!' : 'Copy SQL'}
            </button>
            <button
              type="button"
              className="button button-primary btn-run-query"
              onClick={handleRunQuery}
              disabled={executing}
            >
              {executing ? <RefreshCw size={14} className="spin-icon" /> : <Play size={14} />}
              <span>{executing ? 'Querying Logs...' : 'Execute Forensic Query'}</span>
            </button>
          </div>
        </div>

        <textarea
          className="query-sql-input"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          rows={7}
          spellCheck="false"
        />

        <div className="qe-footer-info">
          <small>{selectedPreset.description}</small>
        </div>
      </div>

      {/* Forensic Results Table */}
      <div className="forensic-results-container">
        <div className="frc-header">
          <h4>Query Results ({results.length} Records Returned)</h4>
          <span className="text-muted">Execution time: 0.38s • Scanned: 4.2 MB</span>
        </div>

        <div className="table-responsive">
          <table className="forensic-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Timestamp (UTC)</th>
                <th>Principal ARN</th>
                <th>Event Name</th>
                <th>Service</th>
                <th>Error Code</th>
                <th>Source IP</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <>
                  <tr
                    key={idx}
                    className={`forensic-row ${expandedRow === idx ? 'expanded' : ''}`}
                    onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
                  >
                    <td>
                      {expandedRow === idx ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </td>
                    <td className="font-mono text-cyan">{row.time}</td>
                    <td className="font-mono text-small" title={row.principal}>
                      {row.principal.length > 35 ? row.principal.slice(0, 32) + '...' : row.principal}
                    </td>
                    <td><code>{row.event}</code></td>
                    <td className="text-muted">{row.source}</td>
                    <td>
                      <span className={`status-pill ${row.error.includes('Denied') || row.error.includes('Operation') ? 'pill-danger' : 'pill-neutral'}`}>
                        {row.error}
                      </span>
                    </td>
                    <td className="font-mono">{row.ip}</td>
                    <td>
                      <span className={`risk-tag risk-${row.flag.toLowerCase()}`}>
                        {row.flag}
                      </span>
                    </td>
                  </tr>
                  {expandedRow === idx && (
                    <tr className="expanded-detail-row" key={`detail-${idx}`}>
                      <td colSpan={8}>
                        <div className="log-detail-box">
                          <div className="ldb-head">
                            <FileText size={14} className="text-cyan" />
                            <strong>Raw CloudTrail Event JSON Representation</strong>
                          </div>
                          <pre>
                            {JSON.stringify({
                              eventVersion: '1.09',
                              userIdentity: {
                                type: 'IAMUser',
                                arn: row.principal,
                                accountId: '123456789012'
                              },
                              eventTime: row.time,
                              eventSource: row.source,
                              eventName: row.event,
                              awsRegion: 'us-east-1',
                              sourceIPAddress: row.ip,
                              errorCode: row.error !== 'None' ? row.error : undefined,
                              errorMessage: row.error !== 'None' ? 'User is not authorized to perform this operation' : undefined,
                              userAgent: 'aws-cli/2.15.15 Python/3.11.6 Linux/5.15.0'
                            }, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
